export default class DialogPanel {

    #dialogSystem;
    #container;

    constructor(dialogSystem, containerElement) {
        this.#dialogSystem = dialogSystem;
        this.#container = containerElement;
    }

    /**
     * Start displaying a dialog conversation
     * @param {string} character - Character key to start conversation with
     * @param {number} dialogIndex - Dialog ID to display
     */
    startDialog(character, dialogIndex) {
        this.#dialogSystem.startDialog(character, dialogIndex);
        this.render();
    }

    render() {
        if (!this.#dialogSystem.isConversationActive()) {
            this.#container.innerHTML = "";
            return;
        }

        this.#container.innerHTML = "";

        const speakerName = this.#dialogSystem.getCurrentCharacter();
        const dialogText = this.#dialogSystem.getDialogText();
        const choices = this.#dialogSystem.getChoices();
        const hasChoices = this.#dialogSystem.hasChoices();

        let choicesHTML = '';
        
        choices.forEach((choice, index) => {
            choicesHTML += `<button class="choice-btn" data-choice="${index}">${choice.text}</button>`;
        });

        let nextButtonDisplay = hasChoices ? 'none' : 'block';

        let code = `<div class="dialog-panel">
                    <div class="dialog-header">
                        <span class="character-name">${speakerName}</span>
                    </div>
                    
                    <div class="dialog-content">
                        <p class="dialog-text">${dialogText}</p>
                    </div>
                    
                    <div class="choices-container">
                        ${choicesHTML}
                    </div>
                    
                    <div class="next-container" style="display: ${nextButtonDisplay};">
                        <button class="next-btn">Tovább</button>
                    </div>
                    </div>`;
        
        this.#container.insertAdjacentHTML("beforeend", code)
        
        const choiceButtons = this.#container.querySelectorAll('.choice-btn');
        choiceButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                this.#dialogSystem.selectChoice(index);
                this.render();
            });
        });
        
        const nextButton = this.#container.querySelector('.next-btn');
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                this.render();
            });
        }
    }

    /**
     * End the current conversation and clear the dialog panel
     */
    endDialog() {
        this.#dialogSystem.endConversation();
        this.render();
    }
}