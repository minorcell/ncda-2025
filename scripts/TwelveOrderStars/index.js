let rocketScene, rocketCamera, rocketRenderer;
let rocketModel;
let clock = new THREE.Clock();
let labelsGroup;
let fontLoader;
let font;

// 火箭各部分的缓存对象（简化版）
let rocketParts = {
    'escape-tower': {
        meshes: [],
        name: '逃逸塔',
        position: { y: 4.0 },
        displayOrder: 1
    },
    'fairing': {
        meshes: [],
        name: '整流罩',
        position: { y: 2.5 },
        displayOrder: 2
    },
    'core-two': {
        meshes: [],
        name: '芯二级',
        position: { y: 1.0 },
        displayOrder: 3
    },
    'core-one': {
        meshes: [],
        name: '芯一级',
        position: { y: -0.5 },
        displayOrder: 4
    },
    'booster': {
        meshes: [],
        name: '助推器',
        position: { y: -2.0 },
        displayOrder: 5
    }
};

/**
 * 初始化Three.js场景和加载3D模型
 */
function initRocketModel() {
    const canvas = document.querySelector('.rocket');
    if (!canvas) return;

    // 创建场景
    rocketScene = new THREE.Scene();

    // 创建透视相机
    rocketCamera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    rocketCamera.position.set(0, 0, 10);

    // 创建渲染器
    rocketRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    rocketRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    rocketRenderer.setPixelRatio(window.devicePixelRatio);
    rocketRenderer.shadowMap.enabled = true; // 启用阴影
    rocketRenderer.toneMapping = THREE.ACESFilmicToneMapping; // 设置色调映射
    rocketRenderer.toneMappingExposure = 1.0; // 调整曝光度

    // 添加环境光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 降低环境光强度
    rocketScene.add(ambientLight);

    // 添加平行光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 增强平行光强度
    directionalLight.position.set(5, 10, 7); // 调整光源位置，使其从斜上方照射
    directionalLight.castShadow = true; // 平行光投射阴影
    // 配置阴影属性
    directionalLight.shadow.mapSize.width = 2048; // 提高阴影贴图分辨率
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.bias = -0.0001; // 调整阴影偏移，防止条纹
    rocketScene.add(directionalLight);

    // 添加点光源 (可以稍微降低强度或调整位置作为补光)
    const pointLight = new THREE.PointLight(0xffffff, 0.3);
    pointLight.position.set(-5, 5, 5); // 调整点光源位置
    rocketScene.add(pointLight);

    // 为3D场景中的标签创建一个组
    labelsGroup = new THREE.Group();
    rocketScene.add(labelsGroup);

    // 加载3D模型
    const loader = new THREE.GLTFLoader();
    loader.load(
        '../assets/models/rocket_model.glb',
        (gltf) => {
            rocketModel = gltf.scene;

            // 调整模型尺寸和位置
            rocketModel.scale.set(3.5, 3.5, 3.5);

            // 遍历模型，设置阴影投射和接收，并调整材质
            rocketModel.traverse((object) => {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                    if (object.material.isMeshStandardMaterial) {
                        object.material.roughness = 0.4; // 调整粗糙度
                        object.material.metalness = 0.2; // 调整金属感
                        // 如果有贴图，确保颜色空间正确
                        if (object.material.map) {
                            object.material.map.encoding = THREE.sRGBEncoding;
                        }
                    }
                }
            });

            // 计算模型的边界框以确定中心点和底部
            const box = new THREE.Box3().setFromObject(rocketModel);
            const center = box.getCenter(new THREE.Vector3());

            // 将模型移至原点
            rocketModel.position.set(-center.x, -center.y, -center.z);

            // 创建一个组来包含模型
            const modelGroup = new THREE.Group();
            modelGroup.add(rocketModel);

            // 将组添加到场景中
            rocketScene.add(modelGroup);

            // 将整个模型组向左移动（例如，移动到X轴的-2位置）
            modelGroup.position.x = -3.3;

            // 更新模型变量为组
            rocketModel = modelGroup;

            // 自动旋转展示模型
            animate();
        },
        (xhr) => {
            console.log('Loading model: ' + Math.floor((xhr.loaded / xhr.total) * 100) + '%');
        },
        (error) => {
            console.error('Error loading model:', error);
        }
    );

    // 添加窗口大小变化的监听器
    window.addEventListener('resize', onWindowResize);
}

/**
 * 响应窗口大小变化
 */
function onWindowResize() {
    const canvas = document.querySelector('.rocket');
    if (!canvas || !rocketCamera || !rocketRenderer) return;

    rocketCamera.aspect = canvas.clientWidth / canvas.clientHeight;
    rocketCamera.updateProjectionMatrix();
    rocketRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

/**
 * 动画循环
 */
function animate() {
    requestAnimationFrame(animate);

    if (rocketModel) {
        rocketModel.rotation.y += 0.01;
    }

    if (rocketRenderer && rocketScene && rocketCamera) {
        rocketRenderer.render(rocketScene, rocketCamera);
    }
}

/**
 * 初始化视频播放器功能
 */
function setupVideoPlayer() {
    const launchDetailBtn = document.getElementById('launch-detail-btn');
    const videoPlayer = document.getElementById('video-player');
    const closeVideoBtn = document.getElementById('close-video-btn');
    const launchVideo = document.getElementById('launch-video');
    const content = document.querySelector('.page:nth-child(3) .content');

    if (!launchDetailBtn || !videoPlayer || !closeVideoBtn || !launchVideo || !content) return;

    launchDetailBtn.addEventListener('click', () => {
        content.classList.add('fade-out');
        setTimeout(() => {
            videoPlayer.classList.add('active');
            launchVideo.play();
        }, 500);
    });

    closeVideoBtn.addEventListener('click', () => {
        launchVideo.pause();
        launchVideo.currentTime = 0;
        videoPlayer.classList.remove('active');
        setTimeout(() => {
            content.classList.remove('fade-out');
        }, 500);
    });

    launchVideo.addEventListener('ended', () => {
        videoPlayer.classList.remove('active');
        setTimeout(() => {
            content.classList.remove('fade-out');
        }, 500);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector('.header');
    const container = document.querySelector('.container');
    const lastPageContentStarContainer = document.querySelector('.page:nth-child(3) .content .star-bg');
    const bgContainer = document.querySelector('.page:nth-child(1) .bg');

    new HeaderController(header, { container });

    new StarBackground(lastPageContentStarContainer, {
        starCount: 200,
        starSizeMin: 0.08,
        starSizeMax: 0.16,
        xSpeed: 0.0002,
        ySpeed: 0.0002,
        elapsed: 0,
    });

    new StarBackground(bgContainer, {
        starCount: 500,
        starSizeMin: 0.10,
        starSizeMax: 0.20,
        xSpeed: 0.0002,
        ySpeed: 0.0002,
        elapsed: 0,
    });

    new MeteorEffect(bgContainer, {
        maxMeteors: 20,
    });



    setupVideoPlayer();
    initRocketModel();
});