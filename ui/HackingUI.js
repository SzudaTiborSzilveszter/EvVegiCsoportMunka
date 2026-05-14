/**
 * HackingUI - Rendereli a hacking minigame UI-ját
 * Megjeleníti a hexadecimális grid-et és a célkódokat
 */
export default class HackingUI {
    #gameBoard;
    #hackingGame;

    /**
     * @param {HTMLElement} gameBoardContainer - Az elemtartó, ahova renderelünk
     */
    constructor(gameBoardContainer) {
        this.#gameBoard = gameBoardContainer;
    }

    /**
     * Hacking UI renderelése
     * @param {HackingGame} hackingGame - A HackingGame példány
     */
    render(hackingGame) {
        this.#hackingGame = hackingGame;
        this.#gameBoard.innerHTML = '';

        const gridData = hackingGame.getGridData();
        const targetCodes = hackingGame.getTargetCodes();
        const selectedPath = hackingGame.getSelectedPath();

        // A következő kiválasztandó kód
        const nextCode = targetCodes[selectedPath.length];

        // Elrendezés: bal oldalon grid, jobb oldalon célkódok
        const html = `
            <div class="hacking-container">
                <!-- Bal oldal: Grid -->
                <div class="hacking-grid-section">
                    <div class="hacking-label">RENDSZER</div>
                    <div class="hacking-grid" style="grid-template-columns: repeat(${gridData.size}, 1fr);">
                        ${gridData.cells.map((cell, index) => {
                            let classes = `hacking-cell`;
                            
                            if (cell.selected) classes += ` selected`;
                            
                            return `
                                <div class="${classes}"
                                    data-index="${index}"
                                    data-code="${cell.code}">
                                    ${cell.code}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Jobb oldal: Célkódok -->
                <div class="hacking-targets-section">
                    <div class="hacking-label">SZÜKSÉGES KÓDOK</div>
                    <div class="hacking-label" style="color: #ffaa00; text-shadow: 0 0 10px #ffaa00; margin-top: 10px;">JELENLEGI: ${nextCode || '✓'}</div>
                    <div class="hacking-targets">
                        ${targetCodes.map((code, index) => {
                            const isSelected = selectedPath[index] && selectedPath[index].code === code;
                            return `
                                <div class="hacking-target-code ${isSelected ? 'completed' : ''}">
                                    ${code}
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="hacking-progress">
                        <span id="progress-text">${selectedPath.length} / ${targetCodes.length}</span>
                    </div>
                </div>
            </div>
        `;

        this.#gameBoard.insertAdjacentHTML('beforeend', html);

        // Event listenerek hozzáadása a cellákhoz
        const cells = this.#gameBoard.querySelectorAll('.hacking-cell');
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => {
                this.#handleCellClick(index);
            });
        });
    }

    /**
     * Cella kattintás kezelése
     * @private
     */
    #handleCellClick(cellIndex) {
        if (!this.#hackingGame.isActive()) return;

        const gridData = this.#hackingGame.getGridData();
        const cell = gridData.cells[cellIndex];

        // Ellenőrizzük, hogy a cella választható-e
        if (!this.#hackingGame.isCellSelectable(cell)) {
            return;
        }

        const success = this.#hackingGame.selectCell(cellIndex);

        if (success) {
            // Frissítjük az UI-t
            this.render(this.#hackingGame);
        }
    }
}
