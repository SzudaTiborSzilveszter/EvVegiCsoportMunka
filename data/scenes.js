/**
 * Scene definitions for the game
 * Character sprites are automatically loaded from characters.js
 * Scenes only define positioning and interactions
 */

export const scenes = {
    apartmentDay: {
        id: 'apartmentDay',
        background: 'assets/backgrounds/apartment_day.png',
        ambientOpacity: 0.8,
        characters: [
            {
                character: 'sibling',
                x: 25,
                y: 30,
                scale: 1.2,
                zIndex: 2,
                flip: false,
                onClickDialog: {
                    character: 'sibling',
                    dialogIndex: 0
                }
            },
            {
                character: 'mainCharacter',
                x: 65,
                y: 35,
                scale: 1,
                zIndex: 1,
                flip: true,
                onClickDialog: {
                    character: 'mainCharacter',
                    dialogIndex: 0
                }
            }
        ],
        items: [
            {
                itemId: 'drone_pickup',
                sprite: 'assets/sprites/drone_pickup.png',
                x: 50,
                y: 60,
                scale: 0.8,
                zIndex: 5,
                opacity: 1
            }
        ],
        music: 'mrambient.mp3'
    },

    apartmentNight: {
        id: 'apartmentNight',
        background: 'assets/backgrounds/apartment_night.png',
        ambientOpacity: 0.5,
        characters: [
            {
                character: 'sibling',
                x: 30,
                y: 25,
                scale: 1,
                zIndex: 2,
                onClickDialog: {
                    character: 'sibling',
                    dialogIndex: 1
                }
            }
        ],
        music: 'mrambient.mp3'
    },

    street: {
        id: 'street',
        background: 'assets/backgrounds/street.png',
        ambientOpacity: 0.9,
        characters: [
            {
                character: 'robot',
                x: 70,
                y: 28,
                scale: 0.5,
                zIndex: 1,
                onClickDialog: {
                    character: 'robot',
                    dialogIndex: 0
                }
            }
        ],
        music: 'alleyAmbiance.mp3'
    },

    empty: {
        id: 'empty',
        background: null,
        ambientOpacity: 1,
        characters: []
    }
};
