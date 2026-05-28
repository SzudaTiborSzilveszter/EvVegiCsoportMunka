/**
 * PuzzleUI - Puzzle minigame UI
 * 
 * Kezeli:
 * - Puzzle grid megjelenítése
 * - Csempék és csatlakozások
 * - Játék előrehaladása
 * 
 * @class PuzzleUI
 * @example
 * const puzzleUI = new PuzzleUI(container);
 * puzzleUI.render(game);
 */
export default class PuzzleUI {
    /**
     * Konténer elem
     * @private
     * @type {HTMLElement}
     */
    #container;

    /**
     * Puzzle játék referencia
     * @private
     * @type {PuzzleGame}
     */
    #game;

    /**
     * Új PuzzleUI-t hoz létre
     * 
     * @param {HTMLElement} container - Konténer elem
     */
    constructor(container) {
        this.#container = container;
        this.#game = null;
    }

    /**
     * UI renderelése
     * 
     * @memberof PuzzleUI
     * @param {PuzzleGame} game - Puzzle játék
     */
    render(game) {
        this.#game = game;
        this.#container.innerHTML = '';

        const board = game.getBoardData();
        const size = game.getSize();
        const progress = game.getProgress();
        const connectedSet = new Set(game.getConnectedTileIndices());

        const html = `
            <div class="puzzle-container">
                <div class="puzzle-meta">
                    <div class="puzzle-title">ÁRAMKÖR IGAZÍTÁSA</div>
                    <div class="puzzle-hint">Forgasd el a csempéket a START és CORE összekapcsolásához.</div>
                    <div class="puzzle-stats">Lépések: ${game.getMoveCount()} | Csatlakozva: ${progress.connected}/${progress.total}</div>
                </div>
                <div class="puzzle-grid" style="grid-template-columns: repeat(${size}, 1fr);">
                    ${board.map((tile) => this.#renderTile(tile, connectedSet.has(tile.index))).join('')}
                </div>
            </div>
        `;

        this.#container.insertAdjacentHTML('beforeend', html);

        const tiles = this.#container.querySelectorAll('.puzzle-tile');
        tiles.forEach((tileElement) => {
            tileElement.addEventListener('click', (event) => {
                const tileIndex = Number(event.currentTarget.getAttribute('data-index'));
                const rotated = this.#game.rotateTile(tileIndex, 1);

                if (rotated && this.#game.isActive()) {
                    this.render(this.#game);
                }
            });
        });
    }

    #renderTile(tile, isConnected) {
        /**
         * Csempe renderelése
         * 
         * @memberof PuzzleUI
         * @private
         * @param {Object} tile - Csempe objektum
         * @param {boolean} isConnected - Csatlakozva van-e
         * @returns {string} HTML csempe
         */
        const classes = ['puzzle-tile'];
        if (tile.isStart) classes.push('start');
        if (tile.isCore) classes.push('core');
        if (tile.locked) classes.push('locked');
        if (isConnected) classes.push('connected');

        const connectors = [];
        if (tile.connections[0]) connectors.push('<span class="tile-conn top"></span>');
        if (tile.connections[1]) connectors.push('<span class="tile-conn right"></span>');
        if (tile.connections[2]) connectors.push('<span class="tile-conn bottom"></span>');
        if (tile.connections[3]) connectors.push('<span class="tile-conn left"></span>');

        let label = '';
        if (tile.isStart) label = '<span class="tile-label">S</span>';
        if (tile.isCore) label = '<span class="tile-label">C</span>';

        return `
            <button class="${classes.join(' ')}" data-index="${tile.index}" ${tile.locked ? 'disabled' : ''}>
                ${connectors.join('')}
                <span class="tile-center"></span>
                ${label}
            </button>
        `;
    }
}
