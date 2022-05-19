class Player {
    track = null;
    gainNode = null;
    currentSoundLevel = 1;

    // controls
    controls = {
        audioElement: {
            id: 'audio',
            events: {
                ontimeupdate: this.showCurrentTime,
                onloadedmetadata: this.showTotalDuration,
                onended: this.pause
            }
        },
        playBtn: {
            id: 'playBtn',
            events: {
                onclick: this.play,
            }
        },
        // muteBtn: {
        //     id: 'muteSound',
        //     events: {
        //         onclick: this.mute
        //     }
        // },
        // volume: {
        //     id: 'volume',
        //     events: {
        //         oninput: this.changeVolume
        //     }
        // },
        progressBar: {
            id: 'progress'
        },
        currentDuration: {
            id: 'current-duration'
        },
        totalDuration: {
            id: 'total-duration'
        }
    };

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
        this.controls.progressBar.addEventListener('click', ev => {
            this.goToPosition(ev)
        })
    }

    setCurrentSong(songSrc) {
        this.controls.audioElement.src = songSrc;
        this.track = this.audioContext.createMediaElementSource(this.controls.audioElement);
        this.track.connect(this.gainNode).connect(this.audioContext.destination)
    }

    play() {
        this.audioContext.resume();
        this.controls.audioElement.play()
        this.controls.playBtn.children[0].classList.replace("fa-play", "fa-pause")
        this.controls.playBtn.onclick = () => {
            this.pause()
        };
    }

    pause() {
        this.controls.audioElement.pause();
        this.controls.playBtn.children[0].classList.replace("fa-pause", "fa-play")
        this.controls.playBtn.onclick = () => {
            this.play()
        };
    }

    showCurrentTime() {
        let duration = this.controls.audioElement.currentTime
        this.controls.currentDuration.innerText = this.toTime(duration);
        this.updateProgressBar()
    }

    updateProgressBar() {
        let progress = this.controls.audioElement.currentTime / this.controls.audioElement.duration * 100;
        this.controls.progressBar.children[0].style.width = `${progress}%`;
    }

    goToPosition(ev) {
        let newPosition = ev.offsetX / this.controls.progressBar.clientWidth
        this.controls.progressBar.children[0].style.width = `${newPosition * 100}%`;
        this.controls.audioElement.currentTime = this.controls.audioElement.duration * newPosition;
    }

    // mute() {
    //     if (this.gainNode.gain.value !== 0) {
    //         this.currentSoundLevel = this.gainNode.gain.value;
    //         this.gainNode.gain.value = 0;
    //         this.controls.muteBtn.children[0].classList.value = "fa-solid fa-volume-high"
    //         this.controls.volume.value = 0;
    //     } else if (this.gainNode.gain.value === 0 && this.currentSoundLevel !== 0) {
    //         this.gainNode.gain.value = this.currentSoundLevel;
    //         this.controls.volume.value = this.currentSoundLevel;
    //         this.currentSoundLevel = 0;
    //         this.controls.muteBtn.children[0].classList.value = "fa-solid fa-volume-xmark"
    //     }
    // }
    //
    // changeVolume() {
    //     this.gainNode.gain.value = this.controls.volume.value;
    // }
    showTotalDuration() {
        const duration = this.controls.audioElement.duration;
        this.controls.totalDuration.innerText = this.toTime(duration);
    }

    toTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        minutes = (minutes < 10 ? '0' : '') + minutes;
        seconds %= 60;
        seconds = (seconds < 10 ? '0' : '') + Math.floor(seconds)
        return `${minutes}:${seconds}`;
    }
}

const player = new Player()
player.setCurrentSong('music/jacinto-3.mp3');
