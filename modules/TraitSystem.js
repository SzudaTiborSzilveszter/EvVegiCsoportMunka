/**
 * TraitSystem - Karaktertulajdonságok kezelése
 * 
 * Nyomon követi az 5 személyiségtulajdonságot, amelyek a karakterviselkedést és elérhető dialógusokat befolyásolják:
 * - Empátia: Milyen segítőkész/szívélyes a karakter
 * - Agresszió: Milyen erőszakos/agresszív a karakter
 * - Elkeseredettség: Milyen sürgetőnek érzi az ellátást
 * - Hidegség: Milyen érzelmi távolságtartó/hideg a karakter
 * - Bizalom: Mennyire bízik a karakter másokban
 * 
 * Minden tulajdonság 0-100 közé van korlátozva.
 * 
 * @class TraitSystem
 * @example
 * const traits = new TraitSystem({ empathy: 50, aggression: 30 });
 * traits.modifyTraits({ empathy: 10, aggression: -5 });
 */
export default class TraitSystem {
    /**
     * Tulajdonság értékek objektuma
     * @private
     * @type {Object<string, number>}
     */
    #traits;

    /**
     * Új TraitSystem-t hoz létre
     * 
     * @param {Object} initialTraits - Kezdeti tulajdonság értékek
     * @param {number} [initialTraits.empathy=0] - Kezdeti empátia érték (0-100)
     * @param {number} [initialTraits.aggression=0] - Kezdeti agresszió érték (0-100)
     * @param {number} [initialTraits.desperation=0] - Kezdeti elkeseredettség érték (0-100)
     * @param {number} [initialTraits.coldness=0] - Kezdeti hidegség érték (0-100)
     * @param {number} [initialTraits.trust=0] - Kezdeti bizalom érték (0-100)
     */
    constructor(initialTraits) {
        // Tulajdonságok inicializálása alapértelmezett értékekkel
        this.#traits = {
            empathy: initialTraits?.empathy ?? 0,
            aggression: initialTraits?.aggression ?? 0,
            desperation: initialTraits?.desperation ?? 0,
            coldness: initialTraits?.coldness ?? 0,
            trust: initialTraits?.trust ?? 0
        };
    }

    /**
     * Módosítja a tulajdonság értékeket a megadott mennyiségek szerint
     * 
     * Az értékek automatikusan korlátozottak 0-100 között.
     * 
     * @param {Object} modifier - Módosítandó tulajdonságok delta értékekkel
     * @param {number} [modifier.empathy] - Empátia módosítása
     * @param {number} [modifier.aggression] - Agresszió módosítása
     * @param {number} [modifier.desperation] - Elkeseredettség módosítása
     * @param {number} [modifier.coldness] - Hidegség módosítása
     * @param {number} [modifier.trust] - Bizalom módosítása
     * 
     * @example
     * traits.modifyTraits({ empathy: 10, trust: -5 });
     */
    modifyTraits(modifier) {
        for (const [trait, value] of Object.entries(modifier)) {
            if (this.#traits.hasOwnProperty(trait)) {
                this.#traits[trait] += value;

                // Értékek korlátozása 0-100 között
                if (this.#traits[trait] < 0) this.#traits[trait] = 0;
                if (this.#traits[trait] > 100) this.#traits[trait] = 100;

                console.log(`${trait.toUpperCase()} módosítva: ${this.#traits[trait]}`);
            }
        }
    }

    /**
     * Az adott tulajdonság értékét adja vissza
     * 
     * @param {string} trait - Tulajdonság neve (empathy, aggression, desperation, coldness, trust)
     * @returns {number} Tulajdonság értéke (0-100)
     */
    getTrait(trait) {
        return this.#traits[trait] || 0;
    }

    /**
     * Az összes tulajdonság értékét adja vissza egy új objektumként
     * 
     * @returns {Object<string, number>} Az összes tulajdonság értékét tartalmazó objektum
     */
    getAllTraits() {
        return { ...this.#traits };
    }
}