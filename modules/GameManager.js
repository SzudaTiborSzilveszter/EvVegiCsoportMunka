/**
 * GameManager - A teljes történet előrehaladásának fő vezérlője
 * 
 * Kezeli:
 * - Jelenetek közötti átmeneteket és kezelést
 * - Dialógus flow-t és előrehaladást
 * - Történet állapotának nyomon követését
 * - Karakter interakciókat
 * - Minigame vezérlést
 * - Leltár kezelést
 * - Audio rendszer koordinációt
 * 
 * @class GameManager
 * @example
 * const gameManager = new GameManager(
 *   sceneManager, dialogSystem, dialogPanel,
 *   audioManager, scenes, inventorySystem, minigameManager
 * );
 * gameManager.startGame('apartmentDay');
 */
export default class GameManager {
    /**
     * Jelenetkezelő rendszer
     * @private
     * @type {SceneManager}
     */
    #sceneManager;
    
    /**
     * Dialógus kezelő rendszer
     * @private
     * @type {DialogSystem}
     */
    #dialogSystem;
    
    /**
     * Dialógus UI komponens
     * @private
     * @type {DialogPanel}
     */
    #dialogPanel;
    
    /**
     * Audio kezelő rendszer
     * @private
     * @type {AudioManager}
     */
    #audioManager;
    
    /**
     * Jelenet definíciók
     * @private
     * @type {Object<string, Object>}
     */
    #scenes;
    
    /**
     * Leltár kezelő rendszer
     * @private
     * @type {InventorySystem}
     */
    #inventorySystem;
    
    /**
     * Minigame vezérlő
     * @private
     * @type {MinigameManager}
     */
    #minigameManager;
    
    /**
     * Aktuálisan betöltött jelenet ID-ja
     * @private
     * @type {string|null}
     */
    #currentScene = null;
    
    /**
     * Az utolsó dialógus (törlés előtt)
     * @private
     * @type {Object|null}
     */
    #lastDialog = null;
    
    /**
     * Történet esemény-jelzők
     * @private
     * @type {Object<string, boolean>}
     */
    #storyFlags = {};
    
    /**
     * Játékos döntéseinek története
     * @private
     * @type {Array}
     */
    #playerChoices = [];
    
    /**
     * Az aktuális történet fejezet
     * @private
     * @type {number}
     */
    #currentChapter = 1;

    /**
     * Új GameManager-t hoz létre
     * 
     * @param {SceneManager} sceneManager - Jelenetkezelő rendszer
     * @param {DialogSystem} dialogSystem - Dialógus kezelő rendszer
     * @param {DialogPanel} dialogPanel - Dialógus UI komponens
     * @param {AudioManager} audioManager - Audio kezelő rendszer
     * @param {Object<string, Object>} scenes - Jelenet definíciók
     * @param {InventorySystem} inventorySystem - Leltár kezelő rendszer
     * @param {MinigameManager} minigameManager - Minigame vezérlő
     */
    constructor(sceneManager, dialogSystem, dialogPanel, audioManager, scenes, inventorySystem, minigameManager) {
        this.#sceneManager = sceneManager;
        this.#dialogSystem = dialogSystem;
        this.#dialogPanel = dialogPanel;
        this.#audioManager = audioManager;
        this.#scenes = scenes;
        this.#inventorySystem = inventorySystem;
        this.#minigameManager = minigameManager;

        console.log('[GameManager] Constructor started');
        this.#setupEventListeners();
        console.log('[GameManager] Constructor finished');
    }

    /**
     * Setup all event listeners
     * @private
     * @memberof GameManager
     */
    #setupEventListeners() {
        console.log('[GameManager] Setting up event listeners...');
        
