import { characters } from '../data/characters.js';

/**
 * DialogPanel - Dialógus UI panel
 * 
 * Kezeli:
 * - Dialógus szöveg és választások megjelenítése
 * - Karakterfigurák megjelenítése
 * - Választás kezelés
 * - Dialógus animációk
 * 
 * @class DialogPanel
 * @example
 * const dialog = new DialogPanel(dialogSystem, container, audioManager);
 * dialog.setSceneManager(sceneManager);
 * dialog.showDialog();
 */
export default class DialogPanel {

    /**
     * Dialógus kezelő referencia
     * @private
     * @type {DialogSystem}
     */
    #dialogSystem;

    /**
     * Dialógus konténer elem
     * @private
     * @type {HTMLElement}
     */
    #container;

    /**
     * Átlapolás (overlay) elem
     * @private
     * @type {HTMLElement}
     */
    #overlayEl;

    /**
     * Bal oldali karakterfigura
     * @private
     * @type {HTMLImageElement}
     */
    #leftSprite;

    /**
     * Jobb oldali karakterfigura
     * @private
     * @type {HTMLImageElement}
     */
    #rightSprite;

    /**
     * Jelenleg aktív karakter
     * @private
     * @type {string|null}
     */
    #currentCharacter;

    /**
     * Jelenetkezelő referencia
     * @private
     * @type {SceneManager}
     */
    #sceneManager;

    /**
     * Audio kezelő referencia
     * @private
     * @type {AudioManager}
     */
    #audioManager;

