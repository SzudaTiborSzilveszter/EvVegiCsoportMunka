import { ITEMS } from '../data/items.js';

/**
 * InventorySystem - Játékos leltárának és tárgyak kezelésének menedzselése
 * 
 * Funkciók:
 * - Tárgyak hozzáadása/eltávolítása a leltárból
 * - Halmozható tárgyak összevonása
 * - Leltár kapacitás kezelése (alapértelmezett 20 hely)
 * - Tárgy mennyiség nyomon követése
 * 
 * @class InventorySystem
 * @example
 * const inventory = new InventorySystem(20);
 * inventory.addItem('adat_chip');
 * inventory.addItem('eurodollar');
 */
export class InventorySystem {
    /**
     * Leltárban lévő tárgyak tömbje
     * @private
     * @type {Array<Object>}
     */
    #items;

    /**
     * Maximális leltár helyek száma
     * @type {number}
     */
    maxSlots;

    /**
     * Új InventorySystem-t hoz létre
     * 
     * @param {number} [maxSlots=20] - Maximum leltár helyek száma
     */
    constructor(maxSlots = 20) {
        this.#items = [];
        this.maxSlots = maxSlots;
    }

    /**
     * Tárgyat ad hozzá a leltárhoz
     * 
     * Ha a tárgy halmozható és már létezik a leltárban, akkor növeli a mennyiséget.
     * Egyébként új helyként hozzáadja.
     * 
     * @param {string|Object} itemOrId - Tárgy ID stringje vagy tárgy objektum
     * @param {string} itemOrId.id - Egyedi tárgy azonosító
     * @param {string} itemOrId.name - Megjelenítési név
     * @param {boolean} itemOrId.stackable - Halmozható-e a tárgy
     * @param {string} itemOrId.description - Tárgy leírása
     * @param {number} [itemOrId.quantity=1] - Tárgy mennyisége
     * 
     * @returns {boolean} Igaz, ha hozzáadásra került, hamis, ha leltár megtelt
     * 
     * @example
     * inventory.addItem('adat_chip');
     * inventory.addItem({ id: 'custom', name: 'Egyéni tárgy', stackable: false });
     */
    addItem(itemOrId) {
        let item;

        // If string ID is provided, look up from ITEMS database
        if (typeof itemOrId === 'string') {
            const baseItem = ITEMS[itemOrId]; 
            
            if (!baseItem) {
                console.error(`[Inventory] Error: Item ID '${itemOrId}' not found in database!`);
                return false;
            }
            
            // Create a copy so the original database isn't modified
            item = { ...baseItem, quantity: baseItem.quantity || 1 };
        } else {
            item = itemOrId;
        }

        // Handle stackable items
        if (item.stackable) {
            const existing = this.#items.find(i => i.id === item.id);
            if (existing) {
                existing.quantity += item.quantity || 1;
                console.log(`[Inventory] ${item.name} quantity increased.`);
                return true;
            }
        }

        // Check inventory capacity
        if (this.#items.length >= this.maxSlots) {
            console.warn("[Inventory] Inventory is full!");
            return false;
        }

        this.#items.push(item);
        console.log(`[Inventory] ${item.name} added to inventory.`);
        return true;
    }
    
    /**
     * Az összes leltárban lévő tárgyat adja vissza
     * 
     * @returns {Array<Object>} A leltárban lévő tárgyak tömbje
     */
    getItems() { 
        return this.#items; 
    }
}