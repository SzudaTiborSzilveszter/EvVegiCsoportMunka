export class AudioManager{
    constructor(){
        this.music = document.getElementById('bg-music');
        this.muted = false;
        this.volume = 0.5;
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
    playMusic() {
        this.music.play();
    }
    stopMusic(){
        this.music.pause();
}
}
