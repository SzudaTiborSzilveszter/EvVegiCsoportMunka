/**
 * @typedef {Object} DialogChoice
 * @property {string} text
 * @property {string} nextCharacter 
 * @property {number} nextDialogIndex 
 * @property {Object} traitMod 
 */

/**
 * @typedef {Object} DialogProgression
 * @property {string} [setFlag] - Story flag to set when dialog ends
 * @property {string} [nextScene] - Scene to transition to
 */

/**
 * @typedef {Object} DialogAutoNext
 * @property {string} nextCharacter - Next character to speak
 * @property {number} nextDialogIndex - Dialog ID for that character
 */

/**
 * @typedef {Object} Dialog
 * @property {number} id 
 * @property {string} text 
 * @property {DialogChoice[]} choices 
 * @property {DialogProgression} [progression] - Story progression rules
 * @property {DialogAutoNext} [autoNext] - Auto-advance to next character when no choices
 */

export const mainCharacterDialogs = [
    {
        id: 0,
        text: "Már sikerült megfűznöm Angstrom-ot. Találni fog egy dokit. Eddig bármikor szükségem volt rá, mindig segített, most se fog cserben hagyni.",
        emotion: "confident",
        choices: [],
        autoNext: {
            nextCharacter: "sibling",
            nextDialogIndex: 2
        }
    },
    {
        id: 1,
        text: "Addigis, van egy elintézetlen ügyem. Menjünk.",
        emotion: "neutral",
        choices: [],
        progression: {
            setFlag: "visitedAlleyway",
            nextScene: "street"
        }
    },
    {
        id: 2,
        text: "Hmm... Érdekesnek tűnik. megnézem mi van itt bent!",
        emotion: "neutral",
        choices: [],
        progression: {
            nextScene: "alley_storage"
        }
    },
    {
        id: 3,
        text: "Azt hittem van még hátra, de úgy néz ki, ezzel készen vagyok. Vissza az utcára.",
        emotion: "neutral",
        choices: [],
        progression: {
            nextScene: "street"
        }
    },
    {
        id: 4,
        text: "Vissza az apartmanba. Beszélnem kell a testvéremmel.",
        emotion: "neutral",
        choices: [],
        progression: {
            nextScene: "apartmentDay"
        }
    }
]

export const siblingDialogs = [
    {
        id: 0,
        text: "Már megint?",
        emotion: "sad",
        choices: [
            {
                text: "Igen, szétszakad a fejem.",
                nextCharacter: "sibling",
                nextDialogIndex: 1,
                traitMod:{
                    empathy: +1,
                    aggression: 0
                }
            },
            {
                text: "Igen, de kibírom.",
                nextCharacter: "sibling",
                nextDialogIndex: 1,
                traitMod:{
                    empathy: 0,
                    aggression: 0
                }
            },
            {
                text: "Dehogy, nincs semmi baj.",
                nextCharacter: "sibling",
                nextDialogIndex: 1,
                traitMod:{
                    empathy: -1,
                    aggression: +1
                }
            }
        ]
    },
    {
        id: 1,
        text: "Muszáj mihamarabb találnunk egy dokit. Nem halaszthatjuk tovább. Ki tudja meddig fogod még bírni.",
        emotion: "sad",
        choices: [
            {
                text: "Ha még jobban nő a gyakorisága a fájdalmaknak, én sem fogom tudni.",
                nextCharacter: "mainCharacter",
                nextDialogIndex: 0,
                traitMod:{
                    empathy: +1,
                    aggression: 0
                }
            },
            {
                text: "Mindenre van megoldás, erre is ki fogunk találni valamit.",
                nextCharacter: "mainCharacter",
                nextDialogIndex: 0,
                traitMod:{
                    empathy: +2,
                    aggression: -1
                }
            },
            {
                text: "Csak én tudom a határaimat. Én döntöm el meddig bírom.",
                nextCharacter: "mainCharacter",
                nextDialogIndex: 0,
                traitMod:{
                    empathy: -1,
                    aggression: +2
                }
            }
        ]
    },
    {
        id: 2,
        text: "Remélem igazad van. Akármikor találkoztam vele, úgy éreztem valami nincs rendben vele. Szerintem akar tőled valamit.",
        emotion: "surprised",
        choices: [
            {
                text: "Mit gondolsz, tetszem neki?",
                nextCharacter: "mainCharacter",
                nextDialogIndex: 1,
                traitMod:{
                    empathy: 0,
                    aggression: 0
                }
            },
            {
                text: "Ha pénzt akar, akkor rossz fába vágta a fejszét.",
                nextCharacter: "mainCharacter",
                nextDialogIndex: 1,
                traitMod:{
                    empathy: -2,
                    aggression: +1
                }
            },
            {
                text: "Nincs semmim, lassan meg is pusztulok.",
                nextCharacter: "mainCharacter",
                nextDialogIndex: 1,
                traitMod:{
                    empathy: -1,
                    aggression: -1
                }
            }
        ]
    }
];

