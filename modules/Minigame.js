export default class Minigame {
    #type;
    #difficulty;
    #onSuccess;
    #onFailure;
    #isActive;
    #startTime;
    #endTime;

    /**
     * @param {string} type - Game type ("lockpicking", "hacking", "puzzle")
     * @param {number} difficulty - Difficulty level (1-5)
     * @param {function} onSuccess - Callback when player wins
     * @param {function} onFailure - Callback when player loses
     */
    constructor(type, difficulty, onSuccess, onFailure) {
        this.#type = type;
        this.#difficulty = difficulty;
        this.#onSuccess = onSuccess;
        this.#onFailure = onFailure;
        this.#isActive = false;
        this.#startTime = null;
        this.#endTime = null;
    }

    /**
     * Start the minigame
     */
    start() {
        this.#isActive = true;
        this.#startTime = Date.now();
        console.log(`[Minigame] Started: ${this.#type}, Difficulty: ${this.#difficulty}`);
    }

    /**
     * End the minigame successfully
     */
    succeed() {
        if (!this.#isActive) return false;
        
        this.#isActive = false;
        this.#endTime = Date.now();
        const duration = this.#endTime - this.#startTime;
        
        console.log(`[Minigame] SUCCESS: ${this.#type} completed in ${duration}ms`);
        this.#onSuccess();
        return true;
    }

    /**
     * End the minigame with failure
     */
    fail() {
        if (!this.#isActive) return false;
        
        this.#isActive = false;
        this.#endTime = Date.now();
        const duration = this.#endTime - this.#startTime;
        
        console.log(`[Minigame] FAILURE: ${this.#type} failed after ${duration}ms`);
        this.#onFailure();
        return true;
    }

    /**
     * Get game type
     */
    getType() {
        return this.#type;
    }

    /**
     * Get difficulty
     */
    getDifficulty() {
        return this.#difficulty;
    }

    /**
     * Check if game is currently active
     */
    isActive() {
        return this.#isActive;
    }

    /**
     * Get elapsed time in milliseconds
     */
    getElapsedTime() {
        if (!this.#isActive) return this.#endTime - this.#startTime;
        return Date.now() - this.#startTime;
    }

    /**
     * Calculate difficulty multiplier (affects timing, accuracy, etc.)
     * Difficulty 1 = easy (slower, more forgiving)
     * Difficulty 5 = hard (faster, less forgiving)
     */
    getDifficultyMultiplier() {
        return 0.5 + (this.#difficulty * 0.1);
    }
}
