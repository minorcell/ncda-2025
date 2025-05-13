class HeaderController {
    constructor() {
        this.header = document.querySelector('.header');
        this.container = document.querySelector('.container');
        this.lastScrollY = this.container.scrollTop;
        this.ticking = false;
        this.init();
    }

    init() {
        this.container.addEventListener('scroll', () => this.onScroll());
    }

    onScroll() {
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.updateHeader();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    updateHeader() {
        const currentScrollY = this.container.scrollTop;

        if (currentScrollY > this.lastScrollY && currentScrollY > this.header.offsetHeight) {
            this.header.style.transform = 'translateY(-100%)';
        }
        else {
            this.header.style.transform = 'translateY(0)';
        }

        this.lastScrollY = currentScrollY;
    }
}

class BackgroundMusic {
    constructor() {
        this.audio = document.getElementById('bgm');
        this.fadeInDuration = 10000;
        this.init();
    }

    init() {
        this.audio.volume = 0;

        const startPlayback = () => {
            this.audio.play();
            this.fadeIn();
            ['click', 'touchstart', 'keydown'].forEach(event => {
                document.removeEventListener(event, startPlayback);
            });
        };

        ['click', 'touchstart', 'keydown'].forEach(event => {
            document.addEventListener(event, startPlayback);
        });
    }

    fadeIn() {
        const startTime = performance.now();
        const startVolume = 0;
        const targetVolume = 0.3;

        const updateVolume = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(Math.max(elapsed / this.fadeInDuration, 0), 1);

            const volume = startVolume + (targetVolume - startVolume) * progress;
            this.audio.volume = Math.min(Math.max(volume, 0), 1);

            if (progress < 1) {
                requestAnimationFrame(updateVolume);
            }
        };

        requestAnimationFrame(updateVolume);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HeaderController();
    new BackgroundMusic();
});
