const audioElement = document.getElementById('audio')

class Player {
    track = null;
    gainNode = null;
    isPlaying = false;
    currentSoundLevel = 1;
    audioDuration = null;

    // controls
    controls = {
        audioElement: {
            id: 'audio',
            events: {
                onloadedmetadata: this.changeProgressMaxDuration
            }
        },
        playBtn: {
            id: 'playBtn',
            events: {
                onclick: this.play
            }
        },
        muteBtn: {
            id: 'muteSound',
            events: {
                onclick: this.mute
            }
        },
        volume: {
            id: 'volume',
            events: {
                oninput: this.changeVolume
            }
        },
        progress: {
            id: 'progress-input',
            events: {
                oninput: this.audioProgress
            }
        },
        playTime: {
            id: 'play-time-indicator'
        },
        totalTime: {
            id: 'progress-total-time-indicator'
        }
    }

    constructor() {
        this.initPlayer();
        this.initControlElements();
    }

    initPlayer() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        this.gainNode = this.audioContext.createGain();
    }

    // replaces every id in controls object with respective html element
    initControlElements() {
        for (let item in this.controls) {
            let data = this.controls[item];
            let element = document.getElementById(data.id)

            // add events
            if (null !== data.events) {
                for (let ev in data.events) {
                    element[ev] = () => {
                        data.events[ev].call(this)
                    }
                }
            }
            this.controls[item] = element;
        }
    }

    setCurrentSong(songSrc) {
        this.controls.audioElement.src = songSrc;
        this.track = this.audioContext.createMediaElementSource(this.controls.audioElement);
        this.track.connect(this.gainNode).connect(this.audioContext.destination)
    }

    play() {
        this.audioContext.resume();
        if (!this.isPlaying) {
            this.controls.audioElement.play()
            this.controls.playBtn.children[0].classList.replace("fa-play", "fa-pause")
        } else {
            this.controls.audioElement.pause();
            this.controls.playBtn.children[0].classList.replace("fa-pause", "fa-play")
        }
        this.isPlaying = !this.isPlaying;
    }

    mute() {
        if (this.gainNode.gain.value !== 0) {
            this.currentSoundLevel = this.gainNode.gain.value;
            this.gainNode.gain.value = 0;
            this.controls.muteBtn.children[0].classList.value = "fa-solid fa-volume-high"
            this.controls.volume.value = 0;
        } else if (this.gainNode.gain.value === 0 && this.currentSoundLevel !== 0) {
            this.gainNode.gain.value = this.currentSoundLevel;
            this.controls.volume.value = this.currentSoundLevel;
            this.currentSoundLevel = 0;
            this.controls.muteBtn.children[0].classList.value = "fa-solid fa-volume-xmark"
        }
    }

    changeVolume() {
        this.gainNode.gain.value = this.controls.volume.value;
    }

    audioProgress(){
        let playTime = this.controls.progress.value;
        this.controls.audioElement.currentTime = playTime;
        this.controls.playTime.innerText = Math.round(playTime);
    }

    changeProgressMaxDuration() {
        const duration = this.controls.audioElement.duration;
        this.controls.progress.setAttribute("max", duration)
        this.controls.totalTime.innerText = Math.round(duration);
    }
}

const player = new Player()
player.setCurrentSong('music/jacinto-1.mp3');


// what to do when audio file ended to play
audioElement.addEventListener('ended', function (event) {
});
