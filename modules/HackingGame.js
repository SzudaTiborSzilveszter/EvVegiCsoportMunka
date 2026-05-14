/**
 * HackingGame - Hexadecimális kódok kiválasztásán alapuló minigame
 * A játékos egy gridben lévő kódokat kell kiválasztania egy megadott sorrendben.
 * Bármelyik cellát választhatja bármikor, csak a helyes kódok lehessenek kiválasztva.
 * Nyeréshez összes kódot ki kell választani a megfelelő sorrendben.
 */
export default class HackingGame {
    #difficulty;
    #grid;
    #targetCodes;
    #selectedPath;
    #onWin;
    #onLose;
    #isActive;

    /**
     * @param {number} difficulty - Nehézség szint (1-5)
     * @param {function} onWin - Callback siker esetén
     * @param {function} onLose - Callback kudarc esetén
     */
    constructor(difficulty, onWin, onLose) {
        this.#difficulty = difficulty;
        this.#onWin = onWin;
        this.#onLose = onLose;
        this.#isActive = true;
        this.#selectedPath = [];

        this.#initializeGame();
    }

    /**
     * Játék inicializálása - grid és célkódok generálása
     * @private
     */
    #initializeGame() {
        // Nehézség szerinti grid méret és cél szám
        const gridSizes = {
            1: { size: 3, targets: 2 },
            2: { size: 4, targets: 3 },
            3: { size: 5, targets: 4 },
            4: { size: 6, targets: 5 },
            5: { size: 7, targets: 6 }
        };

        const config = gridSizes[this.#difficulty] || gridSizes[1];
        const gridSize = config.size;
        const targetCount = config.targets;

        // Grid generálása random kódokkal
        this.#grid = this.#generateGrid(gridSize);

        // Válassz ki random cellákból célkódokat
        this.#targetCodes = this.#selectRandomTargetCodes(targetCount);

        console.log(`[HackingGame] Inicializálva! Grid: ${gridSize}x${gridSize}, Célkódok: ${targetCount}`);
        console.log(`[HackingGame] Célkódok:`, this.#targetCodes);
    }

    /**
     * Random hexadecimális kódok generálása (nincs duplikáció)
     * @private
     * @param {number} count - Hány kód kell
     * @returns {string[]} - Unique kódok tömbje
     */
    #generateUniqueCodes(count) {
        const codes = [];
        const seen = new Set();

        while (codes.length < count) {
            const hex1 = Math.floor(Math.random() * 16).toString(16).toUpperCase();
            const hex2 = Math.floor(Math.random() * 16).toString(16).toUpperCase();
            const code = `${hex1}${hex2}`;

            if (!seen.has(code)) {
                codes.push(code);
                seen.add(code);
            }
        }
        return codes;
    }

    /**
     * Grid generálása random, unique hexadecimális kódokkal
     * @private
     * @param {number} size - Grid mérete (3, 4, 5, stb.)
     * @returns {Object} - 2D grid objektumokkal
     */
    #generateGrid(size) {
        const grid = [];
        const totalCells = size * size;

        // Generáljuk az összes cellát unique kódokkal
        const codes = this.#generateUniqueCodes(totalCells);

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cellIndex = i * size + j;
                grid.push({
                    code: codes[cellIndex],
                    row: i,
                    col: j,
                    selected: false,
                    isTarget: false
                });
            }
        }

        return {
            size,
            cells: grid
        };
    }

    /**
     * Random N cellát kiválaszt a gridből és bejelöli őket célkódként
     * @private
     * @param {number} targetCount - Hány célkód kell
     * @returns {string[]} - A kiválasztott kódok sorrendben
     */
    #selectRandomTargetCodes(targetCount) {
        // Shuffle az összes cella
        const shuffled = [...this.#grid.cells].sort(() => Math.random() - 0.5);

        // Az első N cellát jelöljük meg célkódként és rendezettük az első N cellát
        const targetCodes = [];
        for (let i = 0; i < targetCount; i++) {
            shuffled[i].isTarget = true;
            targetCodes.push(shuffled[i].code);
        }

        return targetCodes;
    }

    /**
     * Cella kiválasztása
     * @param {number} cellIndex - A cella indexe a gridben
     * @returns {boolean} - Érvényes választás-e
     */
    selectCell(cellIndex) {
        if (!this.#isActive) return false;

        const cell = this.#grid.cells[cellIndex];
        if (!cell || cell.selected) return false; // Már kiválasztva vagy nincs cella

        // Ellenőrizzük, hogy a következő kód helyes-e
        const nextExpectedCode = this.#targetCodes[this.#selectedPath.length];
        if (cell.code !== nextExpectedCode) {
            console.log(`[HackingGame] Rossz kód! Várt: ${nextExpectedCode}, kapott: ${cell.code}`);
            return false;
        }

        // Kiválasztjuk a cellát
        this.#selectedPath.push(cell);
        cell.selected = true;

        console.log(`[HackingGame] Kiválasztva: ${cell.code} (${this.#selectedPath.length}/${this.#targetCodes.length})`);

        // Ellenőrizzük, hogy nyert-e
        if (this.#selectedPath.length === this.#targetCodes.length) {
            this.#handleWin();
            return true;
        }

        return true;
    }

    /**
     * Ellenőrizd, hogy egy cella választható-e
     * @param {Object} cell - A cella objektum
     * @returns {boolean} - Választható-e
     */
    isCellSelectable(cell) {
        if (cell.selected) return false;

        // Csak a következő kód választható
        const nextExpectedCode = this.#targetCodes[this.#selectedPath.length];
        return cell.code === nextExpectedCode;
    }

    /**
     * Játék nyerése
     * @private
     */
    #handleWin() {
        this.#isActive = false;
        console.log(`[HackingGame] SIKER! Az összes kód kiválasztva!`);
        this.#onWin();
    }

    /**
     * Játék vesztése
     * @private
     */
    #handleLose() {
        this.#isActive = false;
        console.log(`[HackingGame] KUDARC! Játék véget ért.`);
        this.#onLose();
    }

    /**
     * Adatok a UI-hez
     */
    getGridData() {
        return this.#grid;
    }

    /**
     * Célkódok megtekintése
     */
    getTargetCodes() {
        return this.#targetCodes;
    }

    /**
     * Kiválasztott útvonal
     */
    getSelectedPath() {
        return this.#selectedPath;
    }

    /**
     * Játék aktív-e
     */
    isActive() {
        return this.#isActive;
    }

    /**
     * Nehézség lekérése
     */
    getDifficulty() {
        return this.#difficulty;
    }
}
