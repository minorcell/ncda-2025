// 引入 three.js 模块
import * as THREE from '../../build/threejs/three.module.min.js';

// 创建一个背景类，用于渲染动态星球背景
class PlanetBackground {
    constructor() {
        // 创建一个 Three.js 场景
        this.scene = new THREE.Scene();

        // 创建透视摄像机，FOV 为 75，近剪裁面 0.1，远剪裁面 1000
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

        // 渲染器、星球组、星球本体、网格层、光晕层等对象初始化为空
        this.renderer = null;
        this.group = null;
        this.planet = null;
        this.gridMesh = null;
        this.glowMesh = null;

        // 用于动画中动态变化的时间变量
        this.time = 0;

        // 初始化场景
        this.init();
    }

    init() {
        // 获取 DOM 中 class 为 .planet-canvas 的 canvas 元素
        const canvas = document.querySelector('.planet-canvas');
        if (!canvas) return; // 若未找到，提前退出

        // 创建 WebGL 渲染器并指定 canvas，启用抗锯齿与透明背景
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });

        // 设置渲染区域为窗口大小
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // 将相机放到 Y 轴上方
        this.camera.position.set(0, 4, 3); // x=0, y=4, z=4（上方俯视）

        // 让相机朝向星球中心（0, 0, 0）
        this.camera.lookAt(0, 0, 0);


        // 创建一个组用于统一旋转控制：包含星球、网格、光晕
        this.group = new THREE.Group();

        // 创建星球主体、经纬线网格、外部发光层
        this.createPlanet();
        this.createGrid();

        // 将星球组添加到场景中
        this.scene.add(this.group);
        this.group.position.y = 0.5

        // 启动渲染循环动画
        this.animate();

        // 窗口尺寸变化时调整摄像机和渲染器
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createPlanet() {
        // 创建球体几何体，半径 2，精细程度为 64 段
        const geometry = new THREE.SphereGeometry(2, 128, 128);

        // 使用 ShaderMaterial 创建星球材质，可用于实现 Fresnel 效应和动态条纹
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }, // 时间变量，用于动画
                color1: { value: new THREE.Color('#803096') }, // 中心颜色（深紫）
                color2: { value: new THREE.Color('#ffffff') }  // 边缘颜色（浅紫/白）
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vViewDir;
                
                void main() {
                    vUv = uv; // 传递 UV 坐标到片元着色器
                    vNormal = normalize(normalMatrix * normal); // 世界空间法线
                    vec3 pos = (modelViewMatrix * vec4(position, 1.0)).xyz;
                    vViewDir = normalize(-pos); // 视角方向
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color1;
                uniform vec3 color2;
                uniform float time;
                
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vViewDir;
                
                void main() {
                    // Fresnel 效应：边缘发亮
                    float fresnel = pow(1.0 - dot(vNormal, vViewDir), 3.0); // 使用幂函数强化中心色影响
                    vec3 baseColor = mix(color1, color2, fresnel);

                    // 添加动态条纹动画效果
                    float streak = sin(vUv.x * 20.0 + time * 0.1) * 0.5 + 0.5;
                    vec3 finalColor = baseColor + streak * 0.05;

                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `
        });

        // 创建网格并加入到 group 中
        this.planet = new THREE.Mesh(geometry, material);
        this.group.add(this.planet);
    }

    createGrid() {
        // 创建略大一点的球体来承载经纬网格，避免 z-fighting
        const geometry = new THREE.SphereGeometry(2.001, 128, 128);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                numLatitudes: { value: 0 },   // 纬线数
                numLongitudes: { value: 24 },  // 经线数
                color: { value: new THREE.Color(0xffffff) }, // 网格颜色
                opacity: { value: 0.5 } // 网格透明度
            },
            vertexShader: `
                varying vec2 vUv;

                void main() {
                    vUv = uv; // 传递 UV 到片元着色器
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float numLatitudes;
                uniform float numLongitudes;
                uniform vec3 color;
                uniform float opacity;

                varying vec2 vUv;

                void main() {
                    // 计算纬线和经线的条带位置
                    float latLine = step(0.99, fract(vUv.y * numLatitudes));
                    float lonLine = step(0.99, fract(vUv.x * numLongitudes));
                    float line = latLine + lonLine;

                    gl_FragColor = vec4(color, line * opacity);
                }
            `,
            transparent: true // 开启透明
        });

        this.gridMesh = new THREE.Mesh(geometry, material);
        this.group.add(this.gridMesh);
    }

    animate() {
        // 每帧调用自身实现无限循环动画
        requestAnimationFrame(() => this.animate());

        // 缓慢旋转整个星球组
        this.group.rotation.y += 0.001;

        // 时间更新，传递到星球着色器中用于动画
        this.time += 0.01;
        this.planet.material.uniforms.time.value = this.time;

        // 渲染画面
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        // 更新摄像机宽高比
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        // 更新渲染器尺寸
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// 等 DOM 加载完成后创建背景
document.addEventListener("DOMContentLoaded", function () {
    new PlanetBackground();
});
