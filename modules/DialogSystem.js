import { dialogs } from "../data/dialogs.js";

/**
 * DialogSystem - Dialógus állapotkezelés és előrehaladás
 * 
 * Kezeli:
 * - Dialógus beszélgetés állapotát
 * - Választás kiválasztás és karakter váltást
 * - Karaktertulajdonság módosítást a választások alapján
 * - Dialógus előrehaladást a történetekben
 * 
 * @class DialogSystem
 * @example
 * const dialogSystem = new DialogSystem(characterData);
 * dialogSystem.startDialog('sibling', 0);
 * const text = dialogSystem.getDialogText();
 * dialogSystem.selectChoice(0);
 */
export default class DialogSystem {

    /**
     * Karakter adatok objektum (tulajdonság módosításhoz)
     * @private
     * @type {Object}
     */
    #characterData;

    /**
     * Összes dialógus definíció karakterenként
     * @private
     * @type {Object<string, Array<Object>>}
     */
    #dialogs;

    /**
     * Jelenleg beszélő karakter
     * @private
     * @type {string|null}
     */
    #currentCharacter;

    /**
     * Jelenlegi dialógus ID a karakter dialógus halmazán belül
     * @private
     * @type {number|null}
     */
    #currentDialogIndex;

    /**
     * Új DialogSystem-t hoz létre
     * 
     * @param {Object} characterData - Karakter objektum tulajdonság módosító metódussal
     * @param {Function} characterData.modifyTraits - Metódus a karaktertulajdonságok módosításához
     */
    constructor(characterData) {
        this.#characterData = characterData;
        this.#dialogs = dialogs;
        this.#currentCharacter = null;
        this.#currentDialogIndex = null;
    }

    /**
     * Új dialógus beszélgetést kezd egy karakterrel
     * 
     * @memberof DialogSystem
     * @param {string} character - Karakter kulcsa (pl.: "sibling", "mainCharacter", "robot")
     * @param {number} dialogIndex - Kezdő dialógus ID-ja
     * 
     * @example
     * dialogSystem.startDialog('sibling', 0);
     */
    startDialog(character, dialogIndex) {
        this.#currentCharacter = character;
        this.#currentDialogIndex = dialogIndex;
    }

    /**
     * Az aktuális dialógus objektumot adja vissza
     * 
     * @memberof DialogSystem
     * @returns {Object|null} Az aktuális dialógus objektum vagy null ha nincs aktív beszélgetés
     */
    getCurrentDialog() {
        if (!this.#currentCharacter) return null;
        const characterDialogs = this.#dialogs[this.#currentCharacter];
        return characterDialogs.find((d) => d.id === this.#currentDialogIndex);
    }

    /**
     * Az aktuális dialógus szövegét adja vissza
     * 
     * @memberof DialogSystem
     * @returns {string} Dialógus szöveg vagy üres string
     */
    getDialogText() {
        const dialog = this.getCurrentDialog();
        return dialog ? dialog.text : "";
    }

    /**
     * Elérhető választásokat adja vissza az aktuális dialógushoz
     * 
     * @memberof DialogSystem
     * @returns {Array<Object>} Választás objektumok tömbje
     */
    getChoices() {
        const dialog = this.getCurrentDialog();
        return dialog ? dialog.choices : [];
    }

    /**
     * Ellenőrzi, hogy az aktuális dialógusnak vannak-e választásai
     * 
     * @memberof DialogSystem
     * @returns {boolean} Igaz, ha a dialógusnak vannak választásai
     */
    hasChoices() {
        const choices = this.getChoices();
        return choices.length > 0;
    }

    /**
     * Kiválaszt egy választást és előrehaladja a beszélgetést
     * 
     * Alkalmazva a karaktertulajdonság módosításokat ha léteznek, és szignálja a következő karaktert/dialógust.
     * 
     * @memberof DialogSystem
     * @param {number} choiceIndex - A kiválasztott választás indexe
     * @returns {boolean} Igaz, ha a választás sikeresen kiválasztásra került
     * 
     * @example
     * dialogSystem.selectChoice(0); // Az első választást választja ki
     */
    selectChoice(choiceIndex) {
        const dialog = this.getCurrentDialog();
        const choice = dialog.choices[choiceIndex];

        // Főkarakter tulajdonság módosítások alkalmazása
        if (this.#currentCharacter === "mainCharacter" && choice.traitMod) {
            this.#characterData.modifyTraits(choice.traitMod);
        }

        // Szignál a következő karakterhez és dialógushoz
        this.#currentCharacter = choice.nextCharacter;
        this.#currentDialogIndex = choice.nextDialogIndex;

        return true;
    }

    /**
     * Az aktuálisan beszélő karaktert adja vissza
     * 
     * @memberof DialogSystem
     * @returns {string|null} Karakter kulcsa vagy null
     */
    getCurrentCharacter() {
        return this.#currentCharacter;
    }

    /**
     * Az aktuális dialógus indexet adja vissza
     * 
     * @memberof DialogSystem
     * @returns {number|null} Dialógus ID vagy null
     */
    getCurrentDialogIndex() {
        return this.#currentDialogIndex;
    }

    /**
     * Ellenőrzi, hogy van-e aktív beszélgetés
     * 
     * @memberof DialogSystem
     * @returns {boolean} Igaz, ha van aktív beszélgetés
     */
    isConversationActive() {
        return this.#currentCharacter !== null;
    }

    /**
     * Lezárja az aktuális beszélgetést
     * 
     * Töröl minden aktuális karakter és dialógus indexet.
     * 
     * @memberof DialogSystem
     */
    endConversation() {
        this.#currentCharacter = null;
        this.#currentDialogIndex = null;
    }

    /**
     * Előrehalad az aktuális karakter következő dialógusához
     * 
     * @memberof DialogSystem
     * @returns {boolean} Igaz, ha a következő dialógus létezik és betöltésre került, hamis egyébként
     */
    nextDialogOfCurrentCharacter() {
        const characterDialogs = this.#dialogs[this.#currentCharacter];
        const nextDialog = characterDialogs.find((d) => d.id === this.#currentDialogIndex + 1);
        
        if (nextDialog) {
            this.#currentDialogIndex = nextDialog.id;
            return true;
        }
        return false;
    }
}
