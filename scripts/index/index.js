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

const config = {
    gridHeight: 7,  // 设置网格的垂直方向上有多少行
    gridWidth: 12,  // 设置网格的水平方向上有多少列
    cellSize: 40,   // 设置网格单元格的大小（以像素为单位）
    mouseInfluenceRadius: 200,  // 设置鼠标影响网格的范围（以像素为单位），越大对性能要求越高
    throttleDelay: 20, // 鼠标移动事件的节流延迟（毫秒）
};

class InteractiveGrid {
    constructor(svgElement) {
        this.svg = svgElement;
        this.lines = [];
        this.mousePos = { x: 0, y: 0 };
        this.isThrottled = false;
        this.setupGrid();
        this.setupEventListeners();
    }

    setupGrid() {
        const rect = this.svg.getBoundingClientRect();
        const aspectRatio = rect.width / rect.height;
        this.svg.setAttribute('viewBox', `0 0 ${1000 * aspectRatio} 1000`);

        const segments = 60; // 减少分段数量以提高性能

        // 水平线
        for (let i = 0; i <= config.gridHeight; i++) {
            const y = (i * 1000) / config.gridHeight;
            for (let j = 0; j < segments; j++) {
                const x1 = (j * 1000 * aspectRatio) / segments;
                const x2 = ((j + 1) * 1000 * aspectRatio) / segments;
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", x1.toString());
                line.setAttribute("y1", y.toString());
                line.setAttribute("x2", x2.toString());
                line.setAttribute("y2", y.toString());
                line.setAttribute("data-original-y", y.toString());
                line.setAttribute("data-center-x", ((x1 + x2) / 2).toString());

                // 添加边缘渐变效果并存储基础透明度
                const edgeFactorY = Math.min(i / 2, (config.gridHeight - i) / 2);
                const opacity = Math.min(edgeFactorY, 1) * 0.15;
                line.setAttribute("data-base-opacity", opacity.toString());
                line.style.stroke = `rgba(255, 255, 255, ${opacity})`;

                this.svg.appendChild(line);
                this.lines.push(line);
            }
        }

        // 垂直线
        for (let i = 0; i <= config.gridWidth; i++) {
            const x = (i * 1000 * aspectRatio) / config.gridWidth;
            for (let j = 0; j < segments; j++) {
                const y1 = (j * 1000) / segments;
                const y2 = ((j + 1) * 1000) / segments;
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", x.toString());
                line.setAttribute("y1", y1.toString());
                line.setAttribute("x2", x.toString());
                line.setAttribute("y2", y2.toString());
                line.setAttribute("data-original-x", x.toString());
                line.setAttribute("data-center-y", ((y1 + y2) / 2).toString());

                // 添加边缘渐变效果并存储基础透明度
                const edgeFactorX = Math.min(i / 2, (config.gridWidth - i) / 2);
                const opacity = Math.min(edgeFactorX, 1) * 0.15;
                line.setAttribute("data-base-opacity", opacity.toString());
                line.style.stroke = `rgba(255, 255, 255, ${opacity})`;

                this.svg.appendChild(line);
                this.lines.push(line);
            }
        }
    }

    setupEventListeners() {
        this.svg.addEventListener('mousemove', (e) => {
            if (this.isThrottled) return;
            this.isThrottled = true;

            setTimeout(() => {
                this.isThrottled = false;
            }, config.throttleDelay);

            const rect = this.svg.getBoundingClientRect();
            const aspectRatio = rect.width / rect.height;
            const scaleX = (1000 * aspectRatio) / rect.width;
            const scaleY = 1000 / rect.height;

            this.mousePos = {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };

            this.updateGrid();
        });

        this.svg.addEventListener('mouseleave', () => {
            this.resetGrid();
        });
    }

