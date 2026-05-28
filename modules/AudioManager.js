/**
 * AudioManager - Összes hanglejátszás kezelése (zene és hangeffektek)
 * 
 * Funkciók:
 * - Háttérzene lejátszás pályaváltással
 * - Hangeffekt lejátszás (dialógus hangok különféle érzelmekhez)
 * - Hangerő vezérlés (0.0-1.0)
 * - Némítás/feloldás funkcionalitás
 * - Böngésző automatikus lejátszás házirendjének kezelése
 * 
 * @class AudioManager
 * @example
 * const audioManager = new AudioManager();
 * audioManager.playTrack('mrambient.mp3');
 * audioManager.setVolume(0.7);
 * audioManager.playSoundEffect('happy');
 */
export default class AudioManager{
    /**
     * Audio elem háttérzenéhez
     * @private
     * @type {HTMLAudioElement}
     */
    #music;

    /**
     * Hogy a hang némítva van-e
     * @private
     * @type {boolean}
     */
    #muted;

    /**
     * Aktuális hangerő szint (0.0-1.0)
     * @private
     * @type {number}
     */
    #volume;

    /**
     * Zenedalok leképezése
     * @private
     * @type {Object<string, string>}
     */
    #tracks;

    /**
     * Hangeffektek leképezése (érzelemalapú)
     * @private
     * @type {Object<string, string>}
     */
    #soundEffects;

    /**
     * Új AudioManager-t hoz létre
     */
    constructor(){
        this.#music = document.getElementById('bg-music');
        this.#muted = false;
        this.#volume = 0.5;
        this.#music.volume = this.#volume;
        // Némított automatikus lejátszás engedélyezése böngésző házirendjéhez
        this.#music.muted = false;
        
        /**
         * Zenedalok típus szerint
         * @type {Object<string, string>}
         */
        this.tracks = {
            dialogue: 'assets/music/mrambient.mp3',
            minigame: 'assets/music/minigame.mp3',
            exploration: 'assets/music/cyberpunk.mp3'
        };
        
        /**
         * Hangeffektek érzelem/típus szerint
         * @type {Object<string, string>}
         */
        this.soundEffects = {
            neutral: 'assets/sounds/dialogue_neutral.mp3',
            happy: 'assets/sounds/dialogue_happy.mp3',
            angry: 'assets/sounds/dialogue_angry.mp3',
            sad: 'assets/sounds/dialogue_sad.mp3',
            surprised: 'assets/sounds/dialogue_surprised.mp3',
            confident: 'assets/sounds/dialogue_confident.mp3'
        };
    }

    /**
     * Aktuális hangerő szint lekérése
     * @type {number}
     */
    get volume() {
        return this.#volume;
    }

    /**
     * Az előre meghatározott zenei dalok közötti váltás
     * 
     * @param {string} type - Pálya típusa ("dialogue", "minigame", "exploration")
     */
    switchTrack(type) {
        if (this.tracks[type]) {
            const newSrc = this.tracks[type];
            // Csak akkor váltson, ha ezt a dallamot nem játssza
            if (!this.#music.src.includes(newSrc)) {
                this.#music.src = newSrc;
                this.playMusic();
            }
        }
    }

    /**
     * Megadott zenei pálya lejátszása
     * 
     * @param {string} musicPath - Zene fájl elérési útja vagy fájlneve
     * 
     * @example
     * audioManager.playTrack('mrambient.mp3');
     * audioManager.playTrack('assets/music/custom.mp3');
     */
    playTrack(musicPath) {
        if (!musicPath) return;
        
        // Teljes elérési út létrehozása, ha csak fájlnév van megadva
        const fullPath = musicPath.startsWith('assets/') ? musicPath : `assets/music/${musicPath}`;
        
        // Csak akkor váltson, ha más pálya
        if (!this.#music.src.includes(fullPath)) {
            this.#music.src = fullPath;
            this.#music.load();
        }
        
        // Lejátszás megkísérlése az automatikus lejátszás házirendjének hibakezelésével
        const playPromise = this.#music.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Automatikus lejátszás letiltva vagy hiba:', error);
                // Az automatikus lejátszás megakadályozva, felhasználó interakcióra van szükség
            });
        }
    }
    
    /**
     * Háttérzene lejátszása
     * 
     * Az automatikus lejátszás házirendje korlátozásait kecsesen kezeli.
     */
    playMusic() {
        const playPromise = this.#music.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Automatikus lejátszás letiltva vagy hiba:', error);
            });
        }
    }
    
    /**
     * Zene lejátszás leállítása
     */
    stopMusic(){
        this.#music.pause();
    }
    
    /**
     * Hangszint beállítása
     * 
     * @param {number} volume - Hangerő szint (0.0-1.0)
     */
    setVolume(volume) {
        this.#volume = Math.max(0, Math.min(1, volume));
        this.#music.volume = this.#volume;
    }

    /**
     * Hangeffekt lejátszása érzelemek alapján
     * @param {string} emotion - Érzelem típusa (pl.: 'happy', 'angry', 'sad')
     */
    playSoundEffect(emotion) {
        const soundPath = this.soundEffects[emotion] || this.soundEffects.neutral;
        
        const sfx = new Audio(soundPath);
        sfx.volume = this.volume * 0.8; // Kicsit alacsonyabb, mint a zene
        sfx.play().catch(error => {
            console.log('Hangeffekt letiltva vagy hiba:', error);
        });
    }
}
