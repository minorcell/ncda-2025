// 等待页面加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 初始化场景
    const app = new RocketLaunchApp();
    app.init();
    app.animate();

    // 滚动事件处理
    window.addEventListener('scroll', () => {
        // 隐藏初始指引
        if (window.scrollY > 50) {
            document.querySelector('.instructions').classList.add('hide');
        } else {
            document.querySelector('.instructions').classList.remove('hide');
        }

        app.handleScroll();
    });

    // 窗口调整大小事件
    window.addEventListener('resize', () => {
        app.onWindowResize();
    });
});

// 主应用类
class RocketLaunchApp {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.rocket = null;
        this.particleSystem = null;
        this.stageManager = null;
        this.stars = null;
        this.earth = null;

        // 环境状态
        this.scrollProgress = 0;
        this.atmosphereHeight = 100; // 假设100km是大气层高度
    }

    init() {
        // 创建场景
        this.scene = new THREE.Scene();

        // 创建相机
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.set(50, 50, 15); // 调整初始相机位置，确保能看到火箭

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('rocket-canvas'),
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;

        // 添加光源
        this.setupLights();

        // 添加星空背景
        this.createStars();

        // 创建地球
        this.createEarth();

        // 添加发射台
        this.createLaunchPad();

        // 创建粒子系统
        this.particleSystem = new ParticleSystem(this.scene);

        // 创建火箭模型
        this.rocket = new RocketModel(this.scene);

        // 创建阶段管理器
        this.stageManager = new StageManager(this.scene, this.rocket, this.particleSystem);

        // 设置初始相机视角 - 直接看向火箭
        this.camera.lookAt(50, 50, 15);


    }

    setupLights() {
        // 主要定向光源（模拟太阳光）- 增加亮度
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.5); // 增加强度
        sunLight.position.set(500, 500, -1000);
        sunLight.castShadow = true;
        this.scene.add(sunLight);

        // 环境光 - 显著增加亮度
        const ambientLight = new THREE.AmbientLight(0x404040, 1.2); // 增加强度
        this.scene.add(ambientLight);

        // 地面发射台的聚光灯 - 增强亮度
        const spotLight = new THREE.SpotLight(0xffffcc, 2.0); // 增加强度
        spotLight.position.set(10, 20, 10);
        spotLight.castShadow = true;
        spotLight.angle = Math.PI / 4;
        spotLight.penumbra = 0.1;
        this.scene.add(spotLight);

        // 添加额外的火箭照明灯
        const rocketLight = new THREE.PointLight(0xffffff, 1.5, 50);
        rocketLight.position.set(0, 10, 20);
        this.scene.add(rocketLight);

        // 将这个点光源存储起来，以便在动画中跟随火箭
        this.rocketLight = rocketLight;
    }

    createStars() {
        // 创建星空背景
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.7,
            transparent: true,
            opacity: 0.8
        });

        const starsVertices = [];
        for (let i = 0; i < 2000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starsVertices.push(x, y, z);
        }

        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        this.stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(this.stars);
    }

    createEarth() {
        // 创建简单的地球模型
        const earthGeometry = new THREE.SphereGeometry(500, 64, 64);
        const earthMaterial = new THREE.MeshPhongMaterial({
            color: 0x2244aa,
            emissive: 0x112244,
            roughness: 1,
            metalness: 0,
        });

        this.earth = new THREE.Mesh(earthGeometry, earthMaterial);
        this.earth.position.y = -510; // 地球半径 + 一些距离
        this.scene.add(this.earth);

        // 添加云层
        const cloudGeometry = new THREE.SphereGeometry(502, 64, 64);
        const cloudMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            roughness: 1,
            metalness: 0
        });

        const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        this.earth.add(clouds);

        // 添加大气层光晕
        const atmosphereGeometry = new THREE.SphereGeometry(510, 64, 32);
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x8888ff,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });

        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.earth.add(atmosphere);
    }

    createLaunchPad() {
        // 创建发射台基座
        const baseGeometry = new THREE.BoxGeometry(20, 1, 20);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            roughness: 0.8,
            metalness: 0.2
        });

        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.5;
        base.receiveShadow = true;
        this.scene.add(base);

        // 创建发射支架
        const supportGeometry = new THREE.CylinderGeometry(0.3, 0.5, 10, 8);
        const supportMaterial = new THREE.MeshStandardMaterial({
            color: 0x777777,
            roughness: 0.6,
            metalness: 0.4
        });

        // 添加四个支架
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const support = new THREE.Mesh(supportGeometry, supportMaterial);

            support.position.set(
                Math.cos(angle) * 3,
                5,
                Math.sin(angle) * 3
            );

            support.castShadow = true;
            this.scene.add(support);
        }

        // 添加横向支撑
        const crossSupportGeometry = new THREE.BoxGeometry(8, 0.5, 0.5);

        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
            const crossSupport = new THREE.Mesh(crossSupportGeometry, supportMaterial);

            crossSupport.position.set(0, 7, 0);
            crossSupport.rotation.y = angle;
            crossSupport.castShadow = true;

            this.scene.add(crossSupport);
        }
    }

    // 滚动处理函数
    handleScroll() {
        // 计算滚动进度 (0-1)
        const scrollHeight = document.body.scrollHeight - window.innerHeight;
        this.scrollProgress = window.scrollY / scrollHeight;

        // 使用阶段管理器更新火箭状态
        this.stageManager.update(this.scrollProgress);

        // 更新相机位置
        this.updateCamera();
    }

    // 更新相机位置
    updateCamera() {
        // 根据滚动进度调整相机位置，始终保持火箭在视野中
        const rocketPos = this.rocket.rocket.position.clone();

        if (this.scrollProgress < 0.1) {
            gsap.to(this.camera.position, {
                x: 20,
                y: 20,
                z: 15,
                duration: 1
            });

            this.camera.lookAt(new THREE.Vector3(0, 5, 0));
        } else if (this.scrollProgress < 0.3) {
            gsap.to(this.camera.position, {
                x: 20,
                y: 20,
                z: 15,
                duration: 1
            });

            this.camera.lookAt(new THREE.Vector3(0, rocketPos.y, 0));
        } else if (this.scrollProgress < 0.6) {
            gsap.to(this.camera.position, {
                x: 20,
                y: rocketPos.y + 20,
                z: 10,
                duration: 1
            });

            this.camera.lookAt(new THREE.Vector3(0, rocketPos.y, 0));
        } else {
            gsap.to(this.camera.position, {
                x: 20 + Math.sin(this.scrollProgress * Math.PI * 2) * 10,
                y: rocketPos.y,
                z: 20 + Math.cos(this.scrollProgress * Math.PI * 2) * 10,
                duration: 0.5
            });

            this.camera.lookAt(new THREE.Vector3(0, rocketPos.y, 0));
        }
    }

    // 窗口调整大小事件处理函数
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // 动画循环
    animate() {
        requestAnimationFrame(() => this.animate());

        // 更新粒子系统
        this.particleSystem.update();

        // 更新地球旋转
        if (this.earth) {
            this.earth.rotation.y += 0.0005;
        }

        // 更新星空旋转（随滚动进度）
        if (this.stars) {
            this.stars.rotation.y += 0.0001;
            this.stars.rotation.z = this.scrollProgress * 0.2;
        }

        // 让点光源跟随火箭
        if (this.rocketLight && this.rocket) {
            this.rocketLight.position.copy(this.rocket.rocket.position);
            this.rocketLight.position.y += 10;
            this.rocketLight.position.z = 20;
        }

        // 渲染场景
        this.renderer.render(this.scene, this.camera);

        // 检查错误并输出到控制台
        const gl = this.renderer.getContext();
        const error = gl.getError();
        if (error !== gl.NO_ERROR) {
            console.error('WebGL错误:', error);
        }
    }
} 