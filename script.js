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
        this.camera.position.set(30, 35, 30); // 设置为第一阶段的初始位置

        // 初始化相机目标点
        this.cameraTarget = new THREE.Vector3(0, 25, 0);
        this.camera.lookAt(this.cameraTarget);

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

        this.createCameraTrail();
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
        this.earth.position.y = -510; // 地球半径 + 一些距离，确保地面正好是地球的"顶部"
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
        base.position.y = 0; // 将基座放置在y=0的位置（地面）
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
                5, // 从地面向上延伸
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

            crossSupport.position.set(0, 7, 0); // 支架顶部
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
        // 获取火箭当前位置
        const rocketPos = this.rocket.rocket.position.clone();

        // 根据当前阶段计算理想的相机位置
        let targetCameraPos = new THREE.Vector3();
        let targetLookAt = new THREE.Vector3();
        let transitionDuration = 1.5; // 默认过渡时间

        // 距离系数 - 增加此值以拉远相机
        const distanceMultiplier = 1.8; // 原来基础上增加80%的距离

        if (this.scrollProgress < 0.1) {
            // 阶段1: 发射前准备 - 从侧面45度角观察火箭，更远的距离
            targetCameraPos.set(50, 45, 50); // 增加了距离
            targetLookAt.set(0, 25, 0); // 看向火箭底部
            transitionDuration = 2.0; // 初始阶段过渡更慢一些
        }
        else if (this.scrollProgress < 0.2) {
            // 阶段2: 点火和初始升空 - 拉远距离
            const progress = (this.scrollProgress - 0.1) / 0.1; // 0-1
            // 相机从侧面逐渐移动到后方位置，但距离更远
            targetCameraPos.set(
                (30 * (1 - progress) + 5 * progress) * distanceMultiplier,
                rocketPos.y - 10 + progress * 30, // 增加高度
                (30 * (1 - progress) + 40 * progress) * distanceMultiplier
            );
            targetLookAt.set(0, rocketPos.y, 0);
            transitionDuration = 1.2;
        }
        else if (this.scrollProgress < 0.35) {
            // 阶段3: 上升阶段 - 从更远的后方跟随火箭
            targetCameraPos.set(
                5 * distanceMultiplier, // 更远的距离
                rocketPos.y - 25, // 更低的视角
                65 // 更远的后方
            );
            targetLookAt.set(0, rocketPos.y + 20, 0); // 略微向上看

            // 添加微小的摇晃效果模拟震动
            const shakeAmount = 0.3;
            targetCameraPos.x += (Math.random() - 0.5) * shakeAmount;
            targetCameraPos.y += (Math.random() - 0.5) * shakeAmount;
            targetCameraPos.z += (Math.random() - 0.5) * shakeAmount;
        }
        else if (this.scrollProgress < 0.55) {
            // 阶段4: 一级分离 - 从侧面远距离观察
            const progress = (this.scrollProgress - 0.35) / 0.2; // 0-1

            // 平滑过渡到侧面视角，更远的距离
            targetCameraPos.set(
                (5 + progress * 55) * distanceMultiplier, // 向右侧移动更远
                rocketPos.y,       // 与火箭同高度
                (45 - progress * 25) * distanceMultiplier  // 向火箭靠近，但总体更远
            );
            targetLookAt.set(0, rocketPos.y, 0);
        }
        else if (this.scrollProgress < 0.75) {
            // 阶段5: 高空飞行和整流罩分离 - 从远距离上方斜角观察
            const phase = Math.sin(Date.now() * 0.0005) * 0.3; // 缓慢环绕效果
            const radius = 45 * distanceMultiplier; // 增加环绕半径
            targetCameraPos.set(
                radius * Math.cos(this.scrollProgress * 3 + phase),
                rocketPos.y + 25, // 更高的视角
                radius * Math.sin(this.scrollProgress * 3 + phase)
            );
            targetLookAt.set(0, rocketPos.y, 0);
        }
        else if (this.scrollProgress < 0.9) {
            // 阶段6: 太空中和二级分离 - 更广阔的视角，更远的轨道
            // 相机轨道运动，绕火箭旋转
            const angle = this.scrollProgress * Math.PI * 4;
            const radius = 60 * distanceMultiplier; // 显著增加轨道半径
            targetCameraPos.set(
                Math.cos(angle) * radius,
                rocketPos.y,
                Math.sin(angle) * radius
            );
            targetLookAt.set(0, rocketPos.y, 0);
        }
        else {
            // 阶段7: 进入轨道和卫星部署 - 超远景
            const angle = this.scrollProgress * Math.PI;
            const finalRadius = 100 * distanceMultiplier; // 非常远的最终视角
            targetCameraPos.set(
                Math.cos(angle) * finalRadius,
                rocketPos.y + 30, // 更高的视角
                Math.sin(angle) * finalRadius
            );
            targetLookAt.set(0, rocketPos.y, 0);
            transitionDuration = 3.0; // 最终阶段慢速过渡
        }

        // 平滑过渡到目标位置
        gsap.to(this.camera.position, {
            x: targetCameraPos.x,
            y: targetCameraPos.y,
            z: targetCameraPos.z,
            duration: transitionDuration,
            ease: "power2.out"
        });

        // 更新辅助对象的目标位置
        gsap.to(this.cameraTarget, {
            x: targetLookAt.x,
            y: targetLookAt.y,
            z: targetLookAt.z,
            duration: transitionDuration * 0.8, // 略快于位置变化
            ease: "power1.out",
            onUpdate: () => {
                this.camera.lookAt(this.cameraTarget);
            }
        });

        // 根据火箭速度动态调整视野 (FOV) - 减小FOV以获得远景望远镜效果
        let targetFOV = 60; // 默认FOV降低到60

        if (this.scrollProgress > 0.1 && this.scrollProgress < 0.3) {
            // 发射阶段增加FOV以体现加速感，但整体比原来低
            targetFOV = 60 + (this.scrollProgress - 0.1) * 10 / 0.2;
        } else if (this.scrollProgress > 0.7) {
            // 太空阶段降低FOV以体现广阔太空感
            targetFOV = 60 - (this.scrollProgress - 0.7) * 20 / 0.3;
        }

        // 平滑过渡FOV变化
        gsap.to(this.camera, {
            fov: targetFOV,
            duration: 2.0,
            ease: "power1.inOut",
            onUpdate: () => {
                this.camera.updateProjectionMatrix();
            }
        });
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

        // 添加相机微小晃动（仅在火箭发射阶段）
        if (this.scrollProgress > 0.1 && this.scrollProgress < 0.4) {
            // 根据火箭加速度计算晃动强度
            const acceleration = Math.min((this.scrollProgress - 0.1) * 5, 1);
            const shakeIntensity = 0.05 * acceleration;

            // 临时位置偏移
            const shakeX = (Math.random() - 0.5) * shakeIntensity;
            const shakeY = (Math.random() - 0.5) * shakeIntensity;

            // 应用到相机位置
            this.camera.position.x += shakeX;
            this.camera.position.y += shakeY;

            // 应用到相机目标点（轻微偏移）
            if (this.cameraTarget) {
                this.cameraTarget.x += shakeX * 0.5;
                this.cameraTarget.y += shakeY * 0.5;
                this.camera.lookAt(this.cameraTarget);
            }
        }

        // 更新相机轨迹
        if (this.scrollProgress > 0.1 && this.cameraTrailPoints) {
            // 移动所有点
            for (let i = this.cameraTrailPoints.length - 1; i > 0; i--) {
                this.cameraTrailPoints[i].copy(this.cameraTrailPoints[i - 1]);
            }

            // 添加当前相机位置作为新点
            this.cameraTrailPoints[0].copy(this.camera.position);

            // 更新几何体
            this.cameraTrail.geometry.setFromPoints(this.cameraTrailPoints);
            this.cameraTrail.geometry.attributes.position.needsUpdate = true;

            // 设置轨迹显示/隐藏
            this.cameraTrail.visible = (this.scrollProgress > 0.15 && this.scrollProgress < 0.9);
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

    createCameraTrail() {
        // 创建相机轨迹线
        const trailGeometry = new THREE.BufferGeometry();
        const trailMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.3
        });

        // 初始化轨迹点
        this.cameraTrailPoints = [];
        for (let i = 0; i < 50; i++) {
            this.cameraTrailPoints.push(new THREE.Vector3(0, 0, 0));
        }

        trailGeometry.setFromPoints(this.cameraTrailPoints);
        this.cameraTrail = new THREE.Line(trailGeometry, trailMaterial);
        this.scene.add(this.cameraTrail);
    }
} 