    updateGrid() {
        const smoothstep = (min, max, value) => {
            const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
            return x * x * (3 - 2 * x);
        };

        this.lines.forEach(line => {
            let distance;
            const baseOpacity = parseFloat(line.getAttribute('data-base-opacity') || "0.15");

            if (line.hasAttribute('data-original-y')) {
                const centerX = parseFloat(line.getAttribute('data-center-x'));
                const centerY = parseFloat(line.getAttribute('data-original-y'));
                distance = Math.sqrt(Math.pow(centerX - this.mousePos.x, 2) + Math.pow(centerY - this.mousePos.y, 2));
            } else {
                const centerX = parseFloat(line.getAttribute('data-original-x'));
                const centerY = parseFloat(line.getAttribute('data-center-y'));
                distance = Math.sqrt(Math.pow(centerX - this.mousePos.x, 2) + Math.pow(centerY - this.mousePos.y, 2));
            }

            if (distance < config.mouseInfluenceRadius) {
                const intensity = smoothstep(0, config.mouseInfluenceRadius, config.mouseInfluenceRadius - distance);
                const glowStrength = intensity * 10;
                line.style.filter = `drop-shadow(0 0 ${glowStrength}px rgba(255, 255, 255, 0.9))`;
                line.style.stroke = `rgba(255, 255, 255, ${intensity})`; // Glow overrides base opacity
                line.setAttribute('data-intensity', intensity.toString());
            } else {
                const currentIntensity = parseFloat(line.getAttribute('data-intensity') || "0");
                const newIntensity = Math.max(0, currentIntensity - 0.05); // Slower fade out
                line.setAttribute('data-intensity', newIntensity.toString());

                if (newIntensity > 0) {
                    const glowStrength = newIntensity * 10;
                    line.style.filter = `drop-shadow(0 0 ${glowStrength}px rgba(255, 255, 255, 0.9))`;
                    line.style.stroke = `rgba(255, 255, 255, ${Math.max(baseOpacity, newIntensity)})`;
                } else {
                    line.style.filter = 'none';
                    line.style.stroke = `rgba(255, 255, 255, ${baseOpacity})`;
                    line.removeAttribute('data-intensity'); // Clean up attribute
                }
            }
        });
    }

    resetGrid() {
        this.lines.forEach(line => {
            const baseOpacity = parseFloat(line.getAttribute('data-base-opacity') || "0.15");
            line.style.filter = 'none';
            line.style.stroke = `rgba(255, 255, 255, ${baseOpacity})`;
            line.removeAttribute('data-intensity');
        });
    }
}

class PlanetStars {
    constructor() {
        this.canvas = document.querySelector('.planet-canvas');
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });

        this.stars = [];
        this.init();
        this.animate();
    }

    init() {
        // 设置渲染器尺寸
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // 设置相机位置
        this.camera.position.z = 5;

        // 创建星星
        const starGeometry = new THREE.SphereGeometry(0.01, 5, 5);
        const starMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true
        });

        // 创建多个星星
        for (let i = 0; i < 50; i++) {
            const star = new THREE.Mesh(starGeometry, starMaterial.clone());

            // 随机位置
            star.position.x = (Math.random() - 0.4) * 10;
            star.position.y = (Math.random() - 0.5) * 5;
            star.position.z = (Math.random() - 0.5) * 5;

            // 为每个星星添加动画属性
            star.userData = {
                speed: Math.random() * 0.001 + 0.001,
                opacity: Math.random() * 0.5 + 0.5
            };

            this.stars.push(star);
            this.scene.add(star);
        }

        // 监听窗口大小变化
        window.addEventListener('resize', () => this.onWindowResize());
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // 更新星星位置和透明度
        this.stars.forEach(star => {
            // 向上移动
            star.position.y += star.userData.speed;

            // 透明度闪烁
            const material = star.material;
            material.opacity = star.userData.opacity * (0.7 + 0.3 * Math.sin(Date.now() * 0.003));

            // 如果星星超出视野，重置到底部
            if (star.position.y > 3) {
                star.position.y = -3;
                star.position.x = (Math.random() - 0.5) * 5;
                star.position.z = (Math.random() - 0.5) * 5;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }
}

function makeGradientFollowMouse() {
    const intro = document.querySelector('.intro');
    if (!intro) return;

    let degree = 0;
    let increasing = true;
    let lastTime = 0;
    let autoAnimId = null;
    let isThrottled = false;
    let pendingUpdate = false;
    let targetDegree = 0;

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

    // 平滑插值函数
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
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

    // 节流的背景更新函数
    function throttledUpdate() {
        if (isThrottled) {
            pendingUpdate = true;
            return;
        }

        isThrottled = true;

        // 使用平滑插值让过渡更自然
        const smoothStep = () => {
            const diff = targetDegree - degree;

            // 处理角度循环（0-360度）
            let shortestDiff = diff;
            if (Math.abs(diff) > 180) {
                if (diff > 0) {
                    shortestDiff = diff - 360;
                } else {
                    shortestDiff = diff + 360;
                }
            }

            // 使用缓动插值
            degree += shortestDiff * 0.3;

            // 确保角度在0-360范围内
            if (degree < 0) degree += 360;
            if (degree >= 360) degree -= 360;

            updateBackground(degree);

            // 如果还没到达目标角度，继续动画
            if (Math.abs(shortestDiff) > 0.1) {
                requestAnimationFrame(smoothStep);
            } else {
                degree = targetDegree;
                updateBackground(degree);
            }
        };

        requestAnimationFrame(smoothStep);

        setTimeout(() => {
            isThrottled = false;
            if (pendingUpdate) {
                pendingUpdate = false;
                throttledUpdate();
            }
        }, 16); // 约60fps的节流
    }

    intro.addEventListener('mouseenter', () => {
        stopAutoAnimation();
    });

    intro.addEventListener('mousemove', e => {
        const newDeg = calcDegree(e.clientX);
        increasing = newDeg >= degree;
        targetDegree = newDeg;
        throttledUpdate();
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
    const header = document.querySelector('.header');
    const container = document.querySelector('.container');
    const pages = document.querySelectorAll('.page');
    const starsBgOfPageFive = document.querySelector('.stars-bg')
    // 导航栏控制
    new HeaderController(header, { container });
    // 背景音乐控制
    new BackgroundMusic();
    // 第二页背景图控制
    makeGradientFollowMouse();
    // 火箭线稿控制
    rocketShow();

    // 前三页面特效
    for (let i = 0; i < Math.min(3, pages.length); i++) {
        // 添加星空背景
        new StarBackground(pages[i]);

        // 在第二页添加流星效果
        if (i == 1) {
            new MeteorEffect(pages[i], {
                maxMeteors: 15,
                zIndex: 1,
                meteor: {
                    startXMin: 50,
                    startXMax: 100,
                    startYMin: 0,
                    startYMax: 30,
                    lengthMin: 10,
                    lengthMax: 20,
                    angleMin: 150,
                    angleMax: 180,
                    speedMin: 1,
                    speedMax: 2,
                    widthMin: 0.1,
                    widthMax: 0.2,
                    tailLengthMin: 1.2,
                    tailLengthMax: 2
                }
            });
        }
    }

    // 第五页面的部分的流行效果
    if (starsBgOfPageFive) {
        new StarBackground(starsBgOfPageFive, {
            starCount: 500,
            starSizeMin: 0.1,
            starSizeMax: 0.2,
            xSpeed: 0.0003,
            ySpeed: 0.0003
        });
    }

    const svgElement = document.querySelector('.grid-overlay');
    if (svgElement) {
        new InteractiveGrid(svgElement);
    }

    // 第四页面的行星星星效果
    new PlanetStars();

    // 鼠标特效
    new Mouse({
        defaultCursor: './assets/images/common/MouseDefault.svg',
        clickCursor: './assets/images/common/MouseClick.svg',
    });
});
