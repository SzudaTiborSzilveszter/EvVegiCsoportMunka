import Minigame from './Minigame.js';
import HackingGame from './HackingGame.js';
import LockpickingGame from './LockpickingGame.js';
import PuzzleGame from './PuzzleGame.js';
import HackingUI from '../ui/HackingUI.js';
import LockpickingUI from '../ui/LockpickingUI.js';
import PuzzleUI from '../ui/PuzzleUI.js';

/**
 * MinigameManager - Central orchestrator for all minigames
 * Handles initialization, execution, and result handling
 */
export default class MinigameManager {
    #currentGame;
    #currentSpecificGame;
    #dialogSystem;
    #dialogPanel;
    #minigameUI;
    #gameConfig;
    #audioManager;
    #onCompletionCallback;  // Callback for minigame completion with rewards

    /**
     * @param {DialogSystem} dialogSystem - Reference to the dialog system
     * @param {DialogPanel} dialogPanel - Reference to the dialog panel UI
     * @param {MinigameUI} minigameUI - Reference to the UI renderer
     * @param {Object} gameConfig - Minigame configuration data
     */
    constructor(dialogSystem, dialogPanel, minigameUI, gameConfig, audioManager) {
        this.#dialogSystem = dialogSystem;
        this.#dialogPanel = dialogPanel;
        this.#minigameUI = minigameUI;
        this.#gameConfig = gameConfig;
        this.#audioManager = audioManager;
        this.#currentGame = null;
        this.#currentSpecificGame = null;
    }

    /**
     * Start a minigame
     * 
     * @memberof MinigameManager
     * @param {string} gameId - The minigame ID from config
     * @param {Object} rewards - Optional rewards on completion {nextScene, rewardItem}
     * @param {Function} onCompletion - Optional callback for completion handling
     * @returns {boolean} - Whether the game started successfully
     */
    startGame(gameId, rewards = null, onCompletion = null) {
        const config = this.#gameConfig[gameId];
        if (!config) {
            console.error(`[MinigameManager] Game not found: ${gameId}`);
            return false;
        }

        // Only set callback if explicitly passed, don't overwrite setOnCompletion()
        if (onCompletion !== null) {
            this.#onCompletionCallback = onCompletion;
        }

        console.log(`[MinigameManager] Starting game: ${gameId}`);

        const onSuccess = () => this.#handleSuccess(config, rewards);
        const onFailure = () => this.#handleFailure(config);

        this.#currentGame = new Minigame(
            config.type,
            config.difficulty,
            onSuccess,
            onFailure
        );

        this.#currentGame.start();

        this.#minigameUI.render(this.#currentGame, config);

        // Típustól függően inicializáljuk a konkrét játékot
        if (config.type === 'hacking') {
            this.#initializeHackingGame(config.difficulty, onSuccess, onFailure);
        } else if (config.type === 'lockpicking') {
            this.#initializeLockpickingGame(config.difficulty, onSuccess, onFailure);
        } else if (config.type === 'puzzle') {
            this.#initializePuzzleGame(config.difficulty, onSuccess, onFailure);
        }

        return true;
    }

    /**
     * Hacking játék inicializálása
     * 
     * @memberof MinigameManager
     * @private
     * @param {number} difficulty - Game difficulty
     * @param {Function} onSuccess - Success callback
     * @param {Function} onFailure - Failure callback
     */
    #initializeHackingGame(difficulty, onSuccess, onFailure) {
        const hackingGame = new HackingGame(
            difficulty,
            () => {
                this.#currentGame.succeed();
            },
            () => {
                this.#currentGame.fail();
            }
        );

        this.#currentSpecificGame = hackingGame;

        // UI renderelése
        const gameBoard = this.#minigameUI.getGameBoard();
        const hackingUI = new HackingUI(gameBoard);
        hackingUI.render(hackingGame);
    }

    /**
     * Lockpicking játék inicializálása
     * 
     * @memberof MinigameManager
     * @private
     * @param {number} difficulty - Game difficulty
     * @param {Function} onSuccess - Success callback
     * @param {Function} onFailure - Failure callback
     */
    #initializeLockpickingGame(difficulty, onSuccess, onFailure) {
        const lockpickingGame = new LockpickingGame(
            difficulty,
            () => {
                this.#currentGame.succeed();
            },
            () => {
                this.#currentGame.fail();
            }
        );

        this.#currentSpecificGame = lockpickingGame;

        const gameBoard = this.#minigameUI.getGameBoard();
        const lockpickingUI = new LockpickingUI(gameBoard);
        lockpickingUI.render(lockpickingGame);
    }

    /**
     * Puzzle játék inicializálása
     * 
     * @memberof MinigameManager
     * @private
     * @param {number} difficulty - Game difficulty
     * @param {Function} onSuccess - Success callback
     * @param {Function} onFailure - Failure callback
     */
    #initializePuzzleGame(difficulty, onSuccess, onFailure) {
        const puzzleGame = new PuzzleGame(
            difficulty,
            () => {
                this.#currentGame.succeed();
            },
            () => {
                this.#currentGame.fail();
            }
        );

        this.#currentSpecificGame = puzzleGame;

        const gameBoard = this.#minigameUI.getGameBoard();
        const puzzleUI = new PuzzleUI(gameBoard);
        puzzleUI.render(puzzleGame);
    }

    /**
     * Handle successful game completion
     * 
     * @memberof MinigameManager
     * @private
     * @param {Object} config - Game configuration
     * @param {Object} rewards - Rewards object
     */
    #handleSuccess(config, rewards) {
        console.log(`[MinigameManager] Game succeeded!`, rewards);
        
        // UI tisztítás - visszatérés a respawn ponthoz 🎮
        this.#minigameUI.clear();
        this.#audioManager?.switchTrack('dialogue');
        
        // If custom rewards callback provided, use that
        if (this.#onCompletionCallback) {
            this.#onCompletionCallback({
                success: true,
                rewards: rewards
            });
        } else if (config.onSuccess) {
            // Fallback to default config behavior (dialog)
            this.#dialogPanel.startDialog(
                config.onSuccess.character,
                config.onSuccess.dialogIndex
            );
        } else {
            // No callback and no dialog configured - just end silently
            console.log('[MinigameManager] Game completed with no dialog configured');
        }

        this.#currentGame = null;
    }

    /**
     * Handle game failure
     * 
     * @memberof MinigameManager
     * @private
     * @param {Object} config - Game configuration
     */
    #handleFailure(config) {
        console.log(`[MinigameManager] Game failed!`);
        
        // UI tisztítás - visszatérés a respawn ponthoz 🎮
        this.#minigameUI.clear();
        this.#audioManager?.switchTrack('dialogue');
        
        if (config && config.onFailure) {
            console.log(`[MinigameManager] Showing failure dialog: ${config.onFailure.character} / ${config.onFailure.dialogIndex}`);
            // DialogPanel közvetlenül rendereli az új dialógust
            this.#dialogPanel.startDialog(
                config.onFailure.character,
                config.onFailure.dialogIndex
            );
        } else {
            // No dialog configured on failure - just end silently
            console.log('[MinigameManager] Game failed with no dialog configured');
        }

        this.#currentGame = null;
    }

    /**
     * Get the currently active game
     * 
     * @memberof MinigameManager
     * @returns {Minigame|null} Current game or null
     */
    getCurrentGame() {
        return this.#currentGame;
    }

    /**
     * Check if a game is currently running
     * 
     * @memberof MinigameManager
     * @returns {boolean} Whether a game is active
     */
    isGameActive() {
        return this.#currentGame !== null && this.#currentGame.isActive();
    }

    /**
     * Stop the current game (player quits)
     * 
     * @memberof MinigameManager
     */
    cancelGame() {
        if (this.#currentGame && this.#currentGame.isActive()) {
            console.log(`[MinigameManager] Game cancelled`);
            this.#currentGame.fail();
        }
    }

    /**
     * Set completion callback for minigame rewards
     * 
     * @memberof MinigameManager
     * @param {Function} callback - Called on success with {success, rewards}
     */
    setOnCompletion(callback) {
        this.#onCompletionCallback = callback;
    }
}
