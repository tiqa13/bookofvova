class SoundManager {
    constructor() {
        this.sounds = {
            spin: new Audio('assets/sounds/spin.mp3'),
            reelStop: new Audio('assets/sounds/reel_stop.mp3'),
            win: new Audio('assets/sounds/win.mp3'),
            bigWin: new Audio('assets/sounds/big_win.mp3'),
            buttonClick: new Audio('assets/sounds/click.mp3')
        };
        
        // Ensure sounds don't block if missing or fail to load
        Object.values(this.sounds).forEach(audio => {
            audio.addEventListener('error', (e) => {
                console.warn(`Could not load audio file: ${audio.src}`);
            });
        });

        this.muted = false;
        
        // Loop the spin sound
        this.sounds.spin.loop = true;
    }

    play(soundName) {
        if (this.muted) return;
        
        const sound = this.sounds[soundName];
        if (sound) {
            // Reset to start in case it's already playing (except loopers)
            if (soundName !== 'spin') {
                sound.currentTime = 0;
            }
            sound.play().catch(e => {
                // Ignore autoplay policy errors until user interacts
                console.log(`Audio play prevented: ${e.message}`);
            });
        }
    }

    stop(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopAll();
        }
        return this.muted;
    }

    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
}
