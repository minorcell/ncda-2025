class StageManager {
    constructor(scene, rocket, particleSystem) {
        this.scene = scene;
        this.rocket = rocket;
        this.particleSystem = particleSystem;
        this.currentStage = 0;
        this.flames = [];

        this.stageData = [
            {
                name: "地面准备阶段",
                description: "火箭正在发射台准备发射",
                progress: 0,
                altitude: 0,
                velocity: 0
            },
            {
                name: "点火与发射",
                description: "发动机点火，火箭开始升空",
                progress: 20,
                altitude: 1,
                velocity: 500
            },
            {
                name: "上升阶段",
                description: "火箭加速穿越大气层",
                progress: 40,
                altitude: 30,
                velocity: 2500
            },
            {
                name: "一级分离",
                description: "一级火箭分离，二级火箭点火",
                progress: 60,
                altitude: 120,
                velocity: 6000
            },
            {
                name: "整流罩分离",
                description: "火箭离开大气层，整流罩脱落",
                progress: 75,
                altitude: 180,
                velocity: 12000
            },
            {
                name: "二级分离",
                description: "二级火箭分离，最终级火箭启动",
                progress: 85,
                altitude: 250,
                velocity: 18000
            },
            {
                name: "进入轨道",
                description: "火箭成功进入预定轨道，准备部署卫星",
                progress: 100,
                altitude: 400,
                velocity: 28000
            }
        ];

        // 更新HTML中的阶段信息
        this.updateStageInfo(0);
    }

    // 创建引擎火焰
    createEngineFlames() {
        // 一级火箭9个引擎的火焰
        const bottomPos = this.rocket.getBottomPosition();

        // 中央引擎
        const mainFlame = this.particleSystem.createEngineFlame(
            new THREE.Vector3(bottomPos.x, bottomPos.y, bottomPos.z),
            2
        );
        this.flames.push(mainFlame);

        // 外围8个引擎
        for (let i = 0; i < 6; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const distance = 1.8;
            const flamePos = new THREE.Vector3(
                bottomPos.x + Math.cos(angle) * distance,
                bottomPos.y,
                bottomPos.z + Math.sin(angle) * distance
            );

            const flame = this.particleSystem.createEngineFlame(flamePos, 1.5);
            this.flames.push(flame);
        }
    }

    // 更新火焰位置
    updateFlames() {
        if (this.flames.length === 0) return;

        // 火箭各阶段的火焰位置应该根据当前活跃的火箭级来确定
        if (this.currentStage < 3) {
            // 阶段1-2: 一级火箭引擎火焰
            const bottomPos = this.rocket.getFirstStageBottomPosition();

            // 更新中央引擎火焰位置
            this.flames[0].position.copy(new THREE.Vector3(
                bottomPos.x,
                bottomPos.y,
                bottomPos.z
            ));

            // 更新外围引擎火焰位置
            for (let i = 1; i < this.flames.length; i++) {
                const angle = ((i - 1) / 8) * Math.PI * 2;
                const distance = 1.8;
                this.flames[i].position.copy(new THREE.Vector3(
                    bottomPos.x + Math.cos(angle) * distance,
                    bottomPos.y,
                    bottomPos.z + Math.sin(angle) * distance
                ));
            }
        }
        else if (this.currentStage < 5) {
            // 阶段3-4: 二级火箭引擎火焰
            const enginePos = this.rocket.getSecondStageBottomPosition();

            // 二级只有一个主引擎
            this.flames[0].position.copy(enginePos);
        }
        else if (this.currentStage < 6) {
            // 阶段5: 三级火箭引擎火焰
            const enginePos = this.rocket.getThirdStageBottomPosition();

            // 三级有小型引擎
            this.flames[0].position.copy(enginePos);
        }
        else {
            // 阶段6+: 卫星/有效载荷的小型推进器 (如果有)
            if (this.flames.length > 0) {
                const enginePos = this.rocket.getPayloadPosition();
                this.flames[0].position.copy(enginePos);
            }
        }
    }

    // 根据滚动进度更新火箭位置和状态
    update(scrollProgress) {
        // 计算总体进度 (0-1)
        const progress = scrollProgress;

        // 根据进度确定当前阶段
        let stageIndex = 0;
        for (let i = 0; i < this.stageData.length; i++) {
            if (progress >= this.stageData[i].progress / 100) {
                stageIndex = i;
            } else {
                break;
            }
        }

        // 如果阶段发生变化，执行阶段转换效果
        if (stageIndex !== this.currentStage) {
            this.executeStageTransition(stageIndex);
        }

        // 更新火箭位置和旋转
        this.updateRocketPosition(progress);

        // 更新火焰位置
        this.updateFlames();

        // 更新数据面板
        this.updateDataPanel(progress);
    }

    // 更新火箭位置和旋转
    updateRocketPosition(progress) {
        // 火箭Y轴位置：从地面到太空
        let altitude = 0;

        if (progress < 0.1) {
            // 初始准备阶段，火箭静止在发射台上
            altitude = 25; // 保持初始高度
        } else if (progress < 0.6) {
            // 上升阶段，加速增加高度
            const liftoffProgress = (progress - 0.1) / 0.5;
            altitude = 25 + liftoffProgress * liftoffProgress * 200; // 从初始高度开始上升
        } else {
            // 高空飞行阶段
            altitude = 25 + 200 + (progress - 0.6) * 400; // 从初始高度+上升高度继续增加
        }

        // 更新火箭位置
        this.rocket.rocket.position.y = altitude;

        // 火箭稍微摆动效果，模拟飞行动态
        if (progress > 0.1) {
            const swayAmount = Math.sin(Date.now() * 0.001) * 0.02;
            this.rocket.rocket.rotation.z = swayAmount;
        }

        // 在太空中轻微旋转
        if (progress > 0.7) {
            const rotationSpeed = (progress - 0.7) * 0.01;
            this.rocket.rocket.rotation.y += rotationSpeed;
        }
    }

    // 执行阶段转换效果
    executeStageTransition(newStage) {
        switch (newStage) {
            case 1: // 点火与发射
                // 先触发相机事件
                if (this.scene.app && this.scene.app.setCameraEvent) {
                    this.scene.app.setCameraEvent("rocketLaunch", 7);
                }

                // 清除现有的火焰（如果有）
                this.clearEngineFlames();

                // 创建一级火箭引擎火焰（9个引擎）
                this.createFirstStageFlames();

                // 创建发射烟雾效果
                const launchPos = this.rocket.getFirstStageBottomPosition();
                this.particleSystem.createLaunchEffects(launchPos);

                break;

            case 3: // 一级分离
                if (this.scene.app && this.scene.app.setCameraEvent) {
                    this.scene.app.setCameraEvent("firstStageSeparation", 7);
                }


                // 执行一级火箭分离
                this.rocket.separateFirstStage().then(() => {
                    // 创建分离效果
                    const firstStagePos = new THREE.Vector3(
                        this.rocket.rocket.position.x,
                        this.rocket.rocket.position.y - 15,
                        this.rocket.rocket.position.z
                    );
                    this.particleSystem.createSeparationEffect(firstStagePos);

                    // 清除现有的引擎火焰
                    this.clearEngineFlames();

                    // 创建二级火箭引擎火焰（单个大型火焰）
                    this.createSecondStageFlame();
                });
                break;

            case 4: // 整流罩分离
                // 先触发相机事件，确保相机就位
                if (this.scene.app && this.scene.app.setCameraEvent) {
                    this.scene.app.setCameraEvent("fairingSeparation", 7);
                }

                // 执行整流罩分离
                setTimeout(() => {
                    this.rocket.openFairings().then(() => {
                        // 分离效果
                        const fairingPos = new THREE.Vector3(
                            this.rocket.rocket.position.x,
                            this.rocket.rocket.position.y + 10,
                            this.rocket.rocket.position.z
                        );
                        this.particleSystem.createSeparationEffect(fairingPos);

                        // 火焰保持不变，继续使用二级火箭火焰
                    });
                }, 1000); // 延迟1秒，给相机时间切换到合适视角
                break;

            case 5: // 二级分离
                if (this.scene.app && this.scene.app.setCameraEvent) {
                    this.scene.app.setCameraEvent("secondStageSeparation", 7);
                }

                setTimeout(() => {
                    this.rocket.separateSecondStage().then(() => {
                        // 分离效果
                        const secondStagePos = new THREE.Vector3(
                            this.rocket.rocket.position.x,
                            this.rocket.rocket.position.y,
                            this.rocket.rocket.position.z
                        );
                        this.particleSystem.createSeparationEffect(secondStagePos);

                        // 清除二级火箭的火焰
                        this.clearEngineFlames();

                        // 创建三级火箭引擎火焰（较小的火焰）
                        this.createThirdStageFlame();
                    });
                }, 1000);
                break;

            case 6: // 进入轨道和卫星部署
                if (this.scene.app && this.scene.app.setCameraEvent) {
                    this.scene.app.setCameraEvent("satelliteDeployment", 15); // 更长时间观察
                }

                setTimeout(() => {
                    this.rocket.deployPayload().then(() => {
                        // 清除现有火焰
                        this.clearEngineFlames();

                        // 等待电池板展开动画完成后再添加小型推进器
                        setTimeout(() => {
                            // 更新数据面板，显示部署成功
                            document.getElementById('stage-description').textContent += " - 太阳能电池板展开完成";
                        }, 8000); // 给电池板展开留足时间
                    });
                }, 1500);
                break;
        }

        // 更新阶段信息
        this.updateStageInfo(newStage);

        // 更新当前阶段
        this.currentStage = newStage;
    }

    // 创建一级火箭的9个引擎火焰
    createFirstStageFlames() {
        const bottomPos = this.rocket.getFirstStageBottomPosition();

        // 中央引擎
        const mainFlame = this.particleSystem.createEngineFlame(
            new THREE.Vector3(bottomPos.x, bottomPos.y, bottomPos.z),
            2,
            0xff5500 // 橙红色火焰
        );
        this.flames.push(mainFlame);

        // 外围8个引擎
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const distance = 1.8;
            const flamePos = new THREE.Vector3(
                bottomPos.x + Math.cos(angle) * distance,
                bottomPos.y,
                bottomPos.z + Math.sin(angle) * distance
            );

            const flame = this.particleSystem.createEngineFlame(
                flamePos,
                1.5,
                0xff5500
            );
            this.flames.push(flame);
        }
    }

    // 创建二级火箭的单个引擎火焰
    createSecondStageFlame() {
        const enginePos = this.rocket.getSecondStageBottomPosition();

        // 二级火箭使用更蓝的火焰（更高效燃料）
        const secondStageFire = this.particleSystem.createEngineFlame(
            enginePos,
            2.5,
            0x00aaff // 蓝色调火焰
        );
        this.flames = [secondStageFire]; // 新的火焰数组（只有一个火焰）
    }

    // 创建三级火箭的引擎火焰
    createThirdStageFlame() {
        const enginePos = this.rocket.getThirdStageBottomPosition();

        // 三级火箭使用白蓝色火焰（最高效燃料）
        const thirdStageFire = this.particleSystem.createEngineFlame(
            enginePos,
            1.2,
            0x66ccff // 浅蓝色火焰
        );
        this.flames = [thirdStageFire]; // 新的火焰数组
    }

    // 清除所有引擎火焰
    clearEngineFlames() {
        if (this.flames.length > 0) {
            this.flames.forEach(flame => {
                this.scene.remove(flame);
                // 从粒子系统中移除
                this.particleSystem.flameParticles = this.particleSystem.flameParticles.filter(
                    p => p.mesh !== flame
                );
            });
            this.flames = [];
        }
    }

    // 更新HTML中的阶段信息
    updateStageInfo(stageIndex) {
        const stage = this.stageData[stageIndex];
        document.getElementById('stage-title').textContent = stage.name;
        document.getElementById('stage-description').textContent = stage.description;
        document.querySelector('.progress').style.width = stage.progress + '%';
    }

    // 更新数据面板信息
    updateDataPanel(progress) {
        // 根据进度插值计算高度和速度
        let altitude = 0;
        let velocity = 0;
        let time = 0;

        // 找到当前所处的阶段区间
        for (let i = 0; i < this.stageData.length - 1; i++) {
            const currentProgress = this.stageData[i].progress / 100;
            const nextProgress = this.stageData[i + 1].progress / 100;

            if (progress >= currentProgress && progress <= nextProgress) {
                // 计算在当前区间的相对进度
                const segmentProgress = (progress - currentProgress) / (nextProgress - currentProgress);

                // 线性插值计算当前值
                altitude = this.stageData[i].altitude + segmentProgress * (this.stageData[i + 1].altitude - this.stageData[i].altitude);
                velocity = this.stageData[i].velocity + segmentProgress * (this.stageData[i + 1].velocity - this.stageData[i].velocity);
                time = i * 60 + segmentProgress * 60; // 假设每个阶段60秒
                break;
            }
        }

        // 更新HTML中的数据
        document.getElementById('altitude').textContent = Math.round(altitude) + ' km';
        document.getElementById('velocity').textContent = Math.round(velocity) + ' km/h';

        // 格式化时间显示 (MM:SS)
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const timeFormatted = 'T+' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
        document.getElementById('mission-time').textContent = timeFormatted;
    }
} 