export class AudioManager{
    constructor(){
        this.music = document.getElementById('bg-music');
        this.muted = false;
        this.volume = 0.5;
    }
    
    playMusic() {
        this.music.play();
    }
    stopMusic(){
        this.music.pause();
}
}
