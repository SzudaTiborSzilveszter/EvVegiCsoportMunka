/**
 * InventoryUI - Leltár UI komponens
 * 
 * Kezeli:
 * - Leltár megjelenítése
 * - Tárgyak listázása
 * - Tárgy információk
 * - Leltár ablak nyitása/zárása
 * 
 * @class InventoryUI
 * @example
 * const inventoryUI = new InventoryUI(inventory, container);
 * inventoryUI.update();
 */
export default class InventoryUI {
    /**
     * Leltár rendszer referencia
     * @private
     * @type {InventorySystem}
     */
    inventory;

    /**
     * UI konténer elem
     * @private
     * @type {HTMLElement}
     */
    container;

    /**
     * Leltár ablak nyitva-e
     * @private
     * @type {boolean}
     */
    isOpen = false;

    /**
     * Új InventoryUI-t hoz létre
     * 
     * @param {InventorySystem} inventory - Leltár kezelő
     * @param {HTMLElement} container - Konténer elem
     */
    constructor(inventory, container) {
        this.inventory = inventory;
        this.container = container;
        this.isOpen = false;
        this.#init();
    }

    /**
     * UI inicializálása
     * @private
     */
    #init() {
        // Hátizsák gomb létrehozása
        this.btn = document.createElement('button');
        this.btn.id = 'inventory-toggle';
        this.btn.innerHTML = '🎒';
        this.btn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 999;
            padding: 14px 16px;
            background: linear-gradient(135deg, rgba(0, 102, 255, 0.3) 0%, rgba(102, 51, 255, 0.2) 100%);
            border: 2px solid #0066ff;
            color: #ffffff;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            font-size: 20px;
            transition: all 0.3s ease;
            clip-path: polygon(0% 0%, calc(100% - 8px) 0%, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px, 8px 0%);
            box-shadow: 0 0 15px rgba(0, 102, 255, 0.4), inset 0 0 10px rgba(0, 102, 255, 0.15);
        `;
        
        this.btn.addEventListener('mouseenter', () => {
            this.btn.style.boxShadow = '0 0 25px rgba(0, 102, 255, 0.7), inset 0 0 15px rgba(0, 102, 255, 0.3)';
            this.btn.style.transform = 'scale(1.1)';
        });
        
        this.btn.addEventListener('mouseleave', () => {
            this.btn.style.boxShadow = '0 0 15px rgba(0, 102, 255, 0.4), inset 0 0 10px rgba(0, 102, 255, 0.15)';
            this.btn.style.transform = 'scale(1)';
        });
        
        // Create inventory panel
        this.panel = document.createElement('div');
        this.panel.id = 'inventory-panel';
        this.panel.style.cssText = `
            position: fixed;
            bottom: 120px;
            right: 30px;
            width: 300px;
            max-height: 400px;
            background: linear-gradient(135deg, rgba(15, 10, 50, 0.95) 0%, rgba(25, 15, 70, 0.95) 100%);
            border: 3px solid #0066ff;
            color: #e0e0ff;
            display: none;
            padding: 20px;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            z-index: 998;
            clip-path: polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px, 12px 0%);
            box-shadow: 0 0 30px rgba(0, 102, 255, 0.5), inset 0 0 20px rgba(0, 102, 255, 0.15);
        `;
        
        document.body.appendChild(this.btn);
        document.body.appendChild(this.panel);

        this.btn.onclick = () => this.toggle();
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.panel.style.display = this.isOpen ? 'block' : 'none';
        if (this.isOpen) this.render();
    }

    render() {
        const items = this.inventory.getItems();
        this.panel.innerHTML = `
            <div style="border-bottom: 2px solid #0066ff; padding-bottom: 10px; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #ffffff; text-shadow: 0 0 10px #0066ff; letter-spacing: 2px;">INVENTORY</h3>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #6633ff;">${items.length}/20</p>
            </div>
        `;
        
        if (items.length === 0) {
            this.panel.innerHTML += '<p style="color: #6633ff; font-style: italic;">Empty...</p>';
        } else {
            const list = document.createElement('ul');
            list.style.cssText = 'list-style: none; padding: 0; margin: 0;';
            
            items.forEach(item => {
                const li = document.createElement('li');
                li.style.cssText = `
                    padding: 8px;
                    margin-bottom: 8px;
                    background: rgba(0, 102, 255, 0.1);
                    border-left: 3px solid #6633ff;
                    cursor: help;
                    transition: all 0.2s ease;
                `;
                
                li.addEventListener('mouseenter', () => {
                    li.style.background = 'rgba(0, 102, 255, 0.2)';
                    li.style.boxShadow = '0 0 10px rgba(0, 102, 255, 0.3)';
                });
                
                li.addEventListener('mouseleave', () => {
                    li.style.background = 'rgba(0, 102, 255, 0.1)';
                    li.style.boxShadow = 'none';
                });
                
                const quantity = item.quantity ? ` x${item.quantity}` : '';
                li.innerHTML = `<strong style="color: #ffffff;">${item.name}</strong><span style="color: #6633ff; float: right;">${quantity}</span><br/><small style="color: #0066ff; font-size: 11px;">${item.description}</small>`;
                li.title = item.description;
                list.appendChild(li);
            });
            this.panel.appendChild(list);
        }
    }
}