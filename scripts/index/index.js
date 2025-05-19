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

function makeGradientFollowMouse() {
    const intro = document.querySelector('.intro');
    if (!intro) return;

    let degree = 0;
    let increasing = true;
    let lastTime = 0;
    let autoAnimId = null;

    function calcDegree(x) {
        const w = window.innerWidth;
        return (x / w) * 360;
    }

    function updateBackground(deg) {
        intro.style.background = `
        linear-gradient(
          ${deg.toFixed(1)}deg,
          rgba(127,48,150,0.2) 0%,
          rgba(70,48,191,0.1) 10%,
          rgba(0,0,0,0.2) 100%
        )
      `;
    }
    function startAutoAnimation() {
        lastTime = performance.now();
        function animate(time) {
            const delta = (time - lastTime) / 1000;
            lastTime = time;

            const speed = 30;
            if (increasing) {
                degree = (degree + speed * delta) % 360;
            } else {
                degree = (degree - speed * delta + 360) % 360;
            }

            updateBackground(degree);
            autoAnimId = requestAnimationFrame(animate);
        }

        if (autoAnimId === null) {
            autoAnimId = requestAnimationFrame(animate);
        }
    }


    function stopAutoAnimation() {
        if (autoAnimId !== null) {
            cancelAnimationFrame(autoAnimId);
            autoAnimId = null;
        }
    }

    intro.addEventListener('mouseenter', () => {
        stopAutoAnimation();
    });

    intro.addEventListener('mousemove', e => {
        const newDeg = calcDegree(e.clientX);
        increasing = newDeg >= degree;
        degree = newDeg;
        updateBackground(degree);
    });

    intro.addEventListener('mouseleave', () => {
        startAutoAnimation();
    });

    startAutoAnimation();
}

function rocketShow() {
    const rocket = document.querySelector('.rocket-line-draft');
    const page = document.querySelectorAll('.page')[1];

    if (!rocket || !page) return;

    let isVisible = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isVisible) {
                rocket.style.animation = 'rocket-show 1.2s ease-out forwards';
                isVisible = true;
            }
            else if (!entry.isIntersecting && isVisible) {
                rocket.style.animation = 'none';
                rocket.style.opacity = '0';
                rocket.style.transform = 'translateY(100vh)';
                isVisible = false;

                setTimeout(() => {
                    rocket.style.transition = 'none';
                }, 500);
            }
        });
    }, {
        threshold: 0.01,
        root: null
    });

    observer.observe(page);
}


document.addEventListener('DOMContentLoaded', () => {
    // 导航栏控制
    new HeaderController();
    // 背景音乐控制
    new BackgroundMusic();
    // 第二页背景图控制
    makeGradientFollowMouse();
    // 火箭线稿控制
    rocketShow();
});
