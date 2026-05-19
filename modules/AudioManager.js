export default class AudioManager{
    constructor(){
        this.music = document.getElementById('bg-music');
        this.muted = false;
        this.volume = 0.5;
        this.music.volume = this.volume;
        // Allow muted autoplay in browsers with autoplay policy
        this.music.muted = false;
        this.tracks = {
            dialogue: 'assets/music/mrambient.mp3',
            minigame: 'assets/music/minigame.mp3',
            exploration: 'assets/music/cyberpunk.mp3'
        };
        
    }
    switchTrack(type) {
        if (this.tracks[type]) {
            const newSrc = this.tracks[type];
            // Csak akkor valt ha nem ugyanaz a zene szól már
            if (!this.music.src.includes(newSrc)) {
                this.music.src = newSrc;
                this.playMusic();
            }
        }
    }

    /**
     * Play a music file (used for scenes)
     * @param {string} musicPath - Path to music file or filename
     */
    playTrack(musicPath) {
        if (!musicPath) return;
        
        // Build full path if just filename
        const fullPath = musicPath.startsWith('assets/') ? musicPath : `assets/music/${musicPath}`;
        
        // Only switch if different track
        if (!this.music.src.includes(fullPath)) {
            this.music.src = fullPath;
            this.music.load();
        }
        
        // Try to play with error handling
        const playPromise = this.music.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Autoplay blocked or error:', error);
                // Autoplay was prevented, user needs to interact first
            });
        }
    }
    
    playMusic() {
        const playPromise = this.music.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Autoplay blocked or error:', error);
            });
        }
    }
    
    stopMusic(){
        this.music.pause();
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.music.volume = this.volume;
    }
}
