class RocketModel {
    constructor(scene) {
        this.scene = scene;
        this.rocket = new THREE.Group();
        this.firstStage = null;
        this.secondStage = null;
        this.thirdStage = null;
        this.payload = null;
        this.fairings = [];

        this.createRocket();
        this.scene.add(this.rocket);

        // 添加整体轮廓效果
        this.addOutlineGlow();
    }

    createRocket() {
        // 创建火箭的分段结构
        this.createFirstStage();
        this.createSecondStage();
        this.createThirdStage();
        this.createPayload();
        this.createFairings();

        // 设置初始位置 - 将火箭放置在地面上方
        this.rocket.position.set(0, 25, 0); // 改为25，使火箭底部正好在地面上
        // 火箭已经是竖直的，不需要旋转
    }

    createFirstStage() {
        // 一级火箭主体 - 使用发光材质
        const geometry = new THREE.CylinderGeometry(2, 2.5, 20, 24);
        const material = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 0.7,
            roughness: 0.3,
            emissive: 0x555555, // 添加自发光颜色
            emissiveIntensity: 0.3 // 发光强度
        });

        this.firstStage = new THREE.Mesh(geometry, material);
        this.firstStage.position.y = -15; // 放在底部

        // 添加底部引擎
        const engineGroup = new THREE.Group();
        engineGroup.position.y = -10;

        // 创建9个引擎（类似猎鹰9号）
        const engineRadius = 0.5;
        for (let i = 0; i < 9; i++) {
            const angle = (i / 9) * Math.PI * 2;
            const engineGeometry = new THREE.CylinderGeometry(engineRadius, engineRadius, 1.5, 12);
            const engineMaterial = new THREE.MeshStandardMaterial({
                color: 0x333333,
                metalness: 0.8,
                roughness: 0.2
            });

            const engine = new THREE.Mesh(engineGeometry, engineMaterial);

            // 引擎排列成环形
            if (i === 0) {
                // 中央引擎
                engine.position.set(0, 0, 0);
            } else {
                // 外围8个引擎
                const distance = 1.8;
                engine.position.set(
                    Math.cos(angle) * distance,
                    0,
                    Math.sin(angle) * distance
                );
            }

            engineGroup.add(engine);
        }

        // 添加格栅翼
        const createGrid = () => {
            const gridGeometry = new THREE.BoxGeometry(1, 3, 0.2);
            const gridMaterial = new THREE.MeshStandardMaterial({
                color: 0x888888,
                metalness: 0.6,
                roughness: 0.4
            });

            const grid = new THREE.Mesh(gridGeometry, gridMaterial);
            return grid;
        };

        // 添加4个格栅翼
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const grid = createGrid();
            grid.position.set(
                Math.cos(angle) * 2.5,
                -10,
                Math.sin(angle) * 2.5
            );
            grid.rotation.y = angle;

            this.firstStage.add(grid);
        }

        this.firstStage.add(engineGroup);
        this.rocket.add(this.firstStage);
    }

    createSecondStage() {
        // 二级火箭 - 使用发光材质
        const geometry = new THREE.CylinderGeometry(1.8, 2, 10, 24);
        const material = new THREE.MeshStandardMaterial({
            color: 0xeeeeee,
            metalness: 0.6,
            roughness: 0.3,
            emissive: 0x666666, // 添加自发光颜色
            emissiveIntensity: 0.4 // 发光强度
        });

        this.secondStage = new THREE.Mesh(geometry, material);
        this.secondStage.position.y = 0; // 放在一级火箭上方

        // 添加单个大型引擎
        const engineGeometry = new THREE.CylinderGeometry(0.8, 1, 1.5, 16);
        const engineMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.8,
            roughness: 0.2
        });

        const engine = new THREE.Mesh(engineGeometry, engineMaterial);
        engine.position.y = -5;
        this.secondStage.add(engine);

        this.rocket.add(this.secondStage);
    }

    createThirdStage() {
        // 三级火箭 - 使用发光材质
        const geometry = new THREE.CylinderGeometry(1.3, 1.8, 5, 24);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.5,
            roughness: 0.4,
            emissive: 0x777777, // 添加自发光颜色
            emissiveIntensity: 0.4 // 发光强度
        });

        this.thirdStage = new THREE.Mesh(geometry, material);
        this.thirdStage.position.y = 7.5; // 放在二级火箭上方

        // 添加小型引擎
        const engineGeometry = new THREE.CylinderGeometry(0.5, 0.6, 1, 12);
        const engineMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.8,
            roughness: 0.2
        });

        const engine = new THREE.Mesh(engineGeometry, engineMaterial);
        engine.position.y = -2.5;
        this.thirdStage.add(engine);

        this.rocket.add(this.thirdStage);
    }

    createPayload() {
        // 有效载荷 - 使用明亮的发光材质
        const geometry = new THREE.SphereGeometry(1, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: 0x4488aa,
            metalness: 0.7,
            roughness: 0.2,
            emissive: 0x225588, // 添加自发光颜色
            emissiveIntensity: 0.6 // 发光强度更高
        });

        this.payload = new THREE.Mesh(geometry, material);
        this.payload.position.y = 12; // 放在火箭顶部

        // 添加太阳能电池板
        const panelGeometry = new THREE.BoxGeometry(4, 0.1, 1);
        const panelMaterial = new THREE.MeshStandardMaterial({
            color: 0x2255aa,
            metalness: 0.2,
            roughness: 0.8,
            emissive: 0x1133cc, // 蓝色发光
            emissiveIntensity: 0.8 // 高强度发光
        });

        const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
        leftPanel.position.set(-2, 0, 0);

        const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
        rightPanel.position.set(2, 0, 0);

        this.payload.add(leftPanel);
        this.payload.add(rightPanel);

        this.rocket.add(this.payload);
    }

    createFairings() {
        // 整流罩 - 使用发光材质
        const fairingGeometry = new THREE.ConeGeometry(1.8, 4, 24, 1, true);
        const fairingMaterial = new THREE.MeshStandardMaterial({
            color: 0xeeeeee,
            metalness: 0.6,
            roughness: 0.3,
            emissive: 0x666666, // 添加自发光颜色
            emissiveIntensity: 0.3, // 发光强度
            side: THREE.DoubleSide
        });

        // 创建左右两个半圆锥整流罩
        for (let i = 0; i < 2; i++) {
            const fairing = new THREE.Mesh(fairingGeometry, fairingMaterial);
            fairing.position.y = 10; // 放在顶部
            fairing.rotation.z = i === 0 ? 0 : Math.PI;
            fairing.scale.z = 0.5;

            if (i === 1) {
                fairing.rotation.x = Math.PI;
            }

            this.fairings.push(fairing);
            this.rocket.add(fairing);
        }

        // 添加尖顶
        const tipGeometry = new THREE.ConeGeometry(0.5, 2, 16);
        const tipMaterial = new THREE.MeshStandardMaterial({
            color: 0xeeeeee,
            metalness: 0.7,
            roughness: 0.3,
            emissive: 0xbbbbbb, // 添加较亮的自发光
            emissiveIntensity: 0.5 // 发光强度
        });

        const tip = new THREE.Mesh(tipGeometry, tipMaterial);
        tip.position.y = 13;
        this.rocket.add(tip);
    }

    // 添加整体轮廓发光效果
    addOutlineGlow() {
        // 创建一个稍大的半透明材质包裹火箭
        const glowGeometry = new THREE.CylinderGeometry(3, 3.5, 40, 24);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
        });

        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        glowMesh.position.y = 0; // 位于火箭中心位置
        this.rocket.add(glowMesh);
    }

    // 分离一级火箭
    separateFirstStage() {
        return new Promise(resolve => {
            const detachedStage = this.firstStage.clone();
            detachedStage.position.copy(this.rocket.localToWorld(this.firstStage.position.clone()));

            // 调整分离后的旋转
            detachedStage.rotation.copy(this.rocket.rotation.clone());

            this.scene.add(detachedStage);
            this.rocket.remove(this.firstStage);
            this.firstStage = null; // 确保标记为已分离

            // 一级火箭坠落和旋转的动画
            gsap.to(detachedStage.position, {
                y: -50,
                duration: 5,
                ease: "power1.in"
            });

            gsap.to(detachedStage.rotation, {
                x: detachedStage.rotation.x + Math.PI * 2,
                z: detachedStage.rotation.z + Math.random() * Math.PI - Math.PI / 2,
                duration: 5,
                ease: "power1.in",
                onComplete: () => {
                    this.scene.remove(detachedStage);
                    resolve();
                }
            });
        });
    }

    // 分离二级火箭
    separateSecondStage() {
        return new Promise(resolve => {
            const detachedStage = this.secondStage.clone();
            detachedStage.position.copy(this.rocket.localToWorld(this.secondStage.position.clone()));

            // 调整分离后的旋转
            detachedStage.rotation.copy(this.rocket.rotation.clone());

            this.scene.add(detachedStage);
            this.rocket.remove(this.secondStage);
            this.secondStage = null; // 标记为已分离

            // 二级火箭飘离和旋转的动画
            gsap.to(detachedStage.position, {
                x: detachedStage.position.x + (Math.random() * 20 - 10),
                y: detachedStage.position.y - 20,
                z: detachedStage.position.z + (Math.random() * 20 - 10),
                duration: 8,
                ease: "power1.in"
            });

            gsap.to(detachedStage.rotation, {
                x: detachedStage.rotation.x + Math.PI * 1.5,
                y: detachedStage.rotation.y + Math.PI * Math.random(),
                z: detachedStage.rotation.z + Math.PI * Math.random(),
                duration: 8,
                ease: "power1.inOut",
                onComplete: () => {
                    this.scene.remove(detachedStage);
                    resolve();
                }
            });
        });
    }

    // 打开整流罩
    openFairings() {
        return new Promise(resolve => {
            // 左右整流罩分开的动画
            gsap.to(this.fairings[0].position, {
                x: -5,
                duration: 2,
                ease: "power2.out"
            });

            gsap.to(this.fairings[0].rotation, {
                z: -0.5,
                duration: 2
            });

            gsap.to(this.fairings[1].position, {
                x: 5,
                duration: 2,
                ease: "power2.out"
            });

            gsap.to(this.fairings[1].rotation, {
                z: Math.PI + 0.5,
                duration: 2,
                onComplete: () => {
                    // 整流罩完全打开后，将它们移除
                    setTimeout(() => {
                        this.fairings.forEach(fairing => {
                            this.rocket.remove(fairing);
                        });
                        this.fairings = [];
                        resolve();
                    }, 1000);
                }
            });
        });
    }

    // 部署有效载荷（分离顶端卫星）
    deployPayload() {
        return new Promise(resolve => {
            const satellite = this.payload.clone();
            satellite.position.copy(this.rocket.localToWorld(this.payload.position.clone()));
            satellite.rotation.copy(this.rocket.rotation.clone());

            this.scene.add(satellite);
            this.rocket.remove(this.payload);
            this.payload = null; // 标记为已部署

            // 卫星轻微移动和自转的动画
            gsap.to(satellite.position, {
                y: satellite.position.y + 10,
                duration: 10,
                ease: "power1.out"
            });

            gsap.to(satellite.rotation, {
                y: satellite.rotation.y + Math.PI * 2,
                duration: 20,
                ease: "none",
                repeat: -1 // 持续旋转
            });

            resolve();
        });
    }

    // 获取火箭当前位置（用于粒子效果）
    getBottomPosition() {
        // 获取火箭底部位置
        const position = new THREE.Vector3(0, -25, 0); // 相对于火箭中心的底部位置
        return this.rocket.localToWorld(position.clone());
    }

    // 获取一级火箭底部位置（用于火焰效果）
    getFirstStageBottomPosition() {
        if (!this.firstStage) {
            // 如果一级已分离，返回null或最后已知位置
            return new THREE.Vector3(0, this.rocket.position.y - 25, 0);
        }

        const position = new THREE.Vector3(0, -25, 0);
        return this.rocket.localToWorld(position.clone());
    }

    // 获取二级火箭底部位置
    getSecondStageBottomPosition() {
        if (!this.secondStage) {
            // 如果二级已分离，返回一个估计位置
            return new THREE.Vector3(0, this.rocket.position.y - 5, 0);
        }

        const position = new THREE.Vector3(0, -5, 0);
        return this.rocket.localToWorld(position.clone());
    }

    // 获取三级火箭底部位置
    getThirdStageBottomPosition() {
        if (!this.thirdStage) {
            // 如果三级已分离，返回一个估计位置
            return new THREE.Vector3(0, this.rocket.position.y + 5, 0);
        }

        const position = new THREE.Vector3(0, 5, 0);
        return this.rocket.localToWorld(position.clone());
    }

    // 获取有效载荷位置（用于最终阶段的小推进器）
    getPayloadPosition() {
        if (!this.payload) {
            // 如果有效载荷已部署，返回一个估计位置
            return new THREE.Vector3(0, this.rocket.position.y + 12, 0);
        }

        const position = new THREE.Vector3(0, 12, 0);
        return this.rocket.localToWorld(position.clone());
    }
} 