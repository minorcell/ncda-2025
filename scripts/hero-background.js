// 这是一个额外的背景动画效果，可以替代或补充现有的粒子效果
// 将此文件保存为hero-background.js，并在index.html中引入

document.addEventListener("DOMContentLoaded", () => {
  // 创建一个新的canvas元素
  const heroSection = document.querySelector(".hero");
  const canvas = document.createElement("canvas");
  canvas.id = "heroBackground";
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "-2";

  // 将canvas插入到hero section的最前面
  heroSection.insertBefore(canvas, heroSection.firstChild);

  const ctx = canvas.getContext("2d");

  // 设置canvas尺寸
  function setCanvasSize() {
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  }

  setCanvasSize();
  window.addEventListener("resize", setCanvasSize);

  // 创建网格点
  class GridPoint {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.baseY = y;
      this.density = Math.random() * 30 + 1;
      this.distance = 0;
      this.radius = Math.random() * 2 + 1;
      this.color = this.getRandomColor();
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    getRandomColor() {
      const colors = [
        "rgba(108, 99, 255, 0.8)",
        "rgba(255, 107, 107, 0.8)",
        "rgba(255, 164, 0, 0.8)",
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    update(mouseX, mouseY) {
      // 计算点与鼠标的距离
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 鼠标影响范围
      const mouseRadius = 150;

      if (distance < mouseRadius) {
        const force = mouseRadius / distance;
        const angle = Math.atan2(dy, dx);
        const tx = this.x - force * Math.cos(angle) * 0.5;
        const ty = this.y - force * Math.sin(angle) * 0.5;

        this.x = tx;
        this.y = ty;
      } else {
        // 如果不在鼠标影响范围内，逐渐回到原位
        if (this.x !== this.baseX) {
          const dx = this.baseX - this.x;
          this.x += dx / 20;
        }
        if (this.y !== this.baseY) {
          const dy = this.baseY - this.y;
          this.y += dy / 20;
        }
      }
    }
  }

  // 创建网格
  let gridPoints = [];
  function createGrid() {
    gridPoints = [];
    const gridSize = 30; // 网格间距

    for (let y = 0; y < canvas.height; y += gridSize) {
      for (let x = 0; x < canvas.width; x += gridSize) {
        // 添加一些随机偏移
        const offsetX = Math.random() * 10 - 5;
        const offsetY = Math.random() * 10 - 5;
        gridPoints.push(new GridPoint(x + offsetX, y + offsetY));
      }
    }
  }

  createGrid();
  window.addEventListener("resize", createGrid);

  // 鼠标位置
  let mouseX = 0;
  let mouseY = 0;

  heroSection.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  // 当鼠标离开区域时，重置鼠标位置到画布外
  heroSection.addEventListener("mouseleave", () => {
    mouseX = -100;
    mouseY = -100;
  });

  // 连接点
  function connectPoints() {
    for (let i = 0; i < gridPoints.length; i++) {
      for (let j = i + 1; j < gridPoints.length; j++) {
        const dx = gridPoints[i].x - gridPoints[j].x;
        const dy = gridPoints[i].y - gridPoints[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 只连接一定距离内的点
        if (distance < 60) {
          // 距离越远，线条越透明
          const opacity = 1 - distance / 60;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(gridPoints[i].x, gridPoints[i].y);
          ctx.lineTo(gridPoints[j].x, gridPoints[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // 动画循环
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新并绘制所有点
    for (const point of gridPoints) {
      point.update(mouseX, mouseY);
      point.draw();
    }

    // 连接点
    connectPoints();

    requestAnimationFrame(animate);
  }

  animate();
});
