/**
 * @typedef {Object} CharacterPosition
 * @property {string} character - Karakter kulcsa (pl.: "mainCharacter", "sibling")
 * @property {number} x - X pozíció (0-100, képernyőszélesség százaléka)
 * @property {number} y - Y pozíció (0-100, képernyőmagasság százaléka)
 * @property {number} [scale=1] - Méretezési szorzó (alapértelmezett 1)
 * @property {string} [flip=false] - Vízszintes tükrözés
 * @property {number} [zIndex=1] - Réteg mélysége (nagyobb = felül)
 * @property {number} [opacity=1] - Átlátszóság (0-1)
 * @property {string} [animation] - Alkalmazni kívánt animációs osztály
 * @property {string} [sprite] - Felülbírálás a karakterek adathalmazából (opcionális)
 * @property {Object} [onClickDialog] - Dialógus, amely kattintáskor megnyílik
 * @property {string} [onClickDialog.character] - Karakter, akivel dialógust kell kezdeni
 * @property {number} [onClickDialog.dialogIndex] - Kezdő dialógus indexe
 */

/**
 * @typedef {Object} Scene
 * @property {string} id - Egyedi jelenet azonosító
 * @property {string} background - Háttérkép elérési útja
 * @property {CharacterPosition[]} characters - Karakterpozíciók tömbje
 * @property {string} [music] - Háttérzene kulcsa
 * @property {number} [ambientOpacity=0.7] - Háttér átlátszósága/sötétsége
 */

/**
 * SceneManager - Jelenetmegjelenítés és karakter/tárgy interakciók kezelése
 * 
 * Kezeli:
 * - Jelenet háttér és elrendezés megjelenítést
 * - Karakterpozíciót és kijelzést
 * - Tárgy elhelyezést és interakciót
 * - Kattintás eseménylekezelést karakterekhez és tárgyakhoz
 * - Jelenetátmeneteket
 * 
 * @class SceneManager
 * @example
 * const sceneManager = new SceneManager(container, charactersData, audioManager);
 * sceneManager.loadScene(sceneData);
 * sceneManager.setOnCharacterClick((dialog) => { ... });
 */
export default class SceneManager {
    /**
     * Fő jelenetkonténer elem
     * @private
     * @type {HTMLElement}
     */
    #container;

    /**
     * Háttér elem
     * @private
     * @type {HTMLElement}
     */
    #backgroundEl;

    /**
     * Karakterréteg konténer
     * @private
     * @type {HTMLElement}
     */
    #characterLayer;

    /**
     * Tárgy réteg konténer
     * @private
     * @type {HTMLElement}
     */
    #itemLayer;

    /**
     * Jelenleg betöltött jelenet adat
     * @private
     * @type {Scene|null}
     */
    #currentScene;

    /**
     * Karakter kattintás esemény visszahívása
     * @private
     * @type {Function|null}
     * @private
     */
    #onCharacterClickCallback;

    /**
     * Callback for item click events
     * @type {Function|null}
     * @private
     */
    #onItemClickCallback;

    /**
     * Character definitions (names, sprites)
     * @type {Object<string, Object>}
     * @private
     */
    #charactersData;

    /**
     * Audio manager reference
     * @type {AudioManager}
     * @private
     */
    #audioManager;

    /**
     * Creates a new SceneManager instance
     * 
     * @param {HTMLElement} containerElement - Container element for scenes
     * @param {Object<string, Object>} charactersData - Character definitions
     * @param {AudioManager} audioManager - Audio manager instance
     */
    constructor(containerElement, charactersData, audioManager) {
        this.#container = containerElement;
        this.#charactersData = charactersData;
        this.#audioManager = audioManager;
        this.#setupContainer();
        this.#onCharacterClickCallback = null;
        this.#onItemClickCallback = null;
    }

    /**
     * Setup the scene container structure with layers
     * 
     * @memberof SceneManager
     * @private
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
     * 
     * @memberof SceneManager
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
     * 
     * @memberof SceneManager
     * @private
     * @param {string} backgroundPath - Background image path
     * @param {number} [opacity=0.7] - Background opacity
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
     * 
     * @memberof SceneManager
     * @private
     * @param {CharacterPosition[]} characters - Array of character positions
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
     * 
     * @memberof SceneManager
     * @private
     * @param {Object[]} items - Array of item data
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
            const isInvisible = itemData.isInvisible || false;
            const width = itemData.width || 100; // width in pixels
            const height = itemData.height || 100; // height in pixels
            const invisibleClass = isInvisible ? 'invisible-item' : '';

            // For invisible items, don't render an image
            if (isInvisible) {
                html += `
                    <div class="scene-item ${invisibleClass}" id="${dataId}" 
                        style="left: ${itemData.x}%; top: ${itemData.y}%; z-index: ${zIndex}; cursor: pointer; width: ${width}px; height: ${height}px;">
                        <div class="invisible-item-content">
                            <span class="enter-icon">⏎</span>
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div class="scene-item" id="${dataId}" style="left: ${itemData.x}%; top: ${itemData.y}%; z-index: ${zIndex}; opacity: ${opacity}; cursor: pointer;">
                        <img src="${itemData.sprite}" alt="${itemData.itemId}" class="item-sprite ${animationClass}" style="transform: scale(${scale});">
                    </div>
                `;
            }
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
     * 
     * @memberof SceneManager
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
     * 
     * @memberof SceneManager
     * @param {CharacterPosition} charPos - Character position data
     */
    addCharacter(charPos) {
        if (!this.#currentScene) return;
        this.#currentScene.characters.push(charPos);
        this.#renderCharacters(this.#currentScene.characters);
    }

    /**
     * Remove a character from the scene
     * 
     * @memberof SceneManager
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
     * 
     * @memberof SceneManager
     */
    clearScene() {
        this.#backgroundEl.style.backgroundImage = 'none';
        this.#characterLayer.innerHTML = '';
        this.#currentScene = null;
    }

    /**
     * Get current scene
     * 
     * @memberof SceneManager
     * @returns {Scene|null} Current scene or null if none loaded
     */
    getCurrentScene() {
        return this.#currentScene;
    }

    /**
     * Set the callback for character clicks
     * 
     * @memberof SceneManager
     * @param {Function} callback - Function to call when character is clicked, receives {character, dialogIndex}
     */
    setOnCharacterClick(callback) {
        this.#onCharacterClickCallback = callback;
    }

    /**
     * Set the callback for item clicks
     * 
     * @memberof SceneManager
     * @param {Function} callback - Function to call when item is clicked, receives item data
     */
    setOnItemClick(callback) {
        this.#onItemClickCallback = callback;
    }
}
