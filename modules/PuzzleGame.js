const DIRS = ['top', 'right', 'bottom', 'left'];
const DIR_INDEX = {
    top: 0,
    right: 1,
    bottom: 2,
    left: 3
};

const VECTORS = {
    top: { dr: -1, dc: 0, opposite: 'bottom' },
    right: { dr: 0, dc: 1, opposite: 'left' },
    bottom: { dr: 1, dc: 0, opposite: 'top' },
    left: { dr: 0, dc: -1, opposite: 'right' }
};

function rotateConnections(connections, steps) {
    const normalized = ((steps % 4) + 4) % 4;
    const rotated = [false, false, false, false];

    for (let i = 0; i < 4; i++) {
        rotated[(i + normalized) % 4] = connections[i];
    }

    return rotated;
}

export default class PuzzleGame {
    #difficulty;
    #size;
    #tiles;
    #isActive;
    #onWin;
    #onLose;
    #moveCount;
    #startIndex;
    #coreIndex;

    constructor(difficulty, onWin, onLose) {
        this.#difficulty = difficulty;
        this.#size = Math.min(6, Math.max(3, difficulty + 2));
        this.#onWin = onWin;
        this.#onLose = onLose;
        this.#isActive = true;
        this.#moveCount = 0;
        this.#tiles = [];
        this.#startIndex = 0;
        this.#coreIndex = this.#size * this.#size - 1;

        this.#generatePuzzle();
    }

