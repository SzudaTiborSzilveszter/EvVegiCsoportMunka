export default class TraitSystem {
    /**
     * @param {Object} initialTraits - Alapértékek a traits.js-ből
     */
    constructor(initialTraits) {
        // Inicializáljuk a traiteket (Empathy, Aggression, Desperation, Coldness, Trust)
        this.traits = {
            empathy: initialTraits?.empathy ?? 0,
            aggression: initialTraits?.aggression ?? 0,
            desperation: initialTraits?.desperation ?? 0,
            coldness: initialTraits?.coldness ?? 0,
            trust: initialTraits?.trust ?? 0
        };
    }

    /**
     * Módosítja az értékeket. Példa modifier: { empathy: 10, trust: -5 }
     */
    modifyTraits(modifier) {
        for (const [trait, value] of Object.entries(modifier)) {
            if (this.traits.hasOwnProperty(trait)) {
                this.traits[trait] += value;

                // Határértékek kezelése: ne menjen 0 alá és 100 fölé
                if (this.traits[trait] < 0) this.traits[trait] = 0;
                if (this.traits[trait] > 100) this.traits[trait] = 100;

                console.log(`${trait.toUpperCase()} módosult: ${this.traits[trait]}`);
            }
        }
    }

    getTrait(trait) {
        return this.traits[trait] || 0;
    }

    getAllTraits() {
        return { ...this.traits };
    }
}