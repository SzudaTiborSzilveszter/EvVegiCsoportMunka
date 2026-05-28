/**
 * @typedef {Object} ItemDefinition
 * @property {string} id - Egyedi tárgy azonosító
 * @property {string} name - A tárgy megjelenítési neve
 * @property {boolean} stackable - Hogy a tárgy halmozható-e a leltárban
 * @property {string} description - Tárgy leírása/lore
 * @property {number} [quantity] - Kezdeti mennyiség (halmozható tárgyakhoz)
 */

/**
 * Tárgy definíciók adatbázisa
 * 
 * Tartalmazza az összes játékban elérhető tárgyat azok tulajdonságaival.
 * A halmozható tárgyak kombinálhatók a leltárban, a nem halmozható tárgyak egyenként foglalnak egy helyet.
 * 
 * @type {Object<string, ItemDefinition>}
 */
export const ITEMS = {
    'adat_chip': {
        id: 'adat_chip',
        name: 'Adat-chip',
        stackable: false,
        description: 'Titkosított vállalati adatokkal.'
    },
    'eurodollar': {
        id: 'eurodollar',
        name: 'Eurodollar',
        stackable: true,
        description: 'Night City hivatalos fizetőeszköze.'
    },
    'broken_neural_link': {
        id: 'broken_neural_link',
        name: 'Sérült Neurális Link',
        stackable: false,
        description: 'Ebből kellene kinyerni az adatokat, de a csatlakozója tiszta rozsda.'
    },
    'synth_caffeine': {
        id: 'synth_caffeine',
        name: 'Neon-Koffein tabletta',
        stackable: true,
        quantity: 1,
        description: '36 óra ébrenlét.'
    },
    'dohany':{
        id: 'dohany',
        name: 'Dohány (Sly-moka)',
        stackable: true,
        quantity: 1,
        description: 'Ritka kincs a szintetikus világban. Egy doboz árából egy egész lakást bérelhetnél a Peremvidéken.'
    },
    'ripper_scalpel':{
        id: 'ripper_scalpel',
        name: 'Rozsdás Ripper-szike',
        stackable: false,
        description: 'Nem steril, de a célnak megfelel, ha gyorsan kell kiszedni egy implantot.'
    },
    'drone_pickup': {
        id: 'drone_pickup',
        name: 'Ellenőrzési Drone',
        stackable: false,
        description: 'Egy kis, összetört felderítő drón. Talán még működik.'
    },
    'storage_safe': {
        id: 'storage_safe',
        name: 'Furcsa széf',
        stackable: 'false',
        description: 'Egy kis zugban eldugott széf'
    }
}