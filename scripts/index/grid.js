const config = {
    gridSize: 10,
    cellSize: 40,
    mouseInfluenceRadius: 400,
    maxDisplacement: 10,
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

        for (let i = 0; i <= config.gridSize; i++) {
            const y = (i * 1000) / config.gridSize;
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", "0");
            line.setAttribute("y1", y.toString());
            line.setAttribute("x2", (1000 * aspectRatio).toString());
            line.setAttribute("y2", y.toString());
            line.setAttribute("data-original-y", y);
            this.svg.appendChild(line);
            this.lines.push(line);
        }

        for (let i = 0; i <= config.gridSize * aspectRatio; i++) {
            const x = (i * 1000 * aspectRatio) / (config.gridSize * aspectRatio);
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", x.toString());
            line.setAttribute("y1", "0");
            line.setAttribute("x2", x.toString());
            line.setAttribute("y2", "1000");
            line.setAttribute("data-original-x", x);
            this.svg.appendChild(line);
            this.lines.push(line);
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
        this.lines.forEach(line => {
            if (line.hasAttribute('data-original-y')) {
                const originalY = parseFloat(line.getAttribute('data-original-y'));
                const distance = Math.abs(originalY - this.mousePos.y);

                if (distance < config.mouseInfluenceRadius) {
                    const displacement = (1 - distance / config.mouseInfluenceRadius) * config.maxDisplacement;
                    const newY = originalY + Math.sin((this.mousePos.x / 1000) * Math.PI * 2) * displacement;
                    line.setAttribute('y1', newY);
                    line.setAttribute('y2', newY);
                }
            } else {
                const originalX = parseFloat(line.getAttribute('data-original-x'));
                const distance = Math.abs(originalX - this.mousePos.x);

                if (distance < config.mouseInfluenceRadius) {
                    const displacement = (1 - distance / config.mouseInfluenceRadius) * config.maxDisplacement;
                    const newX = originalX + Math.sin((this.mousePos.y / 1000) * Math.PI * 2) * displacement;
                    line.setAttribute('x1', newX);
                    line.setAttribute('x2', newX);
                }
            }
        });
    }

    resetGrid() {
        this.lines.forEach(line => {
            if (line.hasAttribute('data-original-y')) {
                const originalY = line.getAttribute('data-original-y');
                line.setAttribute('y1', originalY);
                line.setAttribute('y2', originalY);
            } else {
                const originalX = line.getAttribute('data-original-x');
                line.setAttribute('x1', originalX);
                line.setAttribute('x2', originalX);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const svgElement = document.querySelector('.grid-overlay');
    if (svgElement) {
        new InteractiveGrid(svgElement);
    }
});
