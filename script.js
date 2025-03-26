// 等待页面加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 初始化场景
    const app = new RocketLaunchApp();
    app.init();
    app.animate();

    // 发射按钮事件监听
    document.getElementById('launch-button').addEventListener('click', () => {
        app.startLaunchSequence();
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
        this.atmosphereHeight = 200; // 假设100km是大气层高度

        this.cameraMode = "normal"; // 默认相机模式
        this.eventTimeouts = {}; // 存储事件超时处理

        // 添加发射状态控制
        this.isLaunching = false;
        this.autoScrollTween = null;
        this.missionDuration = 60; // 减少总任务时间至60秒
    }

    init() {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.app = this; // 将app引用附加到scene

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

        // 添加全局错误处理
        window.addEventListener('error', (event) => {
            console.error('捕获到错误:', event.error.message);
            console.error('错误位置:', event.filename, '行:', event.lineno, '列:', event.colno);

            // 让页面继续运行而不崩溃
            event.preventDefault();
            return true;
        });
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
        for (let i = 0; i < 3000; i++) {
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
        this.earth.position.y = -510;
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
        const baseGeometry = new THREE.BoxGeometry(30, 1, 30);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.8, // 粗糙度
            metalness: 0.2 // 金属感
        });

        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0; // 将基座放置在y=0的位置（地面）
        base.receiveShadow = true;
        this.scene.add(base);

        // 创建发射支架
        const supportGeometry = new THREE.CylinderGeometry(0.3, 0.5, 10, 8);
        const supportMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0.6,
            metalness: 0.4
        });

        // 添加四个支架
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            const support = new THREE.Mesh(supportGeometry, supportMaterial);

            support.position.set(
                Math.cos(angle) * 3,
                5, // 从地面向上延伸
                Math.sin(angle) * 3
            );

            support.castShadow = true;
            this.scene.add(support);
        }
    }

    // 滚动处理函数
    handleScroll() {
        // 计算滚动进度 (0-1)
        const scrollHeight = document.body.scrollHeight - window.innerHeight;
        this.scrollProgress = window.scrollY / scrollHeight;

        // 更新进度条显示
        document.querySelector('.progress').style.width = `${this.scrollProgress * 100}%`;

        // 使用阶段管理器更新火箭状态
        this.stageManager.update(this.scrollProgress);

        // 更新相机位置
        this.updateCamera();

        // 根据发射进度更新任务时间
        this.updateMissionTime();

        // 在卫星阶段输出调试信息
        if (this.scrollProgress > 0.9) {
            const satellite = this.scene.satellite;
            if (satellite) {
                console.log("卫星存在，位置:", satellite.position.x, satellite.position.y, satellite.position.z);
            } else {
                console.warn("卫星应该出现但不存在");
            }
        }

    }

    // 更新相机位置
    updateCamera() {
        // 获取火箭当前位置
        const rocketPos = this.rocket.rocket.position.clone();

        // 安全检查
        if (!rocketPos || isNaN(rocketPos.y)) {
            console.warn("Invalid rocket position detected");
            rocketPos = new THREE.Vector3(0, 0, 0);
        }

        // 确保相机目标存在
        if (!this.cameraTarget) {
            this.cameraTarget = new THREE.Vector3(0, 25, 0);
        }

        // 准备目标位置和视点变量
        let targetCameraPos = new THREE.Vector3();
        let targetLookAt = new THREE.Vector3();
        let targetFOV = CAMERA_CONFIG.defaultFOV;
        let transitionDuration = CAMERA_CONFIG.defaultTransitionTime;

        // 处理特殊事件模式
        if (this.cameraMode !== "normal" && CAMERA_CONFIG.events[this.cameraMode]) {
            this.handleEventCamera(
                this.cameraMode,
                rocketPos,
                targetCameraPos,
                targetLookAt
            );
            return; // 早期返回，不执行常规相机逻辑
        }

        // 寻找当前进度对应的阶段
        const currentStage = this.getCurrentStage();

        if (currentStage) {
            // 计算在当前阶段内的进度 (0-1)
            const stageProgress = this.getProgressInStage(currentStage);

            // 应用当前阶段的相机设置
            this.applyStageCameraSettings(
                currentStage,
                stageProgress,
                rocketPos,
                targetCameraPos,
                targetLookAt
            );

            // 获取阶段相机配置
            targetFOV = currentStage.fov || CAMERA_CONFIG.defaultFOV;
            transitionDuration = currentStage.transitionTime || CAMERA_CONFIG.defaultTransitionTime;
        } else {
            // 如果没有找到匹配的阶段，使用默认相机位置
            console.warn("No matching camera stage found for progress:", this.scrollProgress);
            targetCameraPos.set(70, rocketPos.y + 30, 70);
            targetLookAt.set(0, rocketPos.y, 0);
        }

        // 应用相机位置和旋转的平滑过渡
        this.applyCameraTransition(
            targetCameraPos,
            targetLookAt,
            targetFOV,
            transitionDuration
        );
    }

    // 获取当前的相机阶段
    getCurrentStage() {
        for (const stage of CAMERA_CONFIG.stages) {
            if (this.scrollProgress >= stage.startProgress &&
                this.scrollProgress < stage.endProgress) {
                return stage;
            }
        }
        return null;
    }

    // 计算在当前阶段内的进度比例
    getProgressInStage(stage) {
        const totalStageLength = stage.endProgress - stage.startProgress;
        const progressInStage = (this.scrollProgress - stage.startProgress) / totalStageLength;
        return Math.max(0, Math.min(1, progressInStage)); // 限制在0-1之间
    }

    // 应用阶段相机设置
    applyStageCameraSettings(stage, stageProgress, rocketPos, targetCameraPos, targetLookAt) {
        // 获取阶段配置
        const posConfig = stage.position;
        const lookAtOffset = stage.lookAtOffset || { x: 0, y: 0, z: 0 };

        // 计算相机位置
        // 1. 基于角度和半径计算XZ平面位置
        const angle = posConfig.angle + (stage.id === "ascent" ? Date.now() * 0.0001 : 0);
        targetCameraPos.x = Math.cos(angle) * posConfig.radius;
        targetCameraPos.z = Math.sin(angle) * posConfig.radius;

        // 2. 计算Y位置 (高度)
        targetCameraPos.y = rocketPos.y + posConfig.height;

        // 3. 对特定阶段应用动态效果
        this.applyStageSpecificEffects(stage.id, stageProgress, rocketPos, targetCameraPos, targetLookAt);

        // 计算lookAt目标点
        targetLookAt.set(
            lookAtOffset.x,
            rocketPos.y + lookAtOffset.y,
            lookAtOffset.z
        );
    }

    // 为特定阶段应用动态效果
    applyStageSpecificEffects(stageId, progress, rocketPos, targetCameraPos, targetLookAt) {
        // 保护机制 - 确保参数都已定义
        if (!targetCameraPos) {
            console.error("targetCameraPos 未定义，使用默认值");
            targetCameraPos = new THREE.Vector3(0, 30, 30);
        }

        if (!targetLookAt) {
            console.error("targetLookAt 未定义，使用默认值");
            targetLookAt = new THREE.Vector3(0, 0, 0);
        }

        if (!rocketPos) {
            console.error("rocketPos 未定义，使用默认值");
            rocketPos = new THREE.Vector3(0, 0, 0);
        }

        // 获取当前事件的设置
        const eventSettings = CAMERA_CONFIG.events[stageId] || {
            position: { radius: 30, height: 30, angle: 0 },
            lookAt: { x: 0, y: 0, z: 0 },
            fov: 70
        };

        // 根据事件类型应用特殊效果
        switch (stageId) {
            case "launchPreparation":
                // 可能在发射前轻微环绕火箭
                targetCameraPos.x *= 1 + Math.sin(Date.now() * 0.0003) * 0.1;
                targetCameraPos.z *= 1 + Math.cos(Date.now() * 0.0003) * 0.1;
                break;

            case "ignitionAndLiftoff":
                // 随着火箭上升，相机也逐渐上升但保持相对距离
                targetCameraPos.y = rocketPos.y + 30 + progress * 20;
                break;

            case "ascent":
                // 上升阶段相机可以略微摇晃模拟震动
                const shakeAmount = 0.3 * (1 - progress); // 随着上升减弱震动
                targetCameraPos.x += (Math.random() - 0.5) * shakeAmount;
                targetCameraPos.y += (Math.random() - 0.5) * shakeAmount;
                targetCameraPos.z += (Math.random() - 0.5) * shakeAmount;
                break;

            case "fairingSeparation":
                // 整流罩分离阶段，相机在XZ平面上沿椭圆轨迹运动观察
                if (progress > 0.5) {
                    const ellipseProgress = (progress - 0.5) * 2; // 0-1
                    const ellipseAngle = Math.PI * 0.3 + ellipseProgress * Math.PI * 0.4;

                    targetCameraPos.x = Math.cos(ellipseAngle) * eventSettings.position.radius;
                    targetCameraPos.z = Math.sin(ellipseAngle) * (eventSettings.position.radius * 0.7);
                }
                break;

            case "satelliteDeployment":
                // 卫星部署阶段 - 确保卫星清晰可见
                const satellite = this.scene.satellite;

                if (!satellite && this.scrollProgress > 0.95) {
                    // 如果卫星不存在但应该存在，创建它
                    console.log("尝试创建卫星...");
                    this.createSatellite();
                }

                if (satellite) {
                    console.log("卫星存在，设置相机");
                    // 使用固定的观察位置，确保能看到卫星和地球
                    const angle = Date.now() * 0.0001; // 缓慢旋转
                    const radius = 360; // 相机距离

                    // 将相机放在卫星背后偏上的固定位置
                    targetCameraPos.set(
                        Math.cos(angle) * radius,
                        satellite.position.y + 500, // 高于卫星
                        Math.sin(angle) * radius
                    );

                    // 直接看向卫星
                    targetLookAt.copy(satellite.position);

                    // 调试输出
                    console.log("相机位置:", targetCameraPos.x, targetCameraPos.y, targetCameraPos.z);
                    console.log("卫星位置:", satellite.position.x, satellite.position.y, satellite.position.z);
                } else {
                    console.warn("卫星不存在，使用默认视角");
                    // 默认视角朝向地球上方正确的轨道位置
                    targetCameraPos.set(0, 100, 150);
                    targetLookAt.set(0, -10, 0);
                }

                // 设置更广的视场角
                gsap.to(this.camera, {
                    fov: 60, // 更宽的视角
                    duration: 1.0,
                    ease: "power1.out",
                    onUpdate: () => this.camera.updateProjectionMatrix()
                });
                break;
        }
    }

    // 处理特殊事件相机
    handleEventCamera(eventName, rocketPos, targetCameraPos, targetLookAt) {
        const eventConfig = CAMERA_CONFIG.events[eventName];
        if (!eventConfig) return;

        const posConfig = eventConfig.position;
        const lookAtOffset = eventConfig.lookAtOffset || { x: 0, y: 0, z: 0 };

        // 特殊事件通常有动态角度
        let angle = posConfig.angle;

        // 根据事件类型应用特殊效果
        switch (eventName) {
            case "fairingSeparation":
                // 轻微调整角度观察整流罩
                angle = Math.PI * 0.35 + Math.sin(Date.now() * 0.0005) * 0.1;
                break;

            case "secondStageSeparation":
                // 环绕观察二级分离
                angle = Date.now() * 0.0007;
                break;

            case "satelliteDeployment":
                // 卫星部署事件 - 调整为同时观察卫星和地球
                const satellite = this.scene.satellite;
                if (satellite) {
                    // 相机绕卫星旋转，但视角更宽
                    const time = Date.now() * 0.0001; // 较慢的旋转
                    const radius = 250; // 更远的距离

                    // 如果卫星已经在轨道上运行
                    const orbit = satellite.userData.orbit;
                    if (orbit && orbit.angle > 0.1) { // 已开始轨道运动
                        // 相机跟随卫星轨道，但取一个能看到地球的角度
                        const cameraAngle = orbit.angle - Math.PI * 0.4; // 调整角度偏移

                        // 设置相机位置
                        targetCameraPos.x = Math.cos(cameraAngle) * radius * 1.8;
                        targetCameraPos.z = Math.sin(cameraAngle) * radius * 1.8;
                        targetCameraPos.y = satellite.position.y + 500; // 高于卫星，能看到地球

                        // 看向卫星和地球之间
                        targetLookAt.set(
                            satellite.position.x * 0.4,
                            satellite.position.y - 180, // 向地球方向偏移
                            satellite.position.z * 0.4
                        );

                        // 额外调试输出
                        console.log("事件相机 - 卫星位置:", satellite.position.x, satellite.position.y, satellite.position.z);
                        console.log("事件相机 - 相机位置:", targetCameraPos.x, targetCameraPos.y, targetCameraPos.z);
                    } else {
                        // 部署初期，使用更广视角
                        targetCameraPos.set(
                            Math.cos(time) * radius * 1.5,
                            satellite.position.y + 100, // 高于卫星
                            Math.sin(time) * radius * 1.5
                        );

                        // 看向卫星稍下方，能看到地球
                        targetLookAt.set(
                            0,
                            satellite.position.y - 200, // 朝地球方向
                            0
                        );
                    }
                } else {
                    // 卫星不存在时的默认位置
                    const angle = Date.now() * 0.0003;
                    targetCameraPos.set(
                        Math.cos(angle) * eventConfig.position.radius * 1.5,
                        rocketPos.y + 100, // 更高位置看到地球
                        Math.sin(angle) * eventConfig.position.radius * 1.5
                    );
                    targetLookAt.set(0, rocketPos.y - 200, 0); // 向下看以看到地球
                }

                // 设置较广的FOV以便远距离观察
                gsap.to(this.camera, {
                    fov: 45, // 更广的FOV
                    duration: 2.0,
                    ease: "power1.out",
                    onUpdate: () => {
                        this.camera.updateProjectionMatrix();
                    }
                });
                break;
        }

        // 计算相机位置
        targetCameraPos.x = Math.cos(angle) * posConfig.radius;
        targetCameraPos.z = Math.sin(angle) * posConfig.radius;
        targetCameraPos.y = rocketPos.y + posConfig.height;

        // 计算lookAt目标点
        targetLookAt.set(
            lookAtOffset.x,
            rocketPos.y + lookAtOffset.y,
            lookAtOffset.z
        );

        // 应用过渡
        this.applyCameraTransition(
            targetCameraPos,
            targetLookAt,
            eventConfig.fov || CAMERA_CONFIG.defaultFOV,
            eventConfig.transitionTime || CAMERA_CONFIG.defaultTransitionTime
        );
    }

    // 应用相机过渡动画
    applyCameraTransition(targetPosition, targetLookAt, targetFOV, duration) {
        // 位置过渡
        gsap.to(this.camera.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: duration,
            ease: "power2.out"
        });

        // LookAt目标过渡
        gsap.to(this.cameraTarget, {
            x: targetLookAt.x,
            y: targetLookAt.y,
            z: targetLookAt.z,
            duration: duration * 0.9, // 视点略快于位置
            ease: "power1.out",
            onUpdate: () => {
                this.camera.lookAt(this.cameraTarget);
            }
        });

        // FOV过渡
        gsap.to(this.camera, {
            fov: targetFOV,
            duration: duration * 1.2, // FOV变化略慢
            ease: "power1.inOut",
            onUpdate: () => {
                this.camera.updateProjectionMatrix();
            }
        });
    }

    // 触发相机事件 - 简化版本
    triggerCameraEvent(eventName, duration) {
        const eventConfig = CAMERA_CONFIG.events[eventName];
        if (!eventConfig) return;

        // 清除之前的定时器
        if (this.eventTimeouts[eventName]) {
            clearTimeout(this.eventTimeouts[eventName]);
        }

        // 设置相机模式
        this.cameraMode = eventName;

        // 使用配置或传入的持续时间
        const eventDuration = duration || eventConfig.duration || 5;

        // 在指定时间后恢复正常模式
        this.eventTimeouts[eventName] = setTimeout(() => {
            if (this.cameraMode === eventName) {
                this.cameraMode = "normal";
            }
        }, eventDuration * 1000);
    }

    // 供StageManager调用的方法
    setCameraEvent(eventName, duration) {
        this.triggerCameraEvent(eventName, duration);
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
            this.stars.rotation.y += 0.0005;
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

        // 每帧检查和管理火焰效果
        this.manageRocketFlames();

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


    // 添加开始发射序列方法
    startLaunchSequence() {
        if (this.isLaunching) return; // 防止重复点击
        this.isLaunching = true;

        // 获取发射控制面板和按钮
        const launchControl = document.querySelector('.launch-control');
        const launchButton = document.getElementById('launch-button');
        const countdown = document.getElementById('countdown');

        // 禁用按钮
        launchButton.disabled = true;
        launchControl.classList.add('launching');

        // 播放缩短的倒计时: 3-2-1
        let countdownTime = 3; // 从3开始
        countdown.textContent = countdownTime;

        const countdownInterval = setInterval(() => {
            countdownTime--;
            countdown.textContent = countdownTime;



            if (countdownTime <= 0) {
                clearInterval(countdownInterval);
                this.startAutoScroll();

                // 隐藏发射控制
                setTimeout(() => {
                    launchControl.classList.add('hidden');
                }, 1000);

                // 隐藏指引
                document.querySelector('.instructions').classList.add('hide');
            }
        }, 1000);

        // 为一级火箭创建火焰时添加名称
        const firstStageFlame = this.particleSystem.createEngineFlame(
            this.rocket.getFirstStageBottomPosition(),
            3,
            0xff6600
        );
        firstStageFlame.name = 'firstStageFlame';

        // 为二级火箭创建火焰时添加名称
        const secondStageFlame = this.particleSystem.createEngineFlame(
            this.rocket.getSecondStageBottomPosition(),
            2,
            0xff5500
        );
        secondStageFlame.name = 'secondStageFlame';
    }

    // 开始自动滚动
    startAutoScroll() {
        // 计算页面总滚动高度
        const scrollHeight = document.body.scrollHeight - window.innerHeight;

        // 使用GSAP创建自动滚动动画 - 更改缓动函数提高加速度
        this.autoScrollTween = gsap.to(window, {
            scrollY: scrollHeight,
            duration: this.missionDuration,
            ease: "power2.out", // 改为 power2.out 提供更快的初始加速
            onUpdate: () => {
                // 每次更新滚动位置时更新火箭状态
                this.handleScroll();
            },
            onComplete: () => {
                console.log("Mission complete!");
                this.isLaunching = false;
            }
        });

    }


    // 更新任务时间显示
    updateMissionTime() {
        const missionTimeElement = document.getElementById('mission-time');

        if (this.scrollProgress < 0.1) {
            // 发射前显示 T-倒计时
            missionTimeElement.textContent = "T-00:00";
        } else {
            // 发射后显示 T+任务时间
            const elapsedSeconds = Math.floor(this.scrollProgress * this.missionDuration);
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = elapsedSeconds % 60;
            missionTimeElement.textContent = `T+${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    resumeAutoScroll() {
        if (this.autoScrollTween) {
            this.autoScrollTween.play();
        }
    }

    updateSatelliteOrbit() {
        const satellite = this.scene.satellite;
        if (!satellite) return;

        // 检查轨道数据
        if (!satellite.userData.orbit) {
            // 初始化轨道数据
            satellite.userData.orbit = {
                radius: 520,
                angle: 0,
                speed: 0.001,
                inclination: Math.PI * 0.1
            };
        }

        const orbit = satellite.userData.orbit;

        // 更新角度
        orbit.angle += orbit.speed;

        // 计算新位置
        const x = Math.cos(orbit.angle) * orbit.radius;
        const z = Math.sin(orbit.angle) * orbit.radius * Math.cos(orbit.inclination);
        const y = Math.sin(orbit.angle) * orbit.radius * Math.sin(orbit.inclination) + orbit.radius;


        // 让卫星轻微自转，增加可见性
        satellite.rotation.z += 0.05;
    }

    // 添加更新太阳能电池板的方法
    updateSolarPanels(satellite) {
        satellite.children.forEach(child => {
            if (child.name === "solarPanel" || child.name === "leftPanel" || child.name === "rightPanel") {
                const sunDirection = new THREE.Vector3(
                    Math.cos(Date.now() * 0.0001),
                    0.5,
                    Math.sin(Date.now() * 0.0001)
                ).normalize();

                const localSunDir = satellite.worldToLocal(
                    sunDirection.clone().add(satellite.position)
                );

                // 直接设置旋转，不使用GSAP
                child.rotation.x = Math.sign(localSunDir.x) * Math.min(Math.abs(localSunDir.x * 0.5), Math.PI / 4);
                child.rotation.y = Math.sign(localSunDir.y) * Math.min(Math.abs(localSunDir.y * 0.5), Math.PI / 4);
                child.rotation.z = Math.sign(localSunDir.z) * Math.min(Math.abs(localSunDir.z * 0.5), Math.PI / 4);
            }
        });
    }

    // 更新 manageRocketFlames 方法，确保它能正确处理火焰对象
    manageRocketFlames() {
        // 如果火箭不存在或粒子系统不存在，直接返回
        if (!this.rocket || !this.particleSystem) {
            return;
        }

        // 根据滚动进度管理火焰效果
        const currentScrollProgress = this.scrollProgress;

        try {
            // 火箭各部分的分离进度点
            const FIRST_STAGE_SEPARATION = 0.35;
            const SECOND_STAGE_SEPARATION = 0.75;

            // 一级分离阶段 - 确保一级火焰消失
            if (currentScrollProgress >= FIRST_STAGE_SEPARATION &&
                !this.rocket.firstStageFlameRemoved) {

                console.log("触发一级火焰停止点");

                // 找到并直接移除场景中的一级火焰对象
                this.scene.children.forEach(child => {
                    if (child.name === 'firstStageFlame' || child.name === 'mainEngineFlame') {
                        console.log("找到一级火焰，正在移除");
                        this.scene.remove(child);
                    }
                });

                // 同时尝试通过粒子系统移除
                if (this.particleSystem && this.particleSystem.deactivateFlame) {
                    this.particleSystem.deactivateFlame('firstStage');
                }

                // 标记已移除，防止重复操作
                this.rocket.firstStageFlameRemoved = true;
            }

            // 二级分离阶段 - 确保二级火焰消失
            if (currentScrollProgress >= SECOND_STAGE_SEPARATION &&
                !this.rocket.secondStageFlameRemoved) {

                console.log("触发二级火焰停止点");

                // 找到并直接移除场景中的二级火焰对象
                this.scene.children.forEach(child => {
                    if (child.name === 'secondStageFlame') {
                        console.log("找到二级火焰，正在移除");
                        this.scene.remove(child);
                    }
                });

                // 同时尝试通过粒子系统移除
                if (this.particleSystem && this.particleSystem.deactivateFlame) {
                    this.particleSystem.deactivateFlame('secondStage');
                }

                // 标记已移除，防止重复操作
                this.rocket.secondStageFlameRemoved = true;
            }
        } catch (error) {
            console.error("火焰管理出错:", error);
        }
    }

    // 在 RocketLaunchApp 类中添加专门的卫星创建方法
    createSatellite() {
        console.log("创建新卫星...");

        // 删除旧卫星（如果存在）
        if (this.scene.satellite) {
            console.log("移除旧卫星");
            this.scene.remove(this.scene.satellite);
            this.scene.satellite = null;
        }

        // 创建一个更明显的卫星模型
        const satelliteGeometry = new THREE.BoxGeometry(10, 6, 6); // 更大的尺寸
        const satelliteMaterial = new THREE.MeshStandardMaterial({
            color: 0x00aaff,
            emissive: 0x0055aa,
            emissiveIntensity: 0.8, // 增加发光强度
            metalness: 0.8,
            roughness: 0.2
        });

        const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
        satellite.name = "satellite";

        // 添加发光外壳提高可见性
        const glowGeometry = new THREE.SphereGeometry(12, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        satellite.add(glow);

        // 添加闪烁的光源
        const satelliteLight = new THREE.PointLight(0x00ffff, 1, 100);
        satelliteLight.position.set(0, 0, 0);
        satellite.add(satelliteLight);

        // 创建更明显的太阳能电池板
        const panelGeometry = new THREE.BoxGeometry(25, 1, 8);
        const panelMaterial = new THREE.MeshStandardMaterial({
            color: 0x2277ff,
            emissive: 0x1144aa,
            emissiveIntensity: 0.5,
            metalness: 0.9
        });

        const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
        leftPanel.position.set(-18, 0, 0);
        leftPanel.name = "leftPanel";
        satellite.add(leftPanel);

        const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
        rightPanel.position.set(18, 0, 0);
        rightPanel.name = "rightPanel";
        satellite.add(rightPanel);

        // 设置初始位置
        const orbitRadius = 520;

        // 在地球上方显眼的位置
        satellite.position.set(
            0,               // 正前方
            orbitRadius, // 地球上方
            0
        );

        // 添加到场景并保存引用
        this.scene.add(satellite);
        this.scene.satellite = satellite;

        console.log("卫星已创建在位置:", satellite.position.x, satellite.position.y, satellite.position.z);

        return satellite;
    }
}

// 相机配置常量
const CAMERA_CONFIG = {
    // 默认FOV和过渡时间
    defaultFOV: 60,
    defaultTransitionTime: 1.8,

    // 阶段配置 - 按照火箭发射流程定义
    stages: [
        {
            // 地面准备阶段 (0.0-0.1)
            id: "launchPreparation",
            startProgress: 0.0,
            endProgress: 0.1,
            position: {
                radius: 70,    // 距离火箭的半径
                height: 50,    // 相对火箭底部的高度
                angle: Math.PI * 0.25  // 观察角度 (45度)
            },
            lookAtOffset: { x: 0, y: 20, z: 0 },  // 看向火箭中间偏上
            fov: 65,
            transitionTime: 2.0
        },
        {
            // 点火和初始升空 (0.1-0.2)
            id: "ignitionAndLiftoff",
            startProgress: 0.1,
            endProgress: 0.2,
            position: {
                radius: 80,
                height: 30,    // 高度相对火箭底部，会加上火箭当前高度
                angle: Math.PI * 0.125  // 22.5度，适合看发射
            },
            lookAtOffset: { x: 0, y: 0, z: 0 },  // 看向火箭中心
            fov: 70,  // 略微广角增强速度感
            transitionTime: 1.5
        },
        {
            // 上升阶段 (0.2-0.35)
            id: "ascent",
            startProgress: 0.2,
            endProgress: 0.35,
            position: {
                radius: 90,
                height: -30,   // 低位视角看上升
                angle: Math.PI * 0.05   // 接近后方视角
            },
            lookAtOffset: { x: 0, y: 25, z: 0 },  // 看向火箭上方
            fov: 65,
            transitionTime: 2.0
        },
        {
            // 一级分离 (0.35-0.55)
            id: "firstStageSeparation",
            startProgress: 0.35,
            endProgress: 0.55,
            position: {
                radius: 110,
                height: 10,
                angle: Math.PI * 0.75   // 侧面视角
            },
            lookAtOffset: { x: 0, y: 0, z: 0 },
            fov: 60,
            transitionTime: 2.5
        },
        {
            // 高空飞行和整流罩分离 (0.55-0.75)
            id: "fairingSeparation",
            startProgress: 0.55,
            endProgress: 0.75,
            position: {
                radius: 100,
                height: 40,
                angle: Math.PI * 0.3    // 侧前方视角，适合观察整流罩
            },
            lookAtOffset: { x: 0, y: 10, z: 0 },  // 看向整流罩位置
            fov: 55,
            transitionTime: 2.2
        },
        {
            // 二级分离 (0.75-0.9)
            id: "secondStageSeparation",
            startProgress: 0.75,
            endProgress: 0.9,
            position: {
                radius: 120,
                height: 20,
                angle: Math.PI * 0.6    // 侧后方视角
            },
            lookAtOffset: { x: 0, y: 0, z: 0 },
            fov: 50,
            transitionTime: 2.5
        },
        {
            // 卫星部署和轨道阶段 (0.9-1.0)
            id: "satelliteDeployment",
            startProgress: 0.9,
            endProgress: 1.0,
            position: {
                radius: 180, // 增加半径
                height: 100, // 增加高度
                angle: 0
            },
            lookAtOffset: {
                x: 0,
                y: -150, // 向下看以看到地球
                z: 0
            },
            fov: 50, // 更广的视角
            transitionTime: 2.0
        }
    ],

    // 特殊事件配置
    events: {
        "fairingSeparation": {
            position: {
                radius: 70,
                height: 25,
                angle: Math.PI * 0.35   // 侧前方观察整流罩打开
            },
            lookAtOffset: { x: 0, y: 10, z: 0 },
            fov: 45,
            transitionTime: 1.2,
            duration: 7.0      // 事件持续时间
        },
        "secondStageSeparation": {
            position: {
                radius: 80,
                height: 0,
                angle: 0       // 角度会被动态更新
            },
            lookAtOffset: { x: 0, y: 0, z: 0 },
            fov: 50,
            transitionTime: 1.0,
            duration: 7.0
        },
        "satelliteDeployment": {
            position: {
                radius: 200,
                height: 100,
                angle: 0
            },
            lookAtOffset: {
                x: 0,
                y: -150,
                z: 0
            },
            fov: 50,
            transitionTime: 2.0,
            duration: 5.0
        },
        "rocketLaunch": {
            position: {
                radius: 60,
                height: 15,
                angle: Math.PI * 0.2   // 侧前方观察发射
            },
            lookAtOffset: { x: 0, y: 5, z: 0 },
            fov: 60,
            transitionTime: 1.0,
            duration: 8.0
        }
    }
}; 