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

function init() {
    const svgElement = document.querySelector('.grid-overlay');
    if (svgElement) {
        new InteractiveGrid(svgElement);
    }
}

document.addEventListener('DOMContentLoaded', init);