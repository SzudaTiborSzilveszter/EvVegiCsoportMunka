import { ITEMS } from '../data/items.js';

export class InventorySystem {
    constructor(maxSlots = 20) {
        this.items = [];
        this.maxSlots = maxSlots;
    }

    addItem(itemOrId) {
        let item;

        // Ha stringet kapunk, kikeresük az ITEMS objektumból az ID alapján
        if (typeof itemOrId === 'string') {
            const baseItem = ITEMS[itemOrId]; 
            
            if (!baseItem) {
                console.error(`[Inventory] Hiba: '${itemOrId}' ID nem található az adatbázisban!`);
                return false;
            }
            
            // Létrehozunk egy másolatot, hogy az eredeti adatbázis ne változzon
            item = { ...baseItem, quantity: baseItem.quantity || 1 };
        } else {
            item = itemOrId;
        }

        // Stackable (halmozási) logika
        if (item.stackable) {
            const existing = this.items.find(i => i.id === item.id);
            if (existing) {
                existing.quantity += item.quantity || 1;
                console.log(`[Inventory] ${item.name} mennyisége nőtt.`);
                return true;
            }
        }

        // Férőhely ellenőrzés
        if (this.items.length >= this.maxSlots) {
            console.warn("Inventory megtelt!");
            return false;
        }

        this.items.push(item);
        console.log(`[Inventory] ${item.name} felvéve.`);
        return true;
    }
    
    getItems() { return this.items; }
}