        // Character click -> start dialog
        this.#sceneManager.setOnCharacterClick((dialogInfo) => {
            console.log('[GameManager] Character clicked:', dialogInfo);
            this.startDialog(dialogInfo.character, dialogInfo.dialogIndex);
        });

        // Item click -> add to inventory or trigger dialog
        this.#sceneManager.setOnItemClick((itemData) => {
            console.log('[GameManager] Item clicked:', itemData);
            
            // If item has a dialog, trigger that instead of picking it up
            if (itemData.onClickDialog) {
                console.log('[GameManager] Item has dialog, starting dialog instead of pickup');
                this.startDialog(itemData.onClickDialog.character, itemData.onClickDialog.dialogIndex);
            } else {
                // Otherwise, try to pick it up as an inventory item
                this.#onItemPickup(itemData);
            }
        });

        // Intercept dialog end to handle progression
        // IMPORTANT: Save the dialog BEFORE it gets cleared
        const originalEndDialog = this.#dialogPanel.endDialog.bind(this.#dialogPanel);
        this.#dialogPanel.endDialog = () => {
            console.log('[GameManager] endDialog() called - intercepting...');
            // Save current dialog before it's cleared
            this.#lastDialog = this.#dialogSystem.getCurrentDialog();
            console.log('[GameManager] Saved dialog:', this.#lastDialog);
            // Then call our progression handler
            this.#onDialogEnd();
            // Finally clear everything
            originalEndDialog();
        };
        
        console.log('[GameManager] Event listeners setup complete!');
    }

    /**
     * Start the game with a scene
     * @memberof GameManager
     * @param {string} sceneId - Scene to load
     */
    startGame(sceneId) {
        this.loadScene(sceneId);
    }

    /**
     * Load a scene and check conditions
     * @memberof GameManager
     * @param {string} sceneId - Scene ID to load
     * @returns {boolean} success
     */
    loadScene(sceneId) {
        const scene = this.#scenes[sceneId];
        if (!scene) {
            console.error(`Scene not found: ${sceneId}`);
            return false;
        }

        // Check if scene has conditions (optional)
        if (scene.requiredFlags) {
            if (!this.#checkConditions(scene.requiredFlags)) {
                console.log(`Scene ${sceneId} requirements not met`);
                return false;
            }
        }

        this.#currentScene = sceneId;
        this.#sceneManager.loadScene(scene);
        console.log(`📍 Loaded scene: ${sceneId}`);
        
        return true;
    }

    /**
     * Start a dialog with a character
     * @memberof GameManager
     * @param {string} character - Character key
     * @param {number} dialogIndex - Dialog ID
     */
    startDialog(character, dialogIndex) {
        this.#dialogPanel.startDialog(character, dialogIndex);
        console.log(`💬 Dialog started: ${character}[${dialogIndex}]`);
    }

    /**
     * Called when a dialog ends
     * Handles scene transitions and story progression
     * @private
     * @memberof GameManager
     */
    #onDialogEnd() {
        console.log('[GameManager] #onDialogEnd() called');
        console.log('[GameManager] #lastDialog:', this.#lastDialog);
        
        // Use saved dialog instead of trying to get from dialogSystem (which is cleared)
        if (!this.#lastDialog) {
            console.log('[GameManager] No dialog saved, returning');
            return;
        }

        // Check if this dialog has progression rules
        console.log('[GameManager] Dialog progression:', this.#lastDialog.progression);
        if (this.#lastDialog.progression) {
            const progression = this.#lastDialog.progression;

            // Mark flag/event as complete
            if (progression.setFlag) {
                this.#storyFlags[progression.setFlag] = true;
                console.log(`🚩 Flag set: ${progression.setFlag}`);
            }

            // Transition to next scene
            if (progression.nextScene) {
                console.log(`→ Transitioning to: ${progression.nextScene}`);
                // Small delay for UX
                setTimeout(() => {
                    this.loadScene(progression.nextScene);
                }, 500);
            }
        } else {
            console.log('[GameManager] No progression rules on this dialog');
        }
    }

    /**
     * Check if story conditions are met
     * @private
     * @memberof GameManager
     * @param {Object} flags - Szükséges jelzők
     * @returns {boolean} Igaz, ha teljesülnek a feltételek
     */
    #checkConditions(flags) {
        for (const [flag, required] of Object.entries(flags)) {
            if (this.#storyFlags[flag] !== required) {
                return false;
            }
        }
        return true;
    }

    /**
     * Set a story flag/variable
     * @memberof GameManager
     * @param {string} flag - Flag name
     * @param {any} value - Flag value
     */
    setFlag(flag, value) {
        this.#storyFlags[flag] = value;
        console.log(`🚩 Story flag: ${flag} = ${value}`);
    }

    /**
     * Get a story flag
     * @memberof GameManager
     * @param {string} flag - Flag name
     * @returns {any} A jelző értéke vagy null
     */
    getFlag(flag) {
        return this.#storyFlags[flag] ?? null;
    }

    /**
     * Handle item pickup
     * @private
     * @memberof GameManager
     * @param {Object} itemData - Az elemadatok
     */
    #onItemPickup(itemData) {
        console.log(`📦 Item clicked: ${itemData.itemId}`, itemData);

        // Check if item triggers a minigame
        if (itemData.minigame) {
            console.log(`[GameManager] Item triggers minigame:`, itemData.minigame);
            
            if (!this.#minigameManager) {
                console.error('[GameManager] Minigame system not available');
                return;
            }

            // Prepare rewards for minigame completion
            const rewards = {
                nextScene: itemData.minigame.nextScene,
                rewardItem: itemData.minigame.rewardItem,
                setFlag: itemData.minigame.setFlag
            };

            // Set up completion callback
            this.#minigameManager.setOnCompletion((result) => {
                if (result.success) {
                    this.#onMinigameComplete(itemData, rewards);
                }
            });

            // Start the minigame
            this.#minigameManager.startGame(itemData.minigame.gameId, rewards);
            return;
        }

        // Normal item pickup (no minigame)
        if (!this.#inventorySystem) {
            console.error('[GameManager] Inventory system not available');
            return;
        }

        const itemId = itemData.itemId;
        const success = this.#inventorySystem.addItem(itemId);

        if (success) {
            console.log(`📦 Item picked up: ${itemId}`);
            
            // Remove item from scene
            const currentSceneData = this.#scenes[this.#currentScene];
            if (currentSceneData && currentSceneData.items) {
                currentSceneData.items = currentSceneData.items.filter(item => item.itemId !== itemId);
                this.#sceneManager.loadScene(currentSceneData);
            }

            // Check if item has progression rules
            if (itemData.progression) {
                console.log('[GameManager] Item has progression:', itemData.progression);
                const progression = itemData.progression;

                // Mark flag/event as complete
                if (progression.setFlag) {
                    this.#storyFlags[progression.setFlag] = true;
                    console.log(`🚩 Flag set: ${progression.setFlag}`);
                }

                // Transition to next scene
                if (progression.nextScene) {
                    console.log(`→ Transitioning to: ${progression.nextScene}`);
                    // Small delay for UX
                    setTimeout(() => {
                        this.loadScene(progression.nextScene);
                    }, 500);
                }
            }
        } else {
            console.warn(`❌ Could not pick up item: ${itemId}`);
        }
    }

    /**
     * Handle minigame completion
     * @private
     */
    #onMinigameComplete(itemData, rewards) {
        console.log(`[GameManager] Minigame complete! Rewards:`, rewards);

        // Remove item from scene after minigame
        const currentSceneData = this.#scenes[this.#currentScene];
        if (currentSceneData && currentSceneData.items) {
            currentSceneData.items = currentSceneData.items.filter(item => item.itemId !== itemData.itemId);
            this.#sceneManager.loadScene(currentSceneData);
        }

        // Set story flag if specified
        if (rewards.setFlag) {
            this.#storyFlags[rewards.setFlag] = true;
            console.log(`🚩 Flag set: ${rewards.setFlag}`);
        }

        // Give item reward if specified
        if (rewards.rewardItem && this.#inventorySystem) {
            const rewardSuccess = this.#inventorySystem.addItem(rewards.rewardItem);
            if (rewardSuccess) {
                console.log(`🎁 Item reward given: ${rewards.rewardItem}`);
            }
        }

        // Transition to next scene if specified
        if (rewards.nextScene) {
            console.log(`→ Transitioning to: ${rewards.nextScene}`);
            setTimeout(() => {
                this.loadScene(rewards.nextScene);
            }, 500);
        }
    }

    /**
     * Record a player choice
     * @param {string} choiceText - The choice player made
     */
    recordChoice(choiceText) {
        this.#playerChoices.push({
            scene: this.#currentScene,
            choice: choiceText,
            timestamp: Date.now()
        });
    }

    /**
     * Get current scene
     */
    getCurrentScene() {
        return this.#currentScene;
    }

    /**
     * Get story state (for debugging)
     */
    getStoryState() {
        return {
            scene: this.#currentScene,
            chapter: this.#currentChapter,
            flags: this.#storyFlags,
            choices: this.#playerChoices
        };
    }
}