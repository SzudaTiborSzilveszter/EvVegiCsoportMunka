import { dialogs } from "../data/dialogs.js";

export default class DialogSystem {

    #characterData;
    #dialogs;
    #currentCharacter;
    #currentDialogIndex;

    constructor(characterData) {
        this.#characterData = characterData;
        this.#dialogs = dialogs;
        this.#currentCharacter = "mainCharacter";
        this.#currentDialogIndex = 0;
    }

    getCurrentDialog() {
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
}
