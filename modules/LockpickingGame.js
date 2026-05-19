export default class LockpickingGame {
    #difficulty;
    #ringCount;
    #sectorCount;
    #entrySector;
    #centerSector;
    #rings;
    #isActive;
    #onWin;
    #onLose;

    /**
     * @param {number} difficulty - Difficulty level (1-5)
     * @param {Function} onWin - Callback when solved
     * @param {Function} onLose - Callback when failed
     */
    constructor(difficulty, onWin, onLose) {
        this.#difficulty = difficulty;
        this.#ringCount = Math.max(3, difficulty + 2);
        this.#sectorCount = 8;
        this.#onWin = onWin;
        this.#onLose = onLose;
        this.#isActive = true;

        this.#entrySector = this.#randomInt(this.#sectorCount);
        this.#centerSector = this.#randomInt(this.#sectorCount);
        this.#rings = [];

        this.#generatePuzzle();
    }

    #randomInt(max) {
        return Math.floor(Math.random() * max);
    }

    #normalizeSector(value) {
        return ((value % this.#sectorCount) + this.#sectorCount) % this.#sectorCount;
    }

    #generatePuzzle() {
        let previousInnerSolved = null;

        for (let i = 0; i < this.#ringCount; i++) {
            const solvedRotation = this.#randomInt(this.#sectorCount);
            const solvedOuter = i === 0 ? this.#entrySector : previousInnerSolved;
            const solvedInner = i === this.#ringCount - 1
                ? this.#centerSector
                : this.#randomInt(this.#sectorCount);

            const baseOuter = this.#normalizeSector(solvedOuter - solvedRotation);
            const baseInner = this.#normalizeSector(solvedInner - solvedRotation);

            const currentRotation = this.#randomInt(this.#sectorCount);

            this.#rings.push({
                index: i,
                baseOuter,
                baseInner,
                solvedRotation,
                currentRotation
            });

            previousInnerSolved = solvedInner;
        }

        // Ensure the initial state is not accidentally solved.
        if (this.isSolved()) {
            this.#rings[0].currentRotation = this.#normalizeSector(
                this.#rings[0].currentRotation + 1
            );
        }
    }

    getDifficulty() {
        return this.#difficulty;
    }

    isActive() {
        return this.#isActive;
    }

    getRingCount() {
        return this.#ringCount;
    }

    getSectorCount() {
        return this.#sectorCount;
    }

    getEntrySector() {
        return this.#entrySector;
    }

    getCenterSector() {
        return this.#centerSector;
    }

    getRingData() {
        return this.#rings.map((ring) => ({
            index: ring.index,
            rotation: ring.currentRotation,
            outerGate: this.#normalizeSector(ring.baseOuter + ring.currentRotation),
            innerGate: this.#normalizeSector(ring.baseInner + ring.currentRotation)
        }));
    }

    rotateRing(ringIndex, steps = 1) {
        if (!this.#isActive) return false;

        const ring = this.#rings[ringIndex];
        if (!ring) return false;

        ring.currentRotation = this.#normalizeSector(ring.currentRotation + steps);

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

    isSolved() {
        const ringData = this.getRingData();

        if (ringData.length === 0) return false;
        if (ringData[0].outerGate !== this.#entrySector) return false;

        for (let i = 1; i < ringData.length; i++) {
            if (ringData[i].outerGate !== ringData[i - 1].innerGate) {
                return false;
            }
        }

        return ringData[ringData.length - 1].innerGate === this.#centerSector;
    }

    getConnectionProgress() {
        const ringData = this.getRingData();
        let connectedRings = 0;

        if (ringData.length === 0) {
            return { connectedRings, totalRings: 0, reachesCenter: false };
        }

        if (ringData[0].outerGate === this.#entrySector) {
            connectedRings = 1;

            for (let i = 1; i < ringData.length; i++) {
                if (ringData[i].outerGate !== ringData[i - 1].innerGate) {
                    break;
                }
                connectedRings++;
            }
        }

        const reachesCenter =
            connectedRings === ringData.length &&
            ringData[ringData.length - 1].innerGate === this.#centerSector;

        return {
            connectedRings,
            totalRings: ringData.length,
            reachesCenter
        };
    }
}