export const robotDialogs = [
    {
        id: 0,
        text: "Illetékteleneknek belépni tilos!",
        emotion: "angry",
        choices: [
            {
                text: "Nagyon fontos dolgom van bent, muszáj bejutnom!",
                nextCharacter: "robot",
                nextDialogIndex: 1,
                traitMod:{
                    empathy: -1,
                    aggression: 0
                }
            },
            {
                text: "Esetleg meg tudlak győzni valahogy? (Megvesztegetési kísérlet)",
                nextCharacter: "robot",
                nextDialogIndex: 2,
                traitMod:{
                    empathy: 0,
                    aggression: -2
                }
            },
            {
                text: "El az utamból! Rossz napom van, nem akarsz velem packázni! (Aggresszió kísérlet)",
                nextCharacter: "robot",
                nextDialogIndex: 3,
                traitMod:{
                    empathy: 0,
                    aggression: -7
                }
            }
        ]
    },
    {
        id: 1,
        text: "Persze, ha lenne egy Eddie-m minden nyomorultra aki egy ilyen béna szöveggel próbált bejutni, már nyugodtan vissza vonulhatnék.",
        emotion: "angry",
        choices: [
            {
                text: "Élet, halál kérdése. Nem könyörögnék így, ha lenne más választásom.",
                nextCharacter: "robot",
                nextDialogIndex: 4,
                traitMod:{
                    empathy: 0,
                    aggression: 0
                }
            },
            {
                text: "Esetleg meg tudlak győzni valahogy? (Megvesztegetési kísérlet)",
                nextCharacter: "robot",
                nextDialogIndex: 2,
                traitMod:{
                    empathy: 0,
                    aggression: -2
                }
            },
            {
                text: "El az utamból! Rossz napom van, nem akarsz velem packázni! (Aggresszió kísérlet)",
                nextCharacter: "robot",
                nextDialogIndex: 3,
                traitMod:{
                    empathy: 0,
                    aggression: -3
                }
            }
        ]
    },
    {
        id: 2,
        text: "Azt hiszed ilyen kicsi az önbecsülésem? Hát el kell, hogy áruljam, nagyon is komolyan veszem a munkámat. 500 eddie és bemehetsz.",
        emotion: "confident",
        choices: [
            {
                text: "*A pénz kifizetése*",
                nextCharacter: "robot",
                nextDialogIndex: 5,
                traitMod:{
                    empathy: 0,
                    aggression: 0
                }
            },
            {
                text: "200! Ennél jobb ajánlatot nem kapsz! (Megvesztegetési kísérlet)",
                nextCharacter: "robot",
                nextDialogIndex: 6,
                traitMod:{
                    empathy: 0,
                    aggression: -2
                }
            },
            {
                text: "El az utamból! Rossz napom van, nem akarsz velem packázni! (Aggresszió kísérlet)",
                nextCharacter: "robot",
                nextDialogIndex: 3,
                traitMod:{
                    empathy: 0,
                    aggression: -3
                }
            },
            {
                text: "Nagyon fontos dolgom van bent, muszáj bejutnom!",
                nextCharacter: "robot",
                nextDialogIndex: 1,
                traitMod:{
                    empathy: -1,
                    aggression: 0
                }
            }
        ]
    },
    {
        id: 3,
        text: "Elnézést kérek, nem akartalak megsérteni! Tessék, menj csak be!",
        emotion: "neutral",
        choices: [],
        progression: {
            setFlag: "robotAggression",
            nextScene: "alleyway"
        }
    },
    {
        id: 4,
        text: "A nem az nem! Na tünés innen!",
        emotion: "angry",
        choices: [
            {
                text: "*Beszélgetés befejezése*",
                nextCharacter: "mainCharacter",
                nextDialogIndex: 1,
                traitMod:{
                    empathy: 0,
                    aggression: 0
                }
            },
            {
                text: "Esetleg meg tudlak győzni valahogy? (Megvesztegetési kísérlet)",
                nextCharacter: "robot",
                nextDialogIndex: 2,
                traitMod:{
                    empathy: 0,
                    aggression: -2
                }
            },
            {
                text: "El az utamból! Rossz napom van, nem akarsz velem packázni! (Aggresszió kísérlet)",
                nextCharacter: "robot",
                nextDialogIndex: 3,
                traitMod:{
                    empathy: 0,
                    aggression: -7
                }
            }
        ]
    },
    {
        id: 5,
        text: "Köszönöm! Ezzel akkor tisztában vagyunk. Menj csak be, de viselkedj nyugodtan.",
        emotion: "confident",
        choices: [],
        progression: {
            setFlag: "robotBribed500",
            nextScene: "alleyway"
        }
    },
    {
        id: 6,
        text: "Valahogy nem lepödök meg, hogy csak 200-ad van. De látom, hogy többet nem tudnék kiszedni belőled. Egye fene, menj be, de meg egy mukkot se halljak felőled.",
        emotion: "happy",
        choices: [],
        progression: {
            setFlag: "robotBribed200",
            nextScene: "alleyway"
        }
    }
];

export const dialogs = {
    mainCharacter: mainCharacterDialogs,
    sibling: siblingDialogs,
    robot: robotDialogs
};
