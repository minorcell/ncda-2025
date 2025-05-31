let scene, camera, renderer;
let rocketModel;

function initThreeJS() {
    // 创建场景
    scene = new THREE.Scene();
    scene.background = null; // 透明背景

    // 创建相机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(400, 600); // 设置大小以匹配原始图片尺寸
    renderer.setClearColor(0x000000, 0);

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // 替换图片为canvas
    const rocketImage = document.querySelector('.rocket');
    const rocketContainer = rocketImage.parentElement;
    rocketContainer.replaceChild(renderer.domElement, rocketImage);
    renderer.domElement.classList.add('rocket');
}

function LoadRocketModelForFirstPage() {
    const loader = new THREE.OBJLoader();
    loader.load(
        '../../assets/models/Rocket.obj',
        function (object) {
            rocketModel = object;
            // 中心化模型
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            object.position.sub(center);

            // 按比例缩放模型
            const scale = 2.0;
            object.scale.set(scale, scale, scale);

            // 旋转模型以匹配线稿方向
            object.rotation.y = Math.PI / 4;

            scene.add(object);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.log('Error loading model:', error);
        }
    );
}

function animate() {
    requestAnimationFrame(animate);
    if (rocketModel) {
        rocketModel.rotation.y += 0.005; // 慢慢旋转火箭
    }
    renderer.render(scene, camera);
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

    initThreeJS();
    LoadRocketModelForFirstPage();
    animate();

    // 初始化视频播放器功能
    setupVideoPlayer();
});