const config = {
    gridSize: 8,
    cellSize: 80,
    mouseInfluenceRadius: 300,
};

class InteractiveGrid {
    constructor(svgElement) {
        this.svg = svgElement;
        this.lines = [];
        this.mousePos = { x: 0, y: 0 };
        this.setupGrid();
        this.setupEventListeners();
    }

    setupGrid() {
        const rect = this.svg.getBoundingClientRect();
        const aspectRatio = rect.width / rect.height;
        this.svg.setAttribute('viewBox', `0 0 ${1000 * aspectRatio} 1000`);

        const segments = 15;

        for (let i = 0; i <= config.gridSize; i++) {
            const y = (i * 1000) / config.gridSize;
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
                this.svg.appendChild(line);
                this.lines.push(line);
            }
        }

        for (let i = 0; i <= config.gridSize * aspectRatio; i++) {
            const x = (i * 1000 * aspectRatio) / (config.gridSize * aspectRatio);
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
                this.svg.appendChild(line);
                this.lines.push(line);
            }
        }
    }

    setupEventListeners() {
        this.svg.addEventListener('mousemove', (e) => {
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
                line.style.stroke = `rgba(255, 255, 255, ${intensity})`;
                line.setAttribute('data-intensity', intensity);
            } else {
                const currentIntensity = parseFloat(line.getAttribute('data-intensity') || 0);
                const newIntensity = Math.max(0, currentIntensity - 0.05);
                line.setAttribute('data-intensity', newIntensity);
                const glowStrength = newIntensity * 10;
                line.style.filter = `drop-shadow(0 0 ${glowStrength}px rgba(255, 255, 255, 0.9))`;
                line.style.stroke = `rgba(255, 255, 255, ${newIntensity})`;
                if (newIntensity <= 0) {
                    line.style.filter = 'none';
                    line.style.stroke = 'rgba(255, 255, 255, 0.1)';
                }
            }
        });
    }

    resetGrid() {
        this.lines.forEach(line => {
            line.style.filter = 'none';
            line.style.stroke = 'rgba(255, 255, 255, 0.1)';
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