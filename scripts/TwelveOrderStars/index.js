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

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector('.header');
    const container = document.querySelector('.container');

    new HeaderController(header, { container });

    initThreeJS();
    LoadRocketModelForFirstPage();
    animate();
});