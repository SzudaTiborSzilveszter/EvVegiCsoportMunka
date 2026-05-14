import Minigame from './Minigame.js';

/**
 * MinigameManager - Central orchestrator for all minigames
 * Handles initialization, execution, and result handling
 */
export default class MinigameManager {
    #currentGame;
    #dialogSystem;
    #minigameUI;
    #gameConfig;
    #audioManager;

    /**
     * @param {DialogSystem} dialogSystem - Reference to the dialog system
     * @param {MinigameUI} minigameUI - Reference to the UI renderer
     * @param {Object} gameConfig - Minigame configuration data
     */
    constructor(dialogSystem, minigameUI, gameConfig) {
        this.#dialogSystem = dialogSystem;
        this.#minigameUI = minigameUI;
        this.#gameConfig = gameConfig;
        this.#audioManager = audioManager;
        this.#currentGame = null;
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

        return true;
    }

    /**
     * Handle successful game completion
     * @private
     */
    #handleSuccess(config) {
        console.log(`[MinigameManager] Game succeeded! Next dialog: ${config.onSuccess.character} / ${config.onSuccess.dialogIndex}`);
        this.#audioManager.switchTrack('dialogue');
        if (config.onSuccess) {
            this.#dialogSystem.startDialog(
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
        this.#audioManager.switchTrack('dialogue'); 
        if (config.onFailure) {
            this.#dialogSystem.startDialog(
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
