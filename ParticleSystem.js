class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.smokeParticles = [];
        this.flameParticles = [];
    }

    createEngineFlame(position, size = 1, color = 0xff6600) {
        // 创建火箭引擎火焰粒子系统
        const flameGeometry = new THREE.ConeGeometry(size * 0.5, size * 2, 20);
        const flameMaterial = new THREE.MeshBasicMaterial({
            color: color, // 使用传入的颜色
            transparent: true,
            opacity: 0.9
        });

        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.copy(position);

        // 创建内部更亮的火焰 - 颜色根据外部火焰自动调整
        let innerColor;
        if (color === 0xff6600 || color === 0xff5500) {
            innerColor = 0xffff00; // 黄色内焰用于红/橙色火焰
        } else if (color === 0x00aaff) {
            innerColor = 0xaaffff; // 青白色内焰用于蓝色火焰
        } else {
            innerColor = 0xffffff; // 默认白色内焰
        }

        const innerFlameGeometry = new THREE.ConeGeometry(size * 0.3, size * 1.5, 20);
        const innerFlameMaterial = new THREE.MeshBasicMaterial({
            color: innerColor,
            transparent: true,
            opacity: 1.0,
            emissive: innerColor,
            emissiveIntensity: 1.0
        });

        const innerFlame = new THREE.Mesh(innerFlameGeometry, innerFlameMaterial);
        innerFlame.position.y = -size * 0.25;
        flame.add(innerFlame);

        // 添加发光点光源，颜色匹配火焰
        const flameLight = new THREE.PointLight(color, 2, size * 5);
        flameLight.position.set(0, -size * 1, 0);
        flame.add(flameLight);

        this.scene.add(flame);
        this.flameParticles.push({
            mesh: flame,
            originalSize: size,
            intensity: 1.0,
            flickerSpeed: 0.1 + Math.random() * 0.2,
            light: flameLight // 存储光源引用
        });

        return flame;
    }

    createSmoke(position, size = 1) {
        // 创建烟雾粒子系统
        const particleCount = 50;
        const geometry = new THREE.BufferGeometry();
        const vertices = [];

        for (let i = 0; i < particleCount; i++) {
            const x = (Math.random() - 0.5) * size;
            const y = (Math.random() - 0.5) * size;
            const z = (Math.random() - 0.5) * size;
            vertices.push(x, y, z);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        const smokeMaterial = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size: 0.5,
            transparent: true,
            opacity: 0.4
        });

        const smokeParticles = new THREE.Points(geometry, smokeMaterial);
        smokeParticles.position.copy(position);

        this.scene.add(smokeParticles);
        this.smokeParticles.push({
            mesh: smokeParticles,
            velocity: new THREE.Vector3(0, -0.05, 0),
            age: 0,
            maxAge: 100
        });

        return smokeParticles;
    }

    update() {
        // 更新火焰粒子效果
        this.flameParticles.forEach(flame => {
            // 火焰闪烁效果
            flame.intensity = 0.8 + Math.sin(Date.now() * flame.flickerSpeed) * 0.2;
            flame.mesh.scale.set(
                flame.originalSize * (0.9 + Math.random() * 0.2 * flame.intensity),
                flame.originalSize * (0.9 + Math.random() * 0.2 * flame.intensity),
                flame.originalSize * (0.9 + Math.random() * 0.2 * flame.intensity)
            );

            // 更新光源强度
            if (flame.light) {
                flame.light.intensity = 2 + Math.random() * flame.intensity * 2;
            }
        });

        // 更新烟雾粒子
        for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
            const smoke = this.smokeParticles[i];
            smoke.mesh.position.add(smoke.velocity);
            smoke.age++;

            // 烟雾逐渐消散
            const fadeRatio = smoke.age / smoke.maxAge;
            if (fadeRatio < 1) {
                smoke.mesh.material.opacity = 0.4 * (1 - fadeRatio);
                smoke.mesh.scale.addScalar(0.02); // 烟雾扩散
            } else {
                this.scene.remove(smoke.mesh);
                this.smokeParticles.splice(i, 1);
            }
        }
    }

    // 创建发射时的大量烟雾和火焰
    createLaunchEffects(rocketPosition) {
        // 创建大量烟雾效果
        for (let i = 0; i < 20; i++) {
            const smokePos = new THREE.Vector3(
                rocketPosition.x + (Math.random() - 0.5) * 5,
                rocketPosition.y - 10,
                rocketPosition.z + (Math.random() - 0.5) * 5
            );
            this.createSmoke(smokePos, 5 + Math.random() * 10);
        }

        // 创建额外的火焰效果
        const flamePos = new THREE.Vector3(
            rocketPosition.x,
            rocketPosition.y - 8,
            rocketPosition.z
        );
        const flame = this.createEngineFlame(flamePos, 3);

        // 设置火焰自动缩小和消失的动画
        gsap.to(flame.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 3,
            ease: "power2.out",
            onComplete: () => {
                this.scene.remove(flame);
                this.flameParticles = this.flameParticles.filter(p => p.mesh !== flame);
            }
        });
    }

    // 创建分离效果
    createSeparationEffect(position) {
        // 创建爆炸粒子
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 2;
            positions[i3 + 1] = (Math.random() - 0.5) * 2;
            positions[i3 + 2] = (Math.random() - 0.5) * 2;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffaa00,
            size: 0.2,
            transparent: true,
            opacity: 1
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        particleSystem.position.copy(position);
        this.scene.add(particleSystem);

        // 粒子向外扩散的动画
        const initialPositions = positions.slice();

        gsap.to(particleMaterial, {
            opacity: 0,
            duration: 2,
            ease: "power2.out",
            onComplete: () => {
                this.scene.remove(particleSystem);
            }
        });

        // 更新粒子位置，模拟爆炸效果
        const expandParticles = () => {
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                positions[i3] = initialPositions[i3] * (1 + Math.random() * 15);
                positions[i3 + 1] = initialPositions[i3 + 1] * (1 + Math.random() * 15);
                positions[i3 + 2] = initialPositions[i3 + 2] * (1 + Math.random() * 15);
            }
            particles.attributes.position.needsUpdate = true;
        };

        gsap.to({}, {
            duration: 1.5,
            ease: "power3.out",
            onUpdate: expandParticles
        });
    }
} 