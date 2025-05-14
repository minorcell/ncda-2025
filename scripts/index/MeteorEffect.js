/**
 * MeteorEffect.js
 * 使用SVG和原生JavaScript实现流星效果
 */

class MeteorEffect {
    constructor(container) {
        this.container = container;
        this.svgNS = "http://www.w3.org/2000/svg";
        this.isActive = false; // 控制流星是否生成
        this.meteorTimer = null; // 流星生成定时器

        // 创建SVG元素
        this.svg = document.createElementNS(this.svgNS, "svg");
        this.svg.setAttribute("class", "meteor-container");
        this.svg.setAttribute("viewBox", "0 0 100 100");
        this.svg.setAttribute("preserveAspectRatio", "none");
        this.svg.style.position = "absolute";
        this.svg.style.top = "0";
        this.svg.style.left = "0";
        this.svg.style.width = "100%";
        this.svg.style.height = "100%";
        this.svg.style.pointerEvents = "none";
        this.svg.style.zIndex = "1";

        this.container.appendChild(this.svg);

        // 流星参数
        this.meteors = [];
        this.maxMeteors = 10; // 最大同时存在的流星数量

        // 设置页面可见性观察器
        this.setupVisibilityObserver();

        // 启动动画循环（只更新现有流星，不创建新流星）
        this.animate();
    }

    /**
     * 创建单个流星
     */
    createMeteor() {
        // 如果已达到最大流星数，不再创建
        if (this.meteors.length >= this.maxMeteors) return;

        // 随机生成流星参数
        const startX = 50 + Math.random() * 50; // 起始X坐标 (右半部分)
        const startY = Math.random() * 30; // 起始Y坐标 (上部)
        const length = 10 + Math.random() * 10; // 流星长度
        const angle = 150 + Math.random() * 30; // 角度 (150-180度)从右往左
        const speed = 1 + Math.random() * 1; // 速度
        const width = 0.1 + Math.random() * 0.1; // 流星宽度
        const tailLength = length * (1.2 + Math.random() * 0.8); // 尾迹长度

        // 计算方向和垂直方向
        const radians = angle * Math.PI / 180;
        const dirX = Math.cos(radians);
        const dirY = Math.sin(radians);
        const perpX = -dirY; // 垂直方向X
        const perpY = dirX;  // 垂直方向Y

        // 创建流星组
        const meteorGroup = document.createElementNS(this.svgNS, "g");

        // 创建流星头部(一个圆形)
        const meteorHead = document.createElementNS(this.svgNS, "circle");
        meteorHead.setAttribute("cx", startX);
        meteorHead.setAttribute("cy", startY);
        meteorHead.setAttribute("r", width * 0.8);
        meteorHead.setAttribute("fill", "rgba(255, 255, 255, 1)");
        meteorHead.setAttribute("filter", "blur(0.5px) drop-shadow(0 0 3px white)");

        // 创建流星主体(一个三角形)
        const meteorBody = document.createElementNS(this.svgNS, "polygon");

        // 计算三角形的点
        const headX = startX;
        const headY = startY;
        const tailX = startX - tailLength * dirX;
        const tailY = startY - tailLength * dirY;
        const width1 = width * 0.5; // 尾部宽度
        const width2 = width * 0.1; // 尾部末端宽度

        // 头部点
        const p1X = headX + width1 * perpX;
        const p1Y = headY + width1 * perpY;

        // 尾部两个点
        const p2X = tailX + width2 * perpX;
        const p2Y = tailY + width2 * perpY;
        const p3X = tailX - width2 * perpX;
        const p3Y = tailY - width2 * perpY;

        // 头部另一个点
        const p4X = headX - width1 * perpX;
        const p4Y = headY - width1 * perpY;

        // 设置多边形点
        meteorBody.setAttribute("points", `${p1X},${p1Y} ${p2X},${p2Y} ${p3X},${p3Y} ${p4X},${p4Y}`);
        meteorBody.setAttribute("fill", "rgba(255, 255, 255, 0.8)");

        // 创建流星尾迹(渐变效果)
        const meteorTail = document.createElementNS(this.svgNS, "polygon");
        meteorTail.setAttribute("points", `${p1X},${p1Y} ${p2X},${p2Y} ${p3X},${p3Y} ${p4X},${p4Y}`);
        meteorTail.setAttribute("fill", "url(#meteor-gradient)");
        meteorTail.setAttribute("filter", "blur(2px)");

        // 创建渐变定义（如果不存在）
        if (!document.getElementById('meteor-gradient')) {
            const defs = document.createElementNS(this.svgNS, "defs");
            const gradient = document.createElementNS(this.svgNS, "linearGradient");
            gradient.setAttribute("id", "meteor-gradient");
            gradient.setAttribute("x1", "0%");
            gradient.setAttribute("y1", "0%");
            gradient.setAttribute("x2", "100%");
            gradient.setAttribute("y2", "100%");

            const stop1 = document.createElementNS(this.svgNS, "stop");
            stop1.setAttribute("offset", "0%");
            stop1.setAttribute("stop-color", "rgba(255, 255, 255, 0.9)");

            const stop2 = document.createElementNS(this.svgNS, "stop");
            stop2.setAttribute("offset", "40%");
            stop2.setAttribute("stop-color", "rgba(255, 255, 255, 0.4)");

            const stop3 = document.createElementNS(this.svgNS, "stop");
            stop3.setAttribute("offset", "100%");
            stop3.setAttribute("stop-color", "rgba(255, 255, 255, 0)");

            gradient.appendChild(stop1);
            gradient.appendChild(stop2);
            gradient.appendChild(stop3);
            defs.appendChild(gradient);
            this.svg.appendChild(defs);
        }

        // 添加到组
        meteorGroup.appendChild(meteorTail);
        meteorGroup.appendChild(meteorBody);
        meteorGroup.appendChild(meteorHead);
        this.svg.appendChild(meteorGroup);

        // 存储流星信息
        const meteorObj = {
            element: meteorGroup,
            startX, startY,
            currentX: startX, currentY: startY,
            endX: startX + length * 3 * dirX, // 延长终点
            endY: startY + length * 3 * dirY,
            speed,
            length,
            width,
            tailLength,
            dirX, dirY,
            perpX, perpY,
            angle
        };

        this.meteors.push(meteorObj);

        return meteorObj;
    }

