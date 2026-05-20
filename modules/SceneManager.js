/**
 * @typedef {Object} CharacterPosition
 * @property {string} character - Character key (e.g., "mainCharacter", "sibling")
 * @property {number} x - X position (0-100, percentage of screen width)
 * @property {number} y - Y position (0-100, percentage of screen height)
 * @property {number} [scale=1] - Scale multiplier (default 1)
 * @property {string} [flip=false] - Whether to flip horizontally
 * @property {number} [zIndex=1] - Layer depth (higher = on top)
 * @property {number} [opacity=1] - Opacity (0-1)
 * @property {string} [animation] - Animation class to apply
 * @property {string} [sprite] - Override sprite from characters dataset (optional)
 * @property {Object} [onClickDialog] - Dialog to start when clicked
 * @property {string} [onClickDialog.character] - Character to start dialog with
 * @property {number} [onClickDialog.dialogIndex] - Dialog index to start
 */

/**
 * @typedef {Object} Scene
 * @property {string} id - Unique scene identifier
 * @property {string} background - Background image path
 * @property {CharacterPosition[]} characters - Array of character positions
 * @property {string} [music] - Background music key
 * @property {number} [ambientOpacity=0.7] - Background opacity/darkness
 */

export default class SceneManager {
    #container;
    #backgroundEl;
    #characterLayer;
    #itemLayer;
    #currentScene;
    #onCharacterClickCallback;
    #onItemClickCallback;
    #charactersData;
    #audioManager;

    constructor(containerElement, charactersData, audioManager) {
        this.#container = containerElement;
        this.#charactersData = charactersData;
        this.#audioManager = audioManager;
        this.#setupContainer();
        this.#onCharacterClickCallback = null;
        this.#onItemClickCallback = null;
    }

    /**
     * Setup the scene container structure
     */
    #setupContainer() {
        this.#container.className = 'scene-container';
        
        // Background layer
        this.#backgroundEl = document.createElement('div');
        this.#backgroundEl.className = 'scene-background';
        this.#container.appendChild(this.#backgroundEl);

        // Character layer
        this.#characterLayer = document.createElement('div');
        this.#characterLayer.className = 'scene-characters';
        this.#container.appendChild(this.#characterLayer);

