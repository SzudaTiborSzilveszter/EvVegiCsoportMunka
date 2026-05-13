/**
 * MinigameUI - Renders the minigame container and UI elements
 */
export default class MinigameUI {
    #container;
    #currentGameElement;

    /**
     * @param {HTMLElement} containerElement - Where to render the minigame
     */
    constructor(containerElement) {
        this.#container = containerElement;
        this.#currentGameElement = null;
    }

    /**
     * Render a minigame
     * @param {Minigame} game - The minigame instance
     * @param {Object} config - The game configuration
     */
    render(game, config) {
        this.#container.innerHTML = '';

        const html = `<div class="minigame-panel">
                        <div class="minigame-header">
                            <span class="minigame-title">[${config.type.toUpperCase()}]</span>
                            <span class="minigame-difficulty">Difficulty: ${game.getDifficulty()}/5</span>
                        </div>
                        
                        <div class="minigame-content">
                            <div id="minigame-board" class="minigame-board"></div>
                        </div>
                        
                        <div class="minigame-footer">
                            <div class="minigame-timer">Time: <span id="timer">0</span>s</div>
                            <button id="cancel-btn" class="minigame-cancel-btn">Cancel (Fail)</button>
                        </div>
                    </div>`;

        this.#container.insertAdjacentHTML('beforeend', html);
        this.#currentGameElement = this.#container.querySelector('.minigame-panel');

        this.#startTimer(game);

        const cancelBtn = this.#container.querySelector('#cancel-btn');
        cancelBtn.addEventListener('click', () => {
            console.log('[MinigameUI] Cancel button clicked');
            game.fail();
        });
    }

    /**
     * Get the game board element (where specific games render their content)
     */
    getGameBoard() {
        if (!this.#currentGameElement) return null;
        return this.#currentGameElement.querySelector('#minigame-board');
    }

    /**
     * Update timer display
     * @private
     */
    #startTimer(game) {
        const timerElement = this.#currentGameElement.querySelector('#timer');
        
        const timerInterval = setInterval(() => {
            if (!game.isActive()) {
                clearInterval(timerInterval);
                return;
            }
            
            const seconds = Math.floor(game.getElapsedTime() / 1000);
            timerElement.textContent = seconds;
        }, 100);
    }

    /**
     * Show a success message
     */
    showSuccess() {
        if (!this.#currentGameElement) return;
        
        const content = this.#currentGameElement.querySelector('.minigame-content');
        const message = document.createElement('div');
        message.className = 'minigame-message success';
        message.innerHTML = '<span>SUCCESS!</span>';
        content.appendChild(message);
    }

    /**
     * Show a failure message
     */
    showFailure() {
        if (!this.#currentGameElement) return;
        
        const content = this.#currentGameElement.querySelector('.minigame-content');
        const message = document.createElement('div');
        message.className = 'minigame-message failure';
        message.innerHTML = '<span>FAILED!</span>';
        content.appendChild(message);
    }

    /**
     * Clear the minigame UI
     */
    clear() {
        this.#container.innerHTML = '';
        this.#currentGameElement = null;
    }
}
