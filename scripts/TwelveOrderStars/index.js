// 使用threejs加载rocket_model.glb模型
let rocketScene, rocketCamera, rocketRenderer;
let rocketModel;
let mixer; // 用于动画混合器
let clock = new THREE.Clock(); // 用于跟踪时间以更新动画
let controls; // 轨道控制器

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
    rocketCamera.position.set(0, 0, 10); // 调整相机位置以便看到模型

    // 创建渲染器
    rocketRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true // 透明背景
    });
    rocketRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    rocketRenderer.setPixelRatio(window.devicePixelRatio);

    // 添加辅助线
    // 添加坐标轴辅助线 - 红色是X轴，绿色是Y轴，蓝色是Z轴
    const axesHelper = new THREE.AxesHelper(5);
    rocketScene.add(axesHelper);

    // 添加网格辅助线
    const gridHelper = new THREE.GridHelper(10, 10);
    rocketScene.add(gridHelper);

    // 添加轨道控制器以便于调试时旋转场景
    controls = new THREE.OrbitControls(rocketCamera, canvas);
    controls.enableDamping = true; // 添加阻尼效果
    controls.dampingFactor = 0.05;

    // 添加环境光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    rocketScene.add(ambientLight);

    // 添加平行光源模拟太阳光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    rocketScene.add(directionalLight);

    // 添加点光源以突出火箭细节
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 2, 3);
    rocketScene.add(pointLight);

    // 加载3D模型
    const loader = new THREE.GLTFLoader();
    loader.load(
        '../assets/models/rocket_model.glb',
        (gltf) => {
            rocketModel = gltf.scene;

            // 调整模型尺寸和位置
            rocketModel.scale.set(4, 4, 4); // 根据实际模型调整缩放比例

            // 计算模型的边界框以确定中心点
            const box = new THREE.Box3().setFromObject(rocketModel);
            const center = box.getCenter(new THREE.Vector3());

            // 将模型移至原点（以便于绕自身中心旋转）
            rocketModel.position.set(-center.x, -center.y, -center.z);

            // 创建一个组来包含模型，使其能够绕中心旋转
            const modelGroup = new THREE.Group();
            modelGroup.add(rocketModel);

            // 将组添加到场景中
            rocketScene.add(modelGroup);

            // 将模型变量更新为组，以便后续操作
            rocketModel = modelGroup;

            // 注意：模型已经在上面通过modelGroup添加到场景中

            // 处理动画
            if (gltf.animations && gltf.animations.length) {
                mixer = new THREE.AnimationMixer(rocketModel);
                const action = mixer.clipAction(gltf.animations[0]);
                action.play();
            }

            // 自动旋转展示模型
            animate();
        },
        (xhr) => {
            // 加载进度
            const loadingProgress = Math.floor((xhr.loaded / xhr.total) * 100) + '%';
            console.log('Loading model: ' + loadingProgress);
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

    // 更新相机宽高比
    rocketCamera.aspect = canvas.clientWidth / canvas.clientHeight;
    rocketCamera.updateProjectionMatrix();

    // 更新渲染器大小
    rocketRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

/**
 * 动画循环
 */
function animate() {
    requestAnimationFrame(animate);

    if (rocketModel) {
        // 旋转模型以展示各个角度（绕Y轴旋转）
        rocketModel.rotation.y += 0.010;
    }

    // 更新轨道控制器
    if (controls) {
        controls.update();
    }

    // 更新动画混合器
    if (mixer) {
        mixer.update(clock.getDelta());
    }

    // 渲染场景
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

    // 点击发射纪实按钮
    launchDetailBtn.addEventListener('click', () => {
        // 添加淘出效果类
        content.classList.add('fade-out');

        // 延迟显示视频播放器，等待内容淘出效果完成
        setTimeout(() => {
            // 显示视频播放器
            videoPlayer.classList.add('active');
            // 自动播放视频
            launchVideo.play();
        }, 500); // 设置为500ms，与 CSS 过渡效果时间一致
    });

    // 点击关闭按钮
    closeVideoBtn.addEventListener('click', () => {
        // 暂停视频并重置到开头
        launchVideo.pause();
        launchVideo.currentTime = 0;

        // 隐藏视频播放器
        videoPlayer.classList.remove('active');

        // 延迟显示内容，等待视频播放器隐藏效果完成
        setTimeout(() => {
            // 移除淘出效果类，使内容重新显示
            content.classList.remove('fade-out');
        }, 500);
    });

    // 当视频播放结束时自动关闭视频播放器
    launchVideo.addEventListener('ended', () => {
        // 隐藏视频播放器
        videoPlayer.classList.remove('active');

        // 延迟显示内容，等待视频播放器隐藏效果完成
        setTimeout(() => {
            // 移除淘出效果类，使内容重新显示
            content.classList.remove('fade-out');
        }, 500);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector('.header');
    const container = document.querySelector('.container');
    const lastPageContentStarContainer = document.querySelector('.page:nth-child(3) .content .star-bg');

    new HeaderController(header, { container });

    new StarBackground(lastPageContentStarContainer, {
        starCount: 200,
        starSizeMin: 0.08,
        starSizeMax: 0.16,
        xSpeed: 0.0002,
        ySpeed: 0.0002,
        elapsed: 0,
    });

    // 初始化视频播放器功能
    setupVideoPlayer();

    // 初始化3D火箭模型
    initRocketModel();
});