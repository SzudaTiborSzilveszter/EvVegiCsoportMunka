export default class AudioManager{
    constructor(){
        this.music = document.getElementById('bg-music');
        this.muted = false;
        this.volume = 0.5;
        this.music.volume = this.volume;
        // Allow muted autoplay in browsers with autoplay policy
        this.music.muted = false;
        this.tracks = {
            dialogue: 'assets/music/mrambiant.mp3',
            minigame: 'assets/music/minigame.mp3',
            exploration: 'assets/music/cyberpunk.mp3'
        };
        
        // Sound effects mapping
        this.soundEffects = {
            neutral: 'assets/sounds/dialogue_neutral.mp3',
            happy: 'assets/sounds/dialogue_happy.mp3',
            angry: 'assets/sounds/dialogue_angry.mp3',
            sad: 'assets/sounds/dialogue_sad.mp3',
            surprised: 'assets/sounds/dialogue_surprised.mp3',
            confident: 'assets/sounds/dialogue_confident.mp3'
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

    /**
     * Play a sound effect based on emotion
     * @param {string} emotion - Emotion type (e.g., 'happy', 'angry', 'sad')
     */
    playSoundEffect(emotion) {
        const soundPath = this.soundEffects[emotion] || this.soundEffects.neutral;
        
        const sfx = new Audio(soundPath);
        sfx.volume = this.volume * 0.8; // Slightly lower than music
        sfx.play().catch(error => {
            console.log('Sound effect blocked or error:', error);
        });
    }
}
