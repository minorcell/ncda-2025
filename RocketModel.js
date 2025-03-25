class RocketModel {
    constructor(scene) {
        this.scene = scene;
        this.rocket = new THREE.Group();
        this.firstStage = null;
        this.secondStage = null;
        this.thirdStage = null;
        this.payload = null;
        this.fairings = [];
        this.firstStageFlameRemoved = false;
        this.secondStageFlameRemoved = false;

        // 添加这个数组来存储火箭部件引用
        this.rocketParts = [];

        this.createRocket();
        this.scene.add(this.rocket);

        // 添加整体轮廓效果
        this.addOutlineGlow();
    }

    createRocket() {
        // 创建火箭的分段结构 - 调整顺序
        this.createFirstStage();
        this.createSecondStage();
        this.createThirdStage();
        this.createPayload();    // 先创建卫星
        this.createFairings();   // 然后创建整流罩覆盖它

        // 设置初始位置
        this.rocket.position.set(0, 25, 0);

        // 确保设置阶段引用
        this.firstStage = this.rocketParts.find(part => part.name === 'firstStage');
        this.secondStage = this.rocketParts.find(part => part.name === 'secondStage');
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
        this.firstStage.name = 'firstStage'; // 确保设置名称
        this.rocket.add(this.firstStage);
        this.rocketParts.push(this.firstStage); // 添加到部件数组
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

        this.secondStage.name = 'secondStage'; // 确保设置名称
        this.rocket.add(this.secondStage);
        this.rocketParts.push(this.secondStage); // 添加到部件数组
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

        this.thirdStage.name = 'thirdStage'; // 确保设置名称
        this.rocket.add(this.thirdStage);
        this.rocketParts.push(this.thirdStage); // 添加到部件数组
    }

    createPayload() {
        // 有效载荷 - 使用明亮的发光材质
        const geometry = new THREE.SphereGeometry(1, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: 0x4488aa,
            metalness: 0.7,
            roughness: 0.2,
            emissive: 0x225588,
            emissiveIntensity: 0.6
        });

        this.payload = new THREE.Mesh(geometry, material);
        this.payload.position.y = 10; // 与整流罩位置保持一致

        // 创建太阳能电池板组 - 以便后续可以一起操作
        this.solarPanels = new THREE.Group();
        this.payload.add(this.solarPanels);

        // 添加太阳能电池板 - 初始状态为折叠
        const panelGeometry = new THREE.BoxGeometry(0.8, 0.1, 1); // 更窄的电池板（折叠状态）
        const panelMaterial = new THREE.MeshStandardMaterial({
            color: 0x2255aa,
            metalness: 0.2,
            roughness: 0.8,
            emissive: 0x1133cc, // 蓝色发光
            emissiveIntensity: 0.8 // 高强度发光
        });

        // 左侧面板
        this.leftPanel = new THREE.Group();
        const leftPanelMain = new THREE.Mesh(panelGeometry, panelMaterial);
        this.leftPanel.add(leftPanelMain);

        // 为左侧面板添加连接部件
        const leftConnector = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, 0.2),
            new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 })
        );
        leftConnector.position.set(-0.5, 0, 0);
        this.leftPanel.add(leftConnector);

        this.leftPanel.position.set(-0.6, 0, 0); // 靠近卫星主体
        this.leftPanel.rotation.set(0, 0, Math.PI / 2); // 初始是垂直折叠的

        // 右侧面板
        this.rightPanel = new THREE.Group();
        const rightPanelMain = new THREE.Mesh(panelGeometry, panelMaterial);
        this.rightPanel.add(rightPanelMain);

        // 为右侧面板添加连接部件
        const rightConnector = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, 0.2),
            new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 })
        );
        rightConnector.position.set(0.5, 0, 0);
        this.rightPanel.add(rightConnector);

        this.rightPanel.position.set(0.6, 0, 0); // 靠近卫星主体
        this.rightPanel.rotation.set(0, 0, -Math.PI / 2); // 初始是垂直折叠的

        // 将面板添加到面板组中
        this.solarPanels.add(this.leftPanel);
        this.solarPanels.add(this.rightPanel);

        // 添加一些卫星细节（天线、传感器等）
        this.addSatelliteDetails();

        this.rocket.add(this.payload);
    }

    // 添加卫星细节
    addSatelliteDetails() {
        // 添加通信天线
        const antennaGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);
        const antennaMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x666666
        });

        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.set(0, 0.8, 0);
        antenna.rotation.x = Math.PI / 2; // 向上指向

        // 添加天线末端的接收器
        const dishGeometry = new THREE.SphereGeometry(0.15, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const dish = new THREE.Mesh(dishGeometry, antennaMaterial);
        dish.position.y = 0.8;
        dish.rotation.x = Math.PI / 2;
        antenna.add(dish);

        this.payload.add(antenna);

        // 添加地球传感器
        const sensorGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.2, 12);
        const sensorMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            emissive: 0x222222
        });

        const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
        sensor.position.set(0, -0.6, 0.8);
        sensor.rotation.x = Math.PI / 2;
        this.payload.add(sensor);

        // 添加姿态控制推进器
        const thrusterGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.2, 8);
        const thrusterMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.9
        });

        // 添加4个小型推进器
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const thruster = new THREE.Mesh(thrusterGeometry, thrusterMaterial);
            thruster.position.set(
                Math.cos(angle) * 0.9,
                0,
                Math.sin(angle) * 0.9
            );
            thruster.rotation.z = angle;
            this.payload.add(thruster);
        }
    }

    createFairings() {
        // 整流罩容器 - 用于整体管理整流罩
        this.fairingContainer = new THREE.Group();
        this.fairingContainer.position.y = 10; // 与卫星位置一致
        this.rocket.add(this.fairingContainer);

        // 创建正确的整流罩形状 - 典型的双瓣式设计
        const fairingHeight = 5;  // 整流罩高度
        const fairingRadius = 1.8; // 整流罩底部半径
        const tipHeight = 2;      // 顶部尖锥高度

        // 创建整流罩形状的几何体 (一个圆柱体连接一个圆锥体)
        const fairingShape = new THREE.Shape();
        fairingShape.moveTo(0, 0); // 底部中心
        fairingShape.lineTo(fairingRadius, 0); // 底部右侧
        fairingShape.lineTo(fairingRadius, fairingHeight - tipHeight); // 圆柱体顶部右侧
        fairingShape.lineTo(0, fairingHeight); // 圆锥体顶点
        fairingShape.lineTo(0, 0); // 回到底部中心

        // 使用旋转挤压创建3D形状
        const extrudeSettings = {
            steps: 1,
            depth: 0.1,
            bevelEnabled: false
        };

        // 左右两瓣整流罩的材质
        const fairingMaterial = new THREE.MeshStandardMaterial({
            color: 0xeeeeee,
            metalness: 0.6,
            roughness: 0.3,
            emissive: 0x666666,
            emissiveIntensity: 0.3
        });

        // 创建左侧整流罩
        const leftFairing = new THREE.Group();

        // 使用LatheGeometry创建左半部分
        const leftGeometry = new THREE.LatheGeometry(
            [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(fairingRadius, 0),
                new THREE.Vector2(fairingRadius, fairingHeight - tipHeight),
                new THREE.Vector2(0, fairingHeight)
            ],
            32,  // 分段数
            0,   // 起始角度
            Math.PI  // 仅创建半圆形 (左侧)
        );

        const leftFairingMesh = new THREE.Mesh(leftGeometry, fairingMaterial);
        leftFairingMesh.position.set(0, 0, 0);
        leftFairing.add(leftFairingMesh);

        // 添加内部细节
        const detailMaterial = new THREE.MeshStandardMaterial({
            color: 0x999999,
            metalness: 0.7,
            roughness: 0.5
        });

        // 添加分离线和内部加强筋
        const separationLine = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, fairingHeight, 0.1),
            detailMaterial
        );
        separationLine.position.set(0, fairingHeight / 2 - 0.5, -fairingRadius);
        leftFairing.add(separationLine);

        this.leftFairing = leftFairing;
        this.fairingContainer.add(leftFairing);
        this.fairings.push(leftFairing);

        // 创建右侧整流罩 (镜像左侧)
        const rightFairing = new THREE.Group();

        // 使用LatheGeometry创建右半部分
        const rightGeometry = new THREE.LatheGeometry(
            [
                new THREE.Vector2(0, 0),
                new THREE.Vector2(fairingRadius, 0),
                new THREE.Vector2(fairingRadius, fairingHeight - tipHeight),
                new THREE.Vector2(0, fairingHeight)
            ],
            32,       // 分段数
            Math.PI,  // 起始角度
            Math.PI   // 仅创建半圆形 (右侧)
        );

        const rightFairingMesh = new THREE.Mesh(rightGeometry, fairingMaterial);
        rightFairingMesh.position.set(0, 0, 0);
        rightFairing.add(rightFairingMesh);

        // 添加右侧分离线
        const rightSeparationLine = separationLine.clone();
        rightSeparationLine.position.set(0, fairingHeight / 2 - 0.5, fairingRadius);
        rightFairing.add(rightSeparationLine);

        this.rightFairing = rightFairing;
        this.fairingContainer.add(rightFairing);
        this.fairings.push(rightFairing);

        // 添加内部圆环作为结构细节
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.RingGeometry(fairingRadius - 0.2, fairingRadius - 0.1, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0x333333,
                side: THREE.DoubleSide
            });

            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = i * (fairingHeight / 3) - 1.5;
            this.fairingContainer.add(ring);
        }
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
            // 获取整流罩在世界坐标系中的位置
            const fairingWorldPos = new THREE.Vector3();
            this.fairingContainer.getWorldPosition(fairingWorldPos);

            // 左右整流罩分离动画
            if (this.leftFairing) {
                gsap.to(this.leftFairing.position, {
                    x: -5,
                    z: -1,
                    duration: 2,
                    ease: "power2.out"
                });

                gsap.to(this.leftFairing.rotation, {
                    y: -0.2,
                    z: -0.1,
                    duration: 2,
                    ease: "power2.out"
                });
            }

            if (this.rightFairing) {
                gsap.to(this.rightFairing.position, {
                    x: 5,
                    z: 1,
                    duration: 2,
                    ease: "power2.out"
                });

                gsap.to(this.rightFairing.rotation, {
                    y: 0.2,
                    z: 0.1,
                    duration: 2,
                    ease: "power2.out"
                });
            }

            // 整流罩完全打开后，将其从火箭中移除，并添加到场景中让它们继续漂浮
            setTimeout(() => {
                // 创建分离后的整流罩组
                const detachedFairings = new THREE.Group();
                detachedFairings.position.copy(fairingWorldPos);

                // 复制整流罩到独立组中
                if (this.leftFairing && this.rightFairing) {
                    const leftClone = this.leftFairing.clone();
                    leftClone.position.copy(this.leftFairing.position);
                    leftClone.rotation.copy(this.leftFairing.rotation);
                    detachedFairings.add(leftClone);

                    const rightClone = this.rightFairing.clone();
                    rightClone.position.copy(this.rightFairing.position);
                    rightClone.rotation.copy(this.rightFairing.rotation);
                    detachedFairings.add(rightClone);
                }

                // 将分离的整流罩添加到场景
                this.scene.add(detachedFairings);

                // 从火箭中移除整流罩
                this.rocket.remove(this.fairingContainer);
                this.fairings = [];
                this.leftFairing = null;
                this.rightFairing = null;

                // 对分离的整流罩添加漂离动画
                gsap.to(detachedFairings.position, {
                    x: detachedFairings.position.x + (Math.random() * 20 - 10),
                    y: detachedFairings.position.y - 15,
                    z: detachedFairings.position.z + (Math.random() * 20 - 10),
                    duration: 8,
                    ease: "power1.in"
                });

                gsap.to(detachedFairings.rotation, {
                    x: Math.random() * Math.PI * 2,
                    y: Math.random() * Math.PI * 2,
                    z: Math.random() * Math.PI * 2,
                    duration: 8,
                    ease: "power1.inOut",
                    onComplete: () => {
                        // 从场景中移除
                        this.scene.remove(detachedFairings);
                    }
                });

                resolve();
            }, 2000);
        });
    }

    // 部署有效载荷（分离顶端卫星）并展开太阳能电池板
    deployPayload() {
        return new Promise(resolve => {
            const satellite = this.payload.clone();
            satellite.position.copy(this.rocket.localToWorld(this.payload.position.clone()));
            satellite.rotation.copy(this.rocket.rotation.clone());

            this.scene.add(satellite);
            this.rocket.remove(this.payload);
            this.payload = null; // 标记为已部署

            // 存储卫星引用，以便后续跟踪它
            this.scene.satellite = satellite;

            // 初始轨道参数
            satellite.userData.orbit = {
                radius: satellite.position.length(), // 初始轨道半径
                angle: 0,                           // 初始角度
                speed: 0.0001,                      // 轨道速度
                inclination: Math.PI * 0.1,         // 轨道倾角
                phase: 0                            // 相位
            };

            // 卫星稍微上升到轨道高度
            gsap.to(satellite.position, {
                y: satellite.position.y + 20,
                duration: 4,
                ease: "power1.out",
                onComplete: () => {
                    // 卫星到达目标轨道高度后更新轨道参数
                    satellite.userData.orbit.radius = satellite.position.length();

                }
            });

            // 卫星轻微调整姿态
            gsap.to(satellite.rotation, {
                x: 0, // 水平朝向
                duration: 3,
                ease: "power1.inOut"
            });

            // 延迟解析Promise，等待基本动画完成
            setTimeout(resolve, 3000);
        });
    }

    // 添加一个更新卫星轨道的方法 - 在RocketModel类中添加
    updateSatelliteOrbit() {
        // 如果卫星存在于场景中，更新其轨道位置
        const satellite = this.scene.satellite;
        if (!satellite) return;

        const orbit = satellite.userData.orbit;
        if (!orbit) return;

        // 更新轨道角度
        orbit.angle += orbit.speed;

        // 使用参数方程计算轨道上的位置
        const x = Math.cos(orbit.angle) * orbit.radius;
        const y = Math.sin(orbit.angle) * orbit.radius * Math.sin(orbit.inclination) - 510 + orbit.radius;
        const z = Math.sin(orbit.angle) * orbit.radius * Math.cos(orbit.inclination);

        // 平滑过渡到新位置
        gsap.to(satellite.position, {
            x: x,
            y: y,
            z: z,
            duration: 0.5,
            ease: "linear",
            overwrite: true
        });

        // 平滑过渡到新的朝向
        gsap.to(satellite.rotation, {
            x: euler.x,
            y: euler.y,
            z: euler.z,
            duration: 1.0,
            ease: "power1.out",
            overwrite: true
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