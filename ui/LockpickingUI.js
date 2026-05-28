/**
 * LockpickingUI - Lockpicking minigame UI
 * 
 * Kezeli:
 * - Zárkör megjelenítése és rajzolása
 * - Szektorszámok és csatlakozások
 * - Minigame interaktív UI-ja
 * 
 * @class LockpickingUI
 * @example
 * const lockpickingUI = new LockpickingUI(container);
 * lockpickingUI.render(game);
 */
export default class LockpickingUI {
    /**
     * Konténer elem
     * @private
     * @type {HTMLElement}
     */
    #container;

    /**
     * Lockpicking játék referencia
     * @private
     * @type {LockpickingGame}
     */
    #game;

    /**
     * Új LockpickingUI-t hoz létre
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
     * @memberof LockpickingUI
     * @param {LockpickingGame} game - Lockpicking játék
     */
    render(game) {
        this.#game = game;
        this.#container.innerHTML = "";

        const ringData = game.getRingData();
        const sectorCount = game.getSectorCount();
        const entrySector = game.getEntrySector();
        const centerSector = game.getCenterSector();
        const progress = game.getConnectionProgress();

        const size = 560;
        const center = size / 2;
        const outerRadius = 220;
        const ringThickness = 28;
        const gap = 8;
        
        // Összes körgyűrűhöz szükséges hely kiszámítása
        const totalRingCount = ringData.length;
        const totalThickness = totalRingCount * ringThickness + (totalRingCount - 1) * gap;
        // Méretezési faktor az összes körgyűrűhöz az elérhető teret betölteni
        const scaleFactor = totalThickness > 200 ? 200 / totalThickness : 1;
        const adjustedRingThickness = ringThickness * scaleFactor;
        const adjustedGap = gap * scaleFactor;

        const svgParts = [];

        svgParts.push(`<svg class="lockpicking-svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="Lockpicking circles">`);

        svgParts.push(`<circle cx="${center}" cy="${center}" r="8" class="lock-center-dot" />`);

        // Entry marker (outside)
        const entryPoint = this.#pointOnCircle(center, center, outerRadius + 20, this.#sectorToAngle(entrySector, sectorCount));
        svgParts.push(`<circle cx="${entryPoint.x}" cy="${entryPoint.y}" r="7" class="lock-entry-dot" />`);

        for (let i = 0; i < ringData.length; i++) {
            const ring = ringData[i];
            const radiusOuter = outerRadius - i * (adjustedRingThickness + adjustedGap);
            const radiusInner = radiusOuter - adjustedRingThickness;
            const radiusMid = (radiusOuter + radiusInner) / 2;
            const isConnected = i < progress.connectedRings;

            svgParts.push(
                `<circle class="lock-ring" cx="${center}" cy="${center}" r="${radiusMid}" ` +
                `stroke-width="${adjustedRingThickness}" data-ring-index="${i}" />`
            );

            const outerAngle = this.#sectorToAngle(ring.outerGate, sectorCount);
            const innerAngle = this.#sectorToAngle(ring.innerGate, sectorCount);

            const outerGatePoint = this.#pointOnCircle(center, center, radiusOuter, outerAngle);
            const innerGatePoint = this.#pointOnCircle(center, center, radiusInner, innerAngle);

            svgParts.push(`<circle cx="${outerGatePoint.x}" cy="${outerGatePoint.y}" r="4" class="lock-gate" />`);
            svgParts.push(`<circle cx="${innerGatePoint.x}" cy="${innerGatePoint.y}" r="4" class="lock-gate" />`);

            svgParts.push(this.#buildGatePath(center, center, radiusOuter, radiusInner, radiusMid, outerAngle, innerAngle, isConnected));
        }

        // Center target indicator
        const centerPoint = this.#pointOnCircle(center, center, 18, this.#sectorToAngle(centerSector, sectorCount));
        svgParts.push(`<circle cx="${centerPoint.x}" cy="${centerPoint.y}" r="5" class="lock-center-target" />`);

        svgParts.push(`</svg>`);

        const instructions = `
            <div class="lockpicking-meta">
                <div class="lockpicking-title">ROTATE THE RINGS</div>
                <div class="lockpicking-hint">Click a ring to rotate it until the route connects from entry to center.</div>
                <div class="lockpicking-progress">Connected: ${progress.connectedRings}/${progress.totalRings}</div>
            </div>
        `;

        this.#container.insertAdjacentHTML("beforeend", `
            <div class="lockpicking-container">
                ${svgParts.join("")}
                ${instructions}
            </div>
        `);

        const ringElements = this.#container.querySelectorAll(".lock-ring");
        ringElements.forEach((ringElement) => {
            ringElement.addEventListener("click", (event) => {
                const ringIndex = Number(event.currentTarget.getAttribute("data-ring-index"));
                const rotated = this.#game.rotateRing(ringIndex, 1);
                if (rotated && this.#game.isActive()) {
                    this.render(this.#game);
                }
            });
        });
    }

    #sectorToAngle(sector, sectorCount) {
        // Start from top (-90deg)
        return ((sector / sectorCount) * Math.PI * 2) - Math.PI / 2;
    }

    #pointOnCircle(cx, cy, radius, angle) {
        return {
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius
        };
    }

    #buildGatePath(cx, cy, radiusOuter, radiusInner, radiusMid, outerAngle, innerAngle, connected) {
        const outerMidPoint = this.#pointOnCircle(cx, cy, radiusMid, outerAngle);
        const innerMidPoint = this.#pointOnCircle(cx, cy, radiusMid, innerAngle);
        const outerPoint = this.#pointOnCircle(cx, cy, radiusOuter, outerAngle);
        const innerPoint = this.#pointOnCircle(cx, cy, radiusInner, innerAngle);

        const angleDiff = this.#normalizeAngleDiff(innerAngle - outerAngle);
        const largeArcFlag = Math.abs(angleDiff) > Math.PI ? 1 : 0;
        const sweepFlag = angleDiff >= 0 ? 1 : 0;

        const className = connected ? "lock-route connected" : "lock-route";

        const d = [
            `M ${outerPoint.x} ${outerPoint.y}`,
            `L ${outerMidPoint.x} ${outerMidPoint.y}`,
            `A ${radiusMid} ${radiusMid} 0 ${largeArcFlag} ${sweepFlag} ${innerMidPoint.x} ${innerMidPoint.y}`,
            `L ${innerPoint.x} ${innerPoint.y}`
        ].join(" ");

        return `<path d="${d}" class="${className}" />`;
    }

    #normalizeAngleDiff(angle) {
        while (angle > Math.PI) angle -= Math.PI * 2;
        while (angle < -Math.PI) angle += Math.PI * 2;
        return angle;
    }
}
