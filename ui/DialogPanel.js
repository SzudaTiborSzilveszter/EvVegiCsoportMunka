import { characters } from '../data/characters.js';

export default class DialogPanel {

    #dialogSystem;
    #container;
    #overlayEl;
    #leftSprite;
    #rightSprite;

    constructor(dialogSystem, containerElement) {
        this.#dialogSystem = dialogSystem;
        this.#container = containerElement;

        // Create overlay and sprites once at startup
        this.#overlayEl = document.createElement('div');
        this.#overlayEl.className = 'dialog-overlay';
        document.body.appendChild(this.#overlayEl);

        this.#leftSprite = document.createElement('img');
        this.#leftSprite.className = 'dialog-sprite left';
        this.#leftSprite.alt = 'Speaker';
        document.body.appendChild(this.#leftSprite);

        this.#rightSprite = document.createElement('img');
        this.#rightSprite.className = 'dialog-sprite right';
        this.#rightSprite.alt = 'Player Character';
        document.body.appendChild(this.#rightSprite);
    }

    /**
     * Start displaying a dialog conversation
     * @param {string} character - Character key to start conversation with
     * @param {number} dialogIndex - Dialog ID to display
     */
    startDialog(character, dialogIndex) {
        this.#dialogSystem.startDialog(character, dialogIndex);
        this.#showVisuals(character);
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
                this.endDialog();
            });
        }
    }

    /**
     * End the current conversation and clear the dialog panel
     */
    endDialog() {
        this.#hideVisuals();
        this.#dialogSystem.endConversation();
        this.render();
    }

    /**
     * Show overlay and character sprites with animations
     */
    #showVisuals(characterKey) {
        const speakerChar = characters[characterKey] || characters.sibling;
        const playerChar = characters.mainCharacter;

        // Set sprite images
        this.#leftSprite.src = speakerChar.sprite;
        this.#rightSprite.src = playerChar.sprite;

        // Fade in background
        this.#overlayEl.classList.add('visible');

        // Trigger slide-in animations on next frame
        requestAnimationFrame(() => {
            this.#leftSprite.classList.add('entered');
            this.#rightSprite.classList.add('entered');
        });
    }

    /**
     * Hide overlay and character sprites with animations
     */
    #hideVisuals() {
        // Start exit animations
        this.#leftSprite.classList.remove('entered');
        this.#rightSprite.classList.remove('entered');
        this.#overlayEl.classList.remove('visible');

        // Clean up after animation completes
        setTimeout(() => {
            this.#leftSprite.src = '';
            this.#rightSprite.src = '';
        }, 500);
    }
}