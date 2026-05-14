/**
 * Minigame Configuration Data
 * Defines all available minigames, their properties, and success/failure outcomes
 */

/**
 * @typedef {Object} MinigameConfig
 * @property {string} type - Game type ("lockpicking", "hacking", "puzzle")
 * @property {number} difficulty - Difficulty level (1-5)
 * @property {Object} onSuccess - What happens on success
 * @property {string} onSuccess.character - Character to talk to after success
 * @property {number} onSuccess.dialogIndex - Dialog ID to show after success
 * @property {Object} onFailure - What happens on failure
 * @property {string} onFailure.character - Character to talk to after failure
 * @property {number} onFailure.dialogIndex - Dialog ID to show after failure
 */

export const minigames = {
    /**
     * LOCKPICKING GAMES
     */
    lockpicking_1: {
        type: 'lockpicking',
        difficulty: 2,
        description: 'Simple door lock',
        onSuccess: {
            character: 'mainCharacter',
            dialogIndex: 0
        },
        onFailure: {
            character: 'mainCharacter',
            dialogIndex: 0
        }
    },

    lockpicking_2: {
        type: 'lockpicking',
        difficulty: 4,
        description: 'Security door lock',
        onSuccess: {
            character: 'sibling',
            dialogIndex: 0
        },
        onFailure: {
            character: 'sibling',
            dialogIndex: 1
        }
    },

    /**
     * HACKING GAMES
     */
    hacking_1: {
        type: 'hacking',
        difficulty: 5,
        description: 'Simple terminal',
        onSuccess: {
            character: 'mainCharacter',
            dialogIndex: 0
        },
        onFailure: {
            character: 'mainCharacter',
            dialogIndex: 0
        }
    },

    hacking_2: {
        type: 'hacking',
        difficulty: 5,
        description: 'Military firewall',
        onSuccess: {
            character: 'sibling',
            dialogIndex: 2
        },
        onFailure: {
            character: 'sibling',
            dialogIndex: 1
        }
    },

    /**
     * PUZZLE GAMES
     */
    puzzle_1: {
        type: 'puzzle',
        difficulty: 1,
        description: 'Simple pattern',
        onSuccess: {
            character: 'mainCharacter',
            dialogIndex: 0
        },
        onFailure: {
            character: 'mainCharacter',
            dialogIndex: 0
        }
    },

    puzzle_2: {
        type: 'puzzle',
        difficulty: 3,
        description: 'Complex cipher',
        onSuccess: {
            character: 'sibling',
            dialogIndex: 0
        },
        onFailure: {
            character: 'sibling',
            dialogIndex: 1
        }
    }
};
