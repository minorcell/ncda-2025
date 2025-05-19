import * as THREE from '../../build/threejs/three.module.min.js';

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
        const starGeometry = new THREE.SphereGeometry(0.015, 5, 5);
        const starMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true
        });

        // 创建多个星星
        for (let i = 0; i < 100; i++) {
            const star = new THREE.Mesh(starGeometry, starMaterial.clone());

            // 随机位置
            star.position.x = (Math.random() - 0.5) * 10;
            star.position.y = (Math.random() - 0.5) * 5;
            star.position.z = (Math.random() - 0.5) * 5;

            // 为每个星星添加动画属性
            star.userData = {
                speed: Math.random() * 0.005 + 0.005,
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

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new PlanetStars();
});
