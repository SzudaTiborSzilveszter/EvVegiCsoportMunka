/**
 * @typedef {Object} Item
 * @property {string} id - Egyedi azonosító
 * @property {string} name - Tárgy neve
 * @property {boolean} stackable - Stackelhető-e
 * @property {number} quantity - Mennyiség (ha stackable)
 * @property {string} description - Leírás
 * @property {number} rarity - Ritkaság (1-5)
 */

export class InventorySystem {
    /**
     * @param {number} maxSlots - Maximum férőhely (alapértelmezett: 20)
     */
    constructor(maxSlots = 20) {
        this.items = []; 
        this.maxSlots = maxSlots;   
    }

    /**
     * Tárgy hozzáadása az inventoryhoz
     * @param {Object} item - Hozzáadandó tárgy
     * @returns {boolean} - Sikerült-e a hozzáadás
     */
    addItem(item) {
        if (item.stackable) {
            const existing = this.items.find(i => i.id === item.id);
            if (existing) {
                existing.quantity += item.quantity || 1;
                console.log(`[Inventory] Added ${item.quantity || 1} to ${item.name}.`);
                return true;
            }
        }

        // 2. Ellenőrizzük, van-e még szabad hely
        if (this.items.length >= this.maxSlots) {
            console.warn("Inventory tele van! Nem lehet több tárgyat felvenni.");
            return false;
        }

        // 3. Új tárgy hozzáadása
        this.items.push(item);
        console.log(`[Inventory] ${item.name} hozzáadva.`);
        return true;
    }

    /**
     * Tárgy eltávolítása
     * @param {string} itemId - A tárgy azonosítója
     * @param {number} quantity - Mennyit vegyünk el
     */
    removeItem(itemId, quantity = 1) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) return false;

        if (item.stackable) {
            item.quantity -= quantity;
            // Ha elfogyott a mennyiség, kivesszük a listából
            if (item.quantity <= 0) {
                this.items = this.items.filter(i => i.id !== itemId);
            }
        } else {
            // Nem stackelhető tárgynál simán töröljük
            this.items = this.items.filter(i => i.id !== itemId);
        }
        return true;
    }

    /**
     * Tárgy használata
     * @param {string} itemId - A használni kívánt tárgy ID-ja
     */
    useItem(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) {
            console.error("Nincs ilyen tárgy az inventoryban!");
            return false;
        }

        console.log(`[Inventory] Használatban: ${item.name}`);
        // Itt jöhet az item-specifikus logika (pl. HP töltés)
        return true;
    }

    /**
     * Inventory tartalmának lekérése (UI-hoz)
     */
    getItems() {
        return this.items;
    }
}