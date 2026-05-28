/**
 * MainMenu - Főmenü UI komponens
 * 
 * Kezeli:
 * - Főmenü megjelenítése
 * - Beállítások kezelése
 * - Játék indítása
 * 
 * @class MainMenu
 * @example
 * const menu = new MainMenu(audioManager);
 * menu.setGameManager(gameManager);
 * menu.showMenu();
 */
export default class MainMenu {
    /**
     * Audio kezelő referencia
     * @private
     * @type {AudioManager}
     */
    #audioManager;

    /**
     * Játék kezelő referencia
     * @private
     * @type {GameManager}
     */
    #gameManager;

    /**
     * Főmenü konténer elem
     * @private
     * @type {HTMLElement}
     */
    #menuContainer;

    /**
     * Beállítások megnyitva-e
     * @private
     * @type {boolean}
     */
    #isSettingsOpen = false;

    /**
     * Új MainMenu-t hoz létre
     * 
     * @param {AudioManager} audioManager - Audio kezelő rendszer
     */
    constructor(audioManager) {
        this.#audioManager = audioManager;
        this.#createMenuContainer();
    }

    /**
     * GameManager referencia beállítása
     * @memberof MainMenu
     * @param {GameManager} gameManager - Játék kezelő
     */
    setGameManager(gameManager) {
        this.#gameManager = gameManager;
    }

    /**
     * Menü konténer létrehozása
     * @private
     * @memberof MainMenu
     */
    #createMenuContainer() {
        if (document.getElementById('main-menu')) {
            this.#menuContainer = document.getElementById('main-menu');
            return;
        }

        this.#menuContainer = document.createElement('div');
        this.#menuContainer.id = 'main-menu';
        this.#menuContainer.className = 'main-menu';
        document.body.appendChild(this.#menuContainer);
    }

    /**
     * Főmenü megjelenítése
     * @memberof MainMenu
     */
    showMenu() {
        this.#isSettingsOpen = false;
        this.#menuContainer.innerHTML = `
            <div class="main-menu-content">
                <div class="menu-title">
                    <h1>Neon Shadow</h1>
                    <p class="subtitle">Egy történet-vezérelt kaland</p>
                </div>
                
                <div class="menu-buttons">
                    <button id="play-btn" class="menu-button play-btn">
                        <span class="button-icon">▶</span>
                        JÁTÉK
                    </button>
                    <button id="settings-btn" class="menu-button settings-btn">
                        <span class="button-icon">⚙</span>
                        BEÁLLÍTÁSOK
                    </button>
                    <button id="exit-btn" class="menu-button exit-btn">
                        <span class="button-icon">⊗</span>
                        EXIT
                    </button>
                </div>
                
                <div class="menu-footer">
                    <p>Made with ❤️ by the team</p>
                </div>
            </div>
        `;

        this.#menuContainer.style.display = 'block';
        this.#attachEventListeners();
    }

    /**
     * Show settings menu
     * @private
     */
    #showSettings() {
        this.#isSettingsOpen = true;
        const currentVolume = Math.round(this.#audioManager.volume * 100);

        this.#menuContainer.innerHTML = `
            <div class="settings-menu-content">
                <div class="settings-header">
                    <h2>SETTINGS</h2>
                </div>
                
                <div class="settings-body">
                    <div class="setting-item">
                        <label for="volume-slider">Master Volume</label>
                        <div class="volume-control">
                            <span class="volume-icon">🔊</span>
                            <input 
                                type="range" 
                                id="volume-slider" 
                                min="0" 
                                max="100" 
                                value="${currentVolume}"
                                class="volume-slider"
                            >
                            <span class="volume-value">${currentVolume}%</span>
                        </div>
                    </div>

                    <div class="setting-item">
                        <label>
                            <input 
                                type="checkbox" 
                                id="mute-toggle"
                                ${this.#audioManager.muted ? 'checked' : ''}
                            >
                            Mute Audio
                        </label>
                    </div>
                </div>
                
                <div class="settings-buttons">
                    <button id="close-settings-btn" class="menu-button back-btn">
                        <span class="button-icon">←</span>
                        BACK
                    </button>
                </div>
            </div>
        `;

        this.#menuContainer.style.display = 'block';
        this.#attachSettingsEventListeners();
    }

    /**
     * Attach event listeners to main menu buttons
     * @private
     */
    #attachEventListeners() {
        const playBtn = document.getElementById('play-btn');
        const settingsBtn = document.getElementById('settings-btn');
        const exitBtn = document.getElementById('exit-btn');

        playBtn?.addEventListener('click', () => this.#onPlayClicked());
        settingsBtn?.addEventListener('click', () => this.#showSettings());
        exitBtn?.addEventListener('click', () => this.#onExitClicked());
    }

    /**
     * Attach event listeners to settings menu
     * @private
     */
    #attachSettingsEventListeners() {
        const closeBtn = document.getElementById('close-settings-btn');
        const volumeSlider = document.getElementById('volume-slider');
        const muteToggle = document.getElementById('mute-toggle');
        const volumeValue = document.querySelector('.volume-value');

        closeBtn?.addEventListener('click', () => this.showMenu());

        volumeSlider?.addEventListener('input', (e) => {
            const volume = parseInt(e.target.value) / 100;
            this.#audioManager.setVolume(volume);
            if (volumeValue) {
                volumeValue.textContent = `${e.target.value}%`;
            }
        });

        muteToggle?.addEventListener('change', (e) => {
            this.#audioManager.muted = e.target.checked;
            this.#audioManager.music.muted = e.target.checked;
        });
    }

    /**
     * Handle play button click
     * @private
     */
    #onPlayClicked() {
        if (!this.#gameManager) {
            console.error('GameManager not set');
            return;
        }

        console.log('🎮 Starting game...');
        this.#menuContainer.style.display = 'none';
        
        // Start the game with the initial scene
        this.#gameManager.startGame('apartmentDay');
    }

    /**
     * Handle exit button click
     * @private
     */
    #onExitClicked() {
        console.log('Closing game...');
        // For web, we can only close if the window was opened by JavaScript
        if (window.close && window.opener) {
            window.close();
        } else {
            // Alternative: show a message or navigate away
            alert('Thanks for playing! You can close this window now.');
            // Optionally navigate to a different page
            // window.location.href = 'about:blank';
        }
    }

    /**
     * Hide the menu
     */
    hideMenu() {
        this.#menuContainer.style.display = 'none';
    }
}
