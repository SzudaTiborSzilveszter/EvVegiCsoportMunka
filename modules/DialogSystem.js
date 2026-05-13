import { dialogs } from "../data/dialogs.js";

export default class DialogSystem {

    #characterData;
    #dialogs;
    #currentCharacter;
    #currentDialogIndex;

    constructor(characterData) {
        this.#characterData = characterData;
        this.#dialogs = dialogs;
        this.#currentCharacter = null;
        this.#currentDialogIndex = null;
    }

    /**
     * Start a new dialog conversation
     * @param {string} character - Character key (e.g., "mainCharacter", "sibling")
     * @param {number} dialogIndex - Dialog ID to start with
     */
    startDialog(character, dialogIndex) {
        this.#currentCharacter = character;
        this.#currentDialogIndex = dialogIndex;
    }

    getCurrentDialog() {
        if (!this.#currentCharacter) return null;
        const characterDialogs = this.#dialogs[this.#currentCharacter];
        return characterDialogs.find((d) => d.id === this.#currentDialogIndex);
    }

    getDialogText() {
        const dialog = this.getCurrentDialog();
        return dialog ? dialog.text : "";
    }

    getChoices() {
        const dialog = this.getCurrentDialog();
        return dialog ? dialog.choices : [];
    }

    hasChoices() {
        const choices = this.getChoices();
        return choices.length > 0;
    }

    selectChoice(choiceIndex) {
        const dialog = this.getCurrentDialog();
        const choice = dialog.choices[choiceIndex];

        if (this.#currentCharacter === "mainCharacter" && choice.traitMod) {
            this.#characterData.modifyTraits(choice.traitMod);
        }

        this.#currentCharacter = choice.nextCharacter;
        this.#currentDialogIndex = choice.nextDialogIndex;

        return true;
    }

    getCurrentCharacter() {
        return this.#currentCharacter;
    }

    getCurrentDialogIndex() {
        return this.#currentDialogIndex;
    }

    isConversationActive() {
        return this.#currentCharacter !== null;
    }

    endConversation() {
        this.#currentCharacter = null;
        this.#currentDialogIndex = null;
    }
}