        // Item layer
        this.#itemLayer = document.createElement('div');
        this.#itemLayer.className = 'scene-items';
        this.#container.appendChild(this.#itemLayer);
    }

    /**
     * Load and render a scene
     * @param {Scene} scene - Scene configuration object
     */
    loadScene(scene) {
        this.#currentScene = scene;
        this.#renderBackground(scene.background, scene.ambientOpacity);
        this.#renderCharacters(scene.characters);
        this.#renderItems(scene.items || []);
        
        // Play scene music if specified
        if (this.#audioManager && scene.music) {
            this.#audioManager.playTrack(scene.music);
        }
    }

    /**
     * Render background
     * @private
     */
    #renderBackground(backgroundPath, opacity = 0.7) {
        if (!backgroundPath) {
            this.#backgroundEl.style.backgroundImage = 'none';
            this.#backgroundEl.style.backgroundColor = '#0a0e27';
            return;
        }

        this.#backgroundEl.style.backgroundImage = `url('${backgroundPath}')`;
        this.#backgroundEl.style.opacity = opacity;
    }

    /**
     * Render all characters in the scene
     * @private
     */
    #renderCharacters(characters) {
        this.#characterLayer.innerHTML = '';

        if (!characters || characters.length === 0) return;

        // Sort by zIndex for proper layering
        const sorted = [...characters].sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1));

        let html = '';

        sorted.forEach((charPos, index) => {
            // Get sprite from characters dataset
            const characterData = this.#charactersData[charPos.character];
            const spritePath = charPos.sprite || (characterData ? characterData.sprite : '');

            const scale = charPos.scale || 1;
            const flip = charPos.flip ? 'scaleX(-1)' : 'scaleX(1)';
            const cursor = charPos.onClickDialog ? 'pointer' : 'default';
            const zIndex = charPos.zIndex || 1;
            const opacity = charPos.opacity ?? 1;

            const animationClass = charPos.animation ? charPos.animation : '';
            const dataId = `char-${index}`;

            html += `
                <div class="scene-character" id="${dataId}" style="left: ${charPos.x}%; top: ${charPos.y}%; z-index: ${zIndex}; opacity: ${opacity}; cursor: ${cursor};">
                    <img src="${spritePath}" alt="${charPos.character}" class="character-sprite ${animationClass}" style="transform: ${flip} scale(${scale});">
                </div>
            `;
        });

        this.#characterLayer.insertAdjacentHTML('beforeend', html);

        // Attach event listeners to clickable characters
        sorted.forEach((charPos, index) => {
            if (charPos.onClickDialog) {
                const element = this.#characterLayer.querySelector(`#char-${index}`);
                if (element) {
                    element.addEventListener('click', () => {
                        if (this.#onCharacterClickCallback) {
                            this.#onCharacterClickCallback(charPos.onClickDialog);
                        }
                    });
                }
            }
        });
    }

    /**
     * Render all items in the scene
     * @private
     */
    #renderItems(items) {
        this.#itemLayer.innerHTML = '';

        if (!items || items.length === 0) return;

        // Sort by zIndex for proper layering
        const sorted = [...items].sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1));

        let html = '';

        sorted.forEach((itemData, index) => {
            const scale = itemData.scale || 1;
            const zIndex = itemData.zIndex || 5;
            const opacity = itemData.opacity ?? 1;
            const animationClass = itemData.animation ? itemData.animation : '';
            const dataId = `item-${index}`;

            html += `
                <div class="scene-item" id="${dataId}" style="left: ${itemData.x}%; top: ${itemData.y}%; z-index: ${zIndex}; opacity: ${opacity}; cursor: pointer;">
                    <img src="${itemData.sprite}" alt="${itemData.itemId}" class="item-sprite ${animationClass}" style="transform: scale(${scale});">
                </div>
            `;
        });

        this.#itemLayer.insertAdjacentHTML('beforeend', html);

        // Attach event listeners to items
        sorted.forEach((itemData, index) => {
            const element = this.#itemLayer.querySelector(`#item-${index}`);
            if (element) {
                element.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (this.#onItemClickCallback) {
                        this.#onItemClickCallback(itemData);
                    }
                });
            }
        });
    }

    /**
     * Update a single character's position
     * @param {string} character - Character key
     * @param {Partial<CharacterPosition>} updates - Properties to update
     */
    updateCharacter(character, updates) {
        if (!this.#currentScene) return;

        const charPos = this.#currentScene.characters.find(c => c.character === character);
        if (!charPos) return;

        Object.assign(charPos, updates);
        this.#renderCharacters(this.#currentScene.characters);
    }

    /**
     * Add a character to the current scene
     * @param {CharacterPosition} charPos - Character position data
     */
    addCharacter(charPos) {
        if (!this.#currentScene) return;
        this.#currentScene.characters.push(charPos);
        this.#renderCharacters(this.#currentScene.characters);
    }

    /**
     * Remove a character from the scene
     * @param {string} character - Character key to remove
     */
    removeCharacter(character) {
        if (!this.#currentScene) return;
        this.#currentScene.characters = this.#currentScene.characters.filter(
            c => c.character !== character
        );
        this.#renderCharacters(this.#currentScene.characters);
    }

    /**
     * Clear the scene
     */
    clearScene() {
        this.#backgroundEl.style.backgroundImage = 'none';
        this.#characterLayer.innerHTML = '';
        this.#currentScene = null;
    }

    /**
     * Get current scene
     */
    getCurrentScene() {
        return this.#currentScene;
    }

    /**
     * Set the callback for character clicks
     * @param {Function} callback - Function to call when character is clicked, receives {character, dialogIndex}
     */
    setOnCharacterClick(callback) {
        this.#onCharacterClickCallback = callback;
    }

    /**
     * Set the callback for item clicks
     * @param {Function} callback - Function to call when item is clicked, receives item data
     */
    setOnItemClick(callback) {
        this.#onItemClickCallback = callback;
    }
}
