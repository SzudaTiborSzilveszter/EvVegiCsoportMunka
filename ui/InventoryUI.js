// ui/InventoryUI.js
export default class InventoryUI {
    constructor(inventory, container) {
        this.inventory = inventory;
        this.container = container;
        this.isOpen = false;
        this.#init();
    }

    #init() {
        // Gomb létrehozása a jobb alsó sarokba
        this.btn = document.createElement('button');
        this.btn.id = 'inventory-toggle';
        this.btn.innerText = '🎒 TASKA';
        this.btn.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:100; padding:10px; background:#00f2ff; color:#000; border:none; cursor:pointer; font-family:monospace; font-weight:bold;';
        
        // Panel létrehozása (alapból rejtett)
        this.panel = document.createElement('div');
        this.panel.id = 'inventory-panel';
        this.panel.style.cssText = 'position:fixed; bottom:70px; right:20px; width:250px; height:300px; background:rgba(0,0,0,0.9); border:2px solid #00f2ff; color:#00f2ff; display:none; padding:15px; overflow-y:auto; font-family:monospace;';
        
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
        this.panel.innerHTML = '<h3>--- INVENTORY ---</h3>';
        
        if (items.length === 0) {
            this.panel.innerHTML += '<p>Üres...</p>';
        } else {
            const list = document.createElement('ul');
            items.forEach(item => {
                const li = document.createElement('li');
                li.innerText = `${item.name} ${item.quantity ? 'x'+item.quantity : ''}`;
                li.title = item.description;
                list.appendChild(li);
            });
            this.panel.appendChild(list);
        }
    }
}