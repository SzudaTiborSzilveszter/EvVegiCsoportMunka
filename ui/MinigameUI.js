/**
 * MinigameUI - Minigame konténer és UI elemek renderelése
 * 
 * Kezeli:
 * - Minigame panel megjelenítése
 * - Játék típusa és nehézsége
 * - UI elemek renderelése
 * 
 * @class MinigameUI
 * @example
 * const minigameUI = new MinigameUI(container);
 * minigameUI.render(game, config);
 */
export default class MinigameUI {
    /**
     * Konténer elem
     * @private
     * @type {HTMLElement}
     */
    #container;

    /**
     * Jelenlegi játék elem
     * @private
     * @type {HTMLElement}
     */
    #currentGameElement;

    /**
     * Új MinigameUI-t hoz létre
     * 
     * @param {HTMLElement} containerElement - Hova rendeljük a minigame-et
     */
    constructor(containerElement) {
        this.#container = containerElement;
        this.#currentGameElement = null;
    }

    /**
     * Minigame renderelése
     * 
     * @memberof MinigameUI
     * @param {Minigame} game - Minigame példány
     * @param {Object} config - Játék konfigurációja
     */
    render(game, config) {
        this.#container.innerHTML = '';

        const html = `<div class="minigame-panel">
                        <div class="minigame-header">
                            <span class="minigame-title">[${config.type.toUpperCase()}]</span>
                            <span class="minigame-difficulty">Nehézség: ${game.getDifficulty()}/5</span>
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
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[MinigameUI] Cancel button clicked, failing game...');
                game.fail();
            });
        } else {
            console.error('[MinigameUI] Cancel button not found in DOM');
        }
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