    /**
     * Új DialogPanel-t hoz létre
     * 
     * @param {DialogSystem} dialogSystem - Dialógus kezelő rendszer
     * @param {HTMLElement} containerElement - Konténer elem
     * @param {AudioManager} audioManager - Audio kezelő rendszer
     */
    constructor(dialogSystem, containerElement, audioManager) {
        this.#dialogSystem = dialogSystem;
        this.#container = containerElement;
        this.#audioManager = audioManager;
        this.#currentCharacter = null;

        // Átlapolás és szprítek létrehozása az induláskor
        this.#overlayEl = document.createElement('div');
        this.#overlayEl.className = 'dialog-overlay';
        document.body.appendChild(this.#overlayEl);

        this.#leftSprite = document.createElement('img');
        this.#leftSprite.className = 'dialog-sprite left';
        this.#leftSprite.alt = 'Speaker';
        this.#leftSprite.setAttribute('data-sprite-type', 'left');
        document.body.appendChild(this.#leftSprite);

        this.#rightSprite = document.createElement('img');
        this.#rightSprite.className = 'dialog-sprite right';
        this.#rightSprite.alt = 'Player Character';
        this.#rightSprite.setAttribute('data-sprite-type', 'right');
        document.body.appendChild(this.#rightSprite);
    }

    /**
     * SceneManager referencia beállítása karakterek elrejtéséhez/megjelenítéséhez
     * @memberof DialogPanel
     * @param {SceneManager} sceneManager - Jelenetkezelő
     */
    setSceneManager(sceneManager) {
        this.#sceneManager = sceneManager;
    }

    /**
     * Start displaying a dialog conversation
     * @memberof DialogPanel
     * @param {string} character - Character key to start conversation with
     * @param {number} dialogIndex - Dialog ID to display
     */
    startDialog(character, dialogIndex) {
        this.#currentCharacter = character;
        this.#hideCharacterInScene(character);
        this.#dialogSystem.startDialog(character, dialogIndex);
        this.#showVisuals(character);
        this.render();
    }

    /**
     * Dialógus panel HTML-jének renderelése
     * @memberof DialogPanel
     */
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
        const currentDialog = this.#dialogSystem.getCurrentDialog();

        // Get character's actual name from characters data
        const characterData = characters[speakerName];
        const displayName = characterData ? characterData.name : speakerName;

        let choicesHTML = '';
        
        choices.forEach((choice, index) => {
            choicesHTML += `<button class="choice-btn" data-choice="${index}">${choice.text}</button>`;
        });

        // Show "Tovabb" button if there are no choices (progression/autoNext handled by button click)
        let nextButtonDisplay = hasChoices ? 'none' : 'block';

        let code = `<div class="dialog-panel">
                    <div class="dialog-header">
                        <span class="character-name">${displayName}</span>
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
                console.log('[DialogPanel] Choice button clicked, index:', index);
                
                // Check if current dialog has progression BEFORE switching characters
                const currentDialog = this.#dialogSystem.getCurrentDialog();
                console.log('[DialogPanel] Current dialog before choice:', currentDialog);
                
                if (currentDialog && currentDialog.progression) {
                    console.log('[DialogPanel] Dialog has progression, ending instead of advancing');
                    this.endDialog();
                    return;
                }
                
                // No progression, proceed normally
                this.#dialogSystem.selectChoice(index);
                // Update current character and show visuals for new dialog
                this.#currentCharacter = this.#dialogSystem.getCurrentCharacter();
                this.#showVisuals(this.#currentCharacter);
                this.render();
            });
        });
        
        const nextButton = this.#container.querySelector('.next-btn');
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                console.log('[DialogPanel] Tovabb button clicked');
                const currentDialog = this.#dialogSystem.getCurrentDialog();
                console.log('[DialogPanel] Current dialog:', currentDialog);
                
                // 1. Check if dialog has progression (scene transition)
                if (currentDialog?.progression) {
                    console.log('[DialogPanel] Has progression, calling endDialog()');
                    this.endDialog();
                    return;
                }
                
                // 2. Check if dialog has autoNext (auto-advance to next character)
                if (currentDialog?.autoNext) {
                    console.log('[DialogPanel] Has autoNext, switching to:', currentDialog.autoNext);
                    const newCharacter = currentDialog.autoNext.nextCharacter;
                    this.#dialogSystem.startDialog(
                        newCharacter,
                        currentDialog.autoNext.nextDialogIndex
                    );
                    this.#currentCharacter = newCharacter;
                    this.#showVisuals(newCharacter);
                    this.render();
                    return;
                }

                // 3. Try to advance to next dialog of same character
                console.log('[DialogPanel] Trying to advance to next dialog');
                const hasNextDialog = this.#dialogSystem.nextDialogOfCurrentCharacter();
                if (hasNextDialog) {
                    this.#showVisuals(this.#currentCharacter);
                    this.render();
                } else {
                    // No next dialog - end conversation
                    console.log('[DialogPanel] No next dialog, calling endDialog()');
                    this.endDialog();
                }
            });
        }
    }

    /**
     * End the current conversation and clear the dialog panel
     * @memberof DialogPanel
     */
    endDialog() {
        this.#hideVisuals();
        this.#showCharacterInScene(this.#currentCharacter);
        this.#currentCharacter = null;
        this.#dialogSystem.endConversation();
        this.render();
    }

    /**
     * Hide a character from the scene (during dialog)
     * @private
     * @memberof DialogPanel
     * @param {string} characterKey - Karakter kulcsa
     */
    #hideCharacterInScene(characterKey) {
        if (!this.#sceneManager) return;
        
        const sceneCharacters = document.querySelectorAll('.scene-character');
        sceneCharacters.forEach((charEl) => {
            const img = charEl.querySelector('.character-sprite');
            if (img && img.alt === characterKey) {
                charEl.style.opacity = '0';
                charEl.style.pointerEvents = 'none';
            }
        });
    }

    /**
     * Show a character back in the scene (after dialog)
     * @private
     * @memberof DialogPanel
     * @param {string} characterKey - Karakter kulcsa
     */
    #showCharacterInScene(characterKey) {
        if (!characterKey) return;
        
        const sceneCharacters = document.querySelectorAll('.scene-character');
        sceneCharacters.forEach((charEl) => {
            const img = charEl.querySelector('.character-sprite');
            if (img && img.alt === characterKey) {
                charEl.style.opacity = '1';
                charEl.style.pointerEvents = 'auto';
            }
        });
    }

    /**
     * Show overlay and character sprites with animations
     * @private
     * @memberof DialogPanel
     * @param {string} characterKey - Karakter kulcsa
     */
    #showVisuals(characterKey) {
        const speakerChar = characters[characterKey] || characters.sibling;
        const playerChar = characters.mainCharacter;
        
        // Get current dialog to extract emotion
        const currentDialog = this.#dialogSystem.getCurrentDialog();
        const emotion = currentDialog?.emotion || 'neutral';
        const hasChoices = this.#dialogSystem.hasChoices();

        // Build emotion-specific sprite path
        const leftSpritePath = this.#getEmotionSprite(speakerChar.sprite, emotion);
        const rightSpritePath = playerChar.sprite; // Player stays neutral for now

        // Set sprite images
        this.#leftSprite.src = leftSpritePath;
        this.#rightSprite.src = rightSpritePath;

        // Add special class for surprised female sprite
        if (leftSpritePath.includes('surp_fem_player')) {
            this.#leftSprite.classList.add('surprised-female');
        } else {
            this.#leftSprite.classList.remove('surprised-female');
        }

        // Add special class for surprised emotion (any character)
        if (emotion === 'surprised') {
            this.#leftSprite.classList.add('surprised-emotion');
        } else {
            this.#leftSprite.classList.remove('surprised-emotion');
        }

        // Play emotion sound effect
        if (this.#audioManager) {
            this.#audioManager.playSoundEffect(emotion);
        }

        // Fade in background
        this.#overlayEl.classList.add('visible');

        // If no choices (only "Tovabb" button), show only speaker, centered
        if (!hasChoices) {
            this.#leftSprite.classList.add('centered-solo');
            this.#rightSprite.style.display = 'none';
        } else {
            this.#leftSprite.classList.remove('centered-solo');
            this.#rightSprite.style.display = '';
        }

        // Trigger slide-in animations on next frame
        requestAnimationFrame(() => {
            this.#leftSprite.classList.add('entered');
            this.#rightSprite.classList.add('entered');
        });
    }

    /**
     * Get emotion-specific sprite path
     * @private
     * @memberof DialogPanel
     * @param {string} basePath - Alap szprite útvonal
     * @param {string} emotion - Érzelem típusa
     * @returns {string} Az érzelem-specifikus szprite útvonala
     */
    #getEmotionSprite(basePath, emotion) {
        if (!basePath || emotion === 'neutral') {
            return basePath;
        }

        // Map emotions to sprite prefixes (handles naming inconsistencies)
        const emotionMap = {
            happy: 'happy',
            angry: 'angry',
            sad: 'sad',
            surprised: 'surp',
            confident: 'happy'  // confident uses happy sprite
        };

        const prefix = emotionMap[emotion] || emotion;
        
        // Determine if this is male or female based on base path
        const isMale = basePath.includes('mal_player');
        const isFemale = basePath.includes('fem_player') || basePath.includes('female_player');

        // Build emotion sprite path based on character and emotion
        const baseName = isMale ? 'mal_player_close' : (isFemale ? 'fem_player_close' : '');
        
        if (!baseName) return basePath; // Can't determine, return original

        // Standard pattern: {emotion}_{gender}_player{_close}.png
        return `/assets/sprites/${prefix}_${baseName}.png`;
    }

    /**
     * Hide overlay and character sprites with animations
     * @private
     * @memberof DialogPanel
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