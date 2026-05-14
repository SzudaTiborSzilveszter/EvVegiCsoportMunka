import Minigame from './Minigame.js';
import HackingGame from './HackingGame.js';
import HackingUI from '../ui/HackingUI.js';

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
     * @param {string} gameId - The minigame ID from config
     * @returns {boolean} - Whether the game started successfully
     */
    startGame(gameId) {
        const config = this.#gameConfig[gameId];
        if (!config) {
            console.error(`[MinigameManager] Game not found: ${gameId}`);
            return false;
        }

        console.log(`[MinigameManager] Starting game: ${gameId}`);

        const onSuccess = () => this.#handleSuccess(config);
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
            // Később majd a lockpicking játék...
            console.log('[MinigameManager] Lockpicking játék még nincs implementálva');
        } else if (config.type === 'puzzle') {
            // Később majd a puzzle játék...
            console.log('[MinigameManager] Puzzle játék még nincs implementálva');
        }

        return true;
    }

    /**
     * Hacking játék inicializálása
     * @private
     */
    #initializeHackingGame(difficulty, onSuccess, onFailure) {
        const hackingGame = new HackingGame(
            difficulty,
            () => {
                this.#currentGame.succeed();
                onSuccess();
            },
            () => {
                this.#currentGame.fail();
                onFailure();
            }
        );

        this.#currentSpecificGame = hackingGame;

        // UI renderelése
        const gameBoard = this.#minigameUI.getGameBoard();
        const hackingUI = new HackingUI(gameBoard);
        hackingUI.render(hackingGame);
    }

    /**
     * Handle successful game completion
     * @private
     */
    #handleSuccess(config) {
        console.log(`[MinigameManager] Game succeeded! Next dialog: ${config.onSuccess.character} / ${config.onSuccess.dialogIndex}`);
        
        // UI tisztítás - visszatérés a respawn ponthoz 🎮
        this.#minigameUI.clear();
        this.#audioManager.switchTrack('dialogue');
        if (config.onSuccess) {
            // DialogPanel közvetlenül rendereli az új dialógust
            this.#dialogPanel.startDialog(
                config.onSuccess.character,
                config.onSuccess.dialogIndex
            );
        }

        this.#currentGame = null;
    }

    /**
     * Handle game failure
     * @private
     */
    #handleFailure(config) {
        console.log(`[MinigameManager] Game failed! Next dialog: ${config.onFailure.character} / ${config.onFailure.dialogIndex}`);
        
        // UI tisztítás - visszatérés a respawn ponthoz 🎮
        this.#minigameUI.clear();
        this.#audioManager.switchTrack('dialogue'); 
        if (config.onFailure) {
            // DialogPanel közvetlenül rendereli az új dialógust
            this.#dialogPanel.startDialog(
                config.onFailure.character,
                config.onFailure.dialogIndex
            );
        }

        this.#currentGame = null;
    }

    /**
     * Get the currently active game
     */
    getCurrentGame() {
        return this.#currentGame;
    }

    /**
     * Check if a game is currently running
     */
    isGameActive() {
        return this.#currentGame !== null && this.#currentGame.isActive();
    }

    /**
     * Stop the current game (player quits)
     */
    cancelGame() {
        if (this.#currentGame && this.#currentGame.isActive()) {
            console.log(`[MinigameManager] Game cancelled`);
            this.#currentGame.fail();
        }
    }
}