    #index(row, col) {
        return row * this.#size + col;
    }

    #inBounds(row, col) {
        return row >= 0 && col >= 0 && row < this.#size && col < this.#size;
    }

    #randomInt(max) {
        return Math.floor(Math.random() * max);
    }

    #generatePathCoordinates() {
        const path = [{ row: 0, col: 0 }];
        let row = 0;
        let col = 0;

        while (row !== this.#size - 1 || col !== this.#size - 1) {
            const canGoDown = row < this.#size - 1;
            const canGoRight = col < this.#size - 1;

            if (canGoDown && canGoRight) {
                if (Math.random() > 0.5) {
                    row++;
                } else {
                    col++;
                }
            } else if (canGoDown) {
                row++;
            } else {
                col++;
            }

            path.push({ row, col });
        }

        return path;
    }

    #connectionsFromDirs(dirs) {
        const result = [false, false, false, false];
        dirs.forEach((dir) => {
            result[DIR_INDEX[dir]] = true;
        });
        return result;
    }

    #randomFillerConnections() {
        const templates = [
            this.#connectionsFromDirs(['top', 'bottom']),
            this.#connectionsFromDirs(['left', 'right']),
            this.#connectionsFromDirs(['top', 'right']),
            this.#connectionsFromDirs(['right', 'bottom']),
            this.#connectionsFromDirs(['bottom', 'left']),
            this.#connectionsFromDirs(['left', 'top']),
            this.#connectionsFromDirs(['top', 'right', 'bottom']),
            this.#connectionsFromDirs(['right', 'bottom', 'left']),
            this.#connectionsFromDirs(['top', 'bottom', 'left'])
        ];

        return [...templates[this.#randomInt(templates.length)]];
    }

    #directionBetween(a, b) {
        if (b.row === a.row - 1 && b.col === a.col) return 'top';
        if (b.row === a.row + 1 && b.col === a.col) return 'bottom';
        if (b.row === a.row && b.col === a.col - 1) return 'left';
        if (b.row === a.row && b.col === a.col + 1) return 'right';
        return null;
    }

    #generatePuzzle() {
        const path = this.#generatePathCoordinates();
        const pathMap = new Map();

        path.forEach((coord, index) => {
            pathMap.set(this.#index(coord.row, coord.col), { coord, index });
        });

        for (let row = 0; row < this.#size; row++) {
            for (let col = 0; col < this.#size; col++) {
                const idx = this.#index(row, col);
                const pathInfo = pathMap.get(idx);

                let baseConnections;
                let isStart = false;
                let isCore = false;

                if (pathInfo) {
                    const pathPos = pathInfo.index;
                    const dirs = [];

                    if (pathPos > 0) {
                        const prev = path[pathPos - 1];
                        const prevDir = this.#directionBetween(path[pathPos], prev);
                        if (prevDir) dirs.push(prevDir);
                    }

                    if (pathPos < path.length - 1) {
                        const next = path[pathPos + 1];
                        const nextDir = this.#directionBetween(path[pathPos], next);
                        if (nextDir) dirs.push(nextDir);
                    }

                    baseConnections = this.#connectionsFromDirs(dirs);
                    isStart = pathPos === 0;
                    isCore = pathPos === path.length - 1;
                } else {
                    baseConnections = this.#randomFillerConnections();
                }

                this.#tiles.push({
                    index: idx,
                    row,
                    col,
                    baseConnections,
                    rotation: this.#randomInt(4),
                    isStart,
                    isCore,
                    locked: false
                });
            }
        }

        if (this.isSolved()) {
            const nonTerminal = this.#tiles.find((tile) => !tile.isStart && !tile.isCore);
            if (nonTerminal) {
                nonTerminal.rotation = (nonTerminal.rotation + 1) % 4;
            }
        }
    }

    getDifficulty() {
        return this.#difficulty;
    }

    getSize() {
        return this.#size;
    }

    isActive() {
        return this.#isActive;
    }

    getMoveCount() {
        return this.#moveCount;
    }

    #getEffectiveConnections(tile) {
        return rotateConnections(tile.baseConnections, tile.rotation);
    }

    getBoardData() {
        return this.#tiles.map((tile) => ({
            index: tile.index,
            row: tile.row,
            col: tile.col,
            rotation: tile.rotation,
            isStart: tile.isStart,
            isCore: tile.isCore,
            locked: tile.locked,
            connections: this.#getEffectiveConnections(tile)
        }));
    }

    #getNeighbors(tile) {
        const currentConnections = this.#getEffectiveConnections(tile);
        const neighbors = [];

        for (let i = 0; i < DIRS.length; i++) {
            if (!currentConnections[i]) continue;

            const dir = DIRS[i];
            const vector = VECTORS[dir];
            const nr = tile.row + vector.dr;
            const nc = tile.col + vector.dc;

            if (!this.#inBounds(nr, nc)) continue;

            const neighbor = this.#tiles[this.#index(nr, nc)];
            const neighborConnections = this.#getEffectiveConnections(neighbor);
            const oppositeIndex = DIR_INDEX[vector.opposite];

            if (neighborConnections[oppositeIndex]) {
                neighbors.push(neighbor.index);
            }
        }

        return neighbors;
    }

    #computeReachableFromStart() {
        const visited = new Set();
        const queue = [this.#startIndex];
        visited.add(this.#startIndex);

        while (queue.length > 0) {
            const current = queue.shift();
            const tile = this.#tiles[current];
            const neighbors = this.#getNeighbors(tile);

            neighbors.forEach((nextIndex) => {
                if (!visited.has(nextIndex)) {
                    visited.add(nextIndex);
                    queue.push(nextIndex);
                }
            });
        }

        return visited;
    }

    getConnectedTileIndices() {
        return Array.from(this.#computeReachableFromStart());
    }

    getProgress() {
        const connected = this.#computeReachableFromStart();
        return {
            connected: connected.size,
            total: this.#tiles.length,
            reachesCore: connected.has(this.#coreIndex)
        };
    }

    isSolved() {
        const connected = this.#computeReachableFromStart();
        return connected.has(this.#coreIndex);
    }

    rotateTile(tileIndex, steps = 1) {
        if (!this.#isActive) return false;

        const tile = this.#tiles[tileIndex];
        if (!tile || tile.locked) return false;

        tile.rotation = ((tile.rotation + steps) % 4 + 4) % 4;
        this.#moveCount++;

        if (this.isSolved()) {
            this.#isActive = false;
            this.#onWin();
        }

        return true;
    }

    fail() {
        if (!this.#isActive) return false;
        this.#isActive = false;
        this.#onLose();
        return true;
    }
}
