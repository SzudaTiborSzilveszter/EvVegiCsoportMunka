/**
 * @typedef {Object} DialogChoice
 * @property {string} text
 * @property {string} nextCharacter 
 * @property {number} nextDialogIndex 
 * @property {Object} traitMod 
 */

/**
 * @typedef {Object} Dialog
 * @property {number} id 
 * @property {string} text 
 * @property {DialogChoice[]} choices 
 */

export const mainCharacterDialogs = [
    {
        id: 0,
        text: "Teszt szöveg",
        choices: [
            {
                text: "Elso válaszlehetőség",
                nextCharacter: "sibling",
                nextDialogIndex: 1,
                traitMod:{
                    empathy: +2,
                    aggression: -1
                }
            },
            {
                text: "Masodik válaszlehetőség",
                nextCharacter: "sibling",
                nextDialogIndex: 2,
                traitMod:{
                    empathy: -3,
                    aggression: +4
                }
            },
            {
                text: "Harmadik válaszlehetőség",
                nextCharacter: "sibling",
                nextDialogIndex: 3,
                traitMod:{
                    empathy: -3,
                    aggression: -2
                }
            }
        ]
    }
]

export const siblingDialogs = [
    {
        id: 0,
        text: "Hey, végre felkeltél!",
        choices: [
            {
                text: "Mi történt?",
                nextCharacter: "mainCharacter",
                nextDialogIndex: 1,
                traitMod:{
                    empathy: +2,
                    aggression: -1
                }
            },
            {
                text: "Hagyj magamra!",
                nextCharacter: "mainCharacter",
                nextDialogIndex: 2,
                traitMod:{
                    empathy: -2,
                    aggression: +3
                }
            }
        ]
    },
    {
        id: 1,
        text: "Az implant megint melózik. Tudsz valamit csinálni?",
        choices: [
            {
                text: "Még nem, de találunk megoldást.",
                nextCharacter: "mainCharacter",
                nextDialogIndex: 1,
                traitMod:{
                    empathy: +1,
                    aggression: 0
                }
            }
        ]
    },
    {
        id: 2,
        text: "Oké, oké... nem akarom idegesíteni az implanttal.",
        choices: []
    }
];


export const dialogs = {
    mainCharacter: mainCharacterDialogs,
    sibling: siblingDialogs
};