    /**
     * 更新流星位置
     */
    updateMeteors() {
        for (let i = this.meteors.length - 1; i >= 0; i--) {
            const meteor = this.meteors[i];

            // 计算新位置
            meteor.currentX += meteor.speed * meteor.dirX;
            meteor.currentY += meteor.speed * meteor.dirY;

            // 计算头部和尾部位置
            const headX = meteor.currentX;
            const headY = meteor.currentY;
            const tailX = headX - meteor.tailLength * meteor.dirX;
            const tailY = headY - meteor.tailLength * meteor.dirY;

            // 头部宽度和尾部宽度
            const width1 = meteor.width * 0.5;
            const width2 = meteor.width * 0.1;

            // 计算多边形的点
            const p1X = headX + width1 * meteor.perpX;
            const p1Y = headY + width1 * meteor.perpY;
            const p2X = tailX + width2 * meteor.perpX;
            const p2Y = tailY + width2 * meteor.perpY;
            const p3X = tailX - width2 * meteor.perpX;
            const p3Y = tailY - width2 * meteor.perpY;
            const p4X = headX - width1 * meteor.perpX;
            const p4Y = headY - width1 * meteor.perpY;

            // 更新头部圆形
            const meteorHead = meteor.element.children[2]; // 头部是第三个元素
            meteorHead.setAttribute("cx", headX);
            meteorHead.setAttribute("cy", headY);

            // 更新主体多边形
            const meteorBody = meteor.element.children[1]; // 主体是第二个元素
            meteorBody.setAttribute("points", `${p1X},${p1Y} ${p2X},${p2Y} ${p3X},${p3Y} ${p4X},${p4Y}`);

            // 更新尾迹多边形
            const meteorTail = meteor.element.children[0]; // 尾迹是第一个元素
            meteorTail.setAttribute("points", `${p1X},${p1Y} ${p2X},${p2Y} ${p3X},${p3Y} ${p4X},${p4Y}`);

            // 检查是否到达终点或离开可视区域
            if (
                meteor.currentY > 100 ||
                meteor.currentX > 120 ||
                meteor.currentX < -20 ||
                (meteor.currentX <= meteor.endX && meteor.currentY >= meteor.endY)
            ) {
                // 移除流星
                this.svg.removeChild(meteor.element);
                this.meteors.splice(i, 1);
            }
        }
    }

    setupVisibilityObserver() {
        // 创建IntersectionObserver来检测容器是否可见
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isActive) {
                    // 当页面可见时启动流星生成
                    this.startAnimation();
                } else if (!entry.isIntersecting && this.isActive) {
                    // 当页面不可见时停止流星生成
                    this.stopAnimation();
                }
            });
        }, {
            threshold: 0.1, // 当至少10%的内容可见时触发
            root: null // 使用视口作为根
        });

        // 开始观察容器
        observer.observe(this.container);
    }

    startAnimation() {
        if (this.isActive) return; // 如果已经激活，不重复启动

        this.isActive = true;
        console.log('流星效果已启动');

        // 创建初始流星
        this.createMeteor();

        // 定时创建新流星
        this.meteorTimer = setInterval(() => {
            this.createMeteor();
        }, 1000);
    }

    stopAnimation() {
        if (!this.isActive) return; // 如果已经停止，不重复操作

        this.isActive = false;
        console.log('流星效果已停止');

        // 清除定时器
        if (this.meteorTimer) {
            clearInterval(this.meteorTimer);
            this.meteorTimer = null;
        }
    }

    animate = () => {
        this.updateMeteors();
        requestAnimationFrame(this.animate);
    }
}

function init() {
    const pages = document.querySelectorAll('.page');

    for (let i = 0; i < Math.min(3, pages.length); i++) {
        if (i === 1) {
            new MeteorEffect(pages[i]);
        }
    }
}

document.addEventListener('DOMContentLoaded', init);
