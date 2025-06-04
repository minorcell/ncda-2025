let rocketScene, rocketCamera, rocketRenderer;
let rocketModel;
let clock = new THREE.Clock();
let launchAnimationActive = false;
let countdownInterval;
let currentLaunchStage = 0;
let arrowAnimation;

/**
 * 初始化Three.js场景和加载3D模型
 */
function initRocketModel() {
    const canvas = document.querySelector('.rocket');
    if (!canvas) return;

    // 创建场景
    rocketScene = new THREE.Scene();

    // 创建透视相机
    rocketCamera = new THREE.PerspectiveCamera(14, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
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
            rocketModel.scale.set(1, 1, 1);

            // 遍历模型，设置阴影投射和接收，并调整材质
            rocketModel.traverse((object) => {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                    if (object.material.isMeshStandardMaterial) {
                        object.material.roughness = 0.1; // 调整粗糙度
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
            modelGroup.position.x = -1;

            // 更新模型变量为组
            rocketModel = modelGroup;

            // 显示canvas和火箭信息元素，实现渐显效果
            setTimeout(() => {
                const canvas = document.querySelector('.rocket');
                const rocketInfo = document.querySelector('.rocket-info');

                if (canvas) {
                    canvas.style.opacity = '1';
                }

                if (rocketInfo) {
                    rocketInfo.style.opacity = '1';
                }
            }, 100);

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
        rocketModel.rotation.y += 0.015;
    }

    if (rocketRenderer && rocketScene && rocketCamera) {
        rocketRenderer.render(rocketScene, rocketCamera);
    }
}

/**
 * 初始化火箭发射动画
 */
function initLaunchAnimation() {
    const parts = document.querySelectorAll('.page:nth-child(2) .parts .part');
    const digitElement = document.querySelector('.page:nth-child(2) .time .digit');
    const secondElement = document.querySelector('.page:nth-child(2) .time .second');
    const arrow = document.querySelector('.page:nth-child(2) .process .arrow');

    if (!parts.length || !digitElement || !secondElement || !arrow) return;

    // 初始设置，先给箭头设置底部位置和透明度
    arrow.classList.add('reset'); // 添加reset类以禁用过渡
    arrow.style.bottom = '0';
    arrow.style.opacity = '0';
    
    // 初始化其他元素
    digitElement.textContent = '0';
    secondElement.textContent = '分钟';
    
    parts.forEach(part => {
        part.style.opacity = '0.1';
    });
    
    // 等待一小段时间，确保元素都加载完成
    setTimeout(() => {
        // 直接开始发射序列而不是倒计时
        startLaunchSequence();
    }, 500);
}

/**
 * 重置火箭发射动画
 */
function resetLaunchAnimation() {
    const parts = document.querySelectorAll('.page:nth-child(2) .parts .part');
    const digitElement = document.querySelector('.page:nth-child(2) .time .digit');
    const secondElement = document.querySelector('.page:nth-child(2) .time .second');
    const arrow = document.querySelector('.page:nth-child(2) .process .arrow');
    
    if (!parts.length || !digitElement || !secondElement || !arrow) return;

    // 清除任何现有的时间计数器和动画
    if (countdownInterval) clearInterval(countdownInterval);
    if (arrowAnimation) clearTimeout(arrowAnimation);
    
    // 首先让箭头渐隐
    arrow.style.opacity = '0';
    
    // 等待透明度过渡完成
    setTimeout(() => {
        // 添加reset类以禁用过渡效果
        arrow.classList.add('reset');
        
        // 重置箭头位置
        arrow.style.bottom = '0';
    }, 800); // 与透明度过渡时间一致
    
    // 重置时间显示为0分钟
    digitElement.textContent = '0';
    secondElement.textContent = '分钟';
    
    // 隐藏所有部分
    parts.forEach(part => {
        part.style.opacity = '0.1';
    });
    
    // 重置状态变量
    launchAnimationActive = false;
    currentLaunchStage = 0;
}



/**
 * 开始火箭发射序列
 */
function startLaunchSequence() {
    const parts = document.querySelectorAll('.page:nth-child(2) .parts .part');
    const digitElement = document.querySelector('.page:nth-child(2) .time .digit');
    const secondElement = document.querySelector('.page:nth-child(2) .time .second');
    const arrow = document.querySelector('.page:nth-child(2) .process .arrow');
    
    if (!parts.length || !digitElement || !secondElement || !arrow) return;
    
    // 防止多次启动
    if (launchAnimationActive) return;
    launchAnimationActive = true;
    
    // 各阶段显示的持续时间（毫秒）
    const stageDuration = 1500;
    const totalAnimationTime = parts.length * stageDuration; // 总动画时间（毫秒）
    const timeInterval = 50; // 更新时间的间隔（毫秒）
    
    // 更新时间显示为分钟
    digitElement.textContent = '0';
    secondElement.textContent = '分钟';
    
    // 启动发射时间计数器
    let elapsedTime = 0;
    const incrementPerInterval = 56 / (totalAnimationTime / timeInterval);
    
    countdownInterval = setInterval(() => {
        elapsedTime += incrementPerInterval;
        const minutes = Math.floor(elapsedTime);
        digitElement.textContent = minutes;
        
        if (minutes >= 56) {
            digitElement.textContent = '56';
            clearInterval(countdownInterval);
        }
    }, timeInterval);
    
    // 首先确保箭头在底部且隐藏状态
    arrow.classList.add('reset'); // 先添加reset防止过渡
    arrow.style.bottom = '0';
    arrow.style.opacity = '0';
    
    // 下一帧中移除reset，并显示箭头
    requestAnimationFrame(() => {
        // 移除reset类，允许过渡效果
        arrow.classList.remove('reset');
        
        // 先显示箭头
        arrow.style.opacity = '1';
        
        // 等待箭头显示出来后，开始上升动画
        setTimeout(() => {
            arrow.style.bottom = '90vh'; // 移动到顶部
        }, 300);
    });
    
    // 显示第一个阶段
    showLaunchStage(0);
    
    // 依次显示其他阶段
    for (let i = 1; i < parts.length; i++) {
        setTimeout(() => showLaunchStage(i), i * stageDuration);
    }
    
    // 全部阶段完成后重置动画
    setTimeout(() => {
        resetLaunchAnimation();
        // 短暂延迟后重新开始
        setTimeout(() => startLaunchSequence(), 2000);
    }, totalAnimationTime + 1000);
}

/**
 * 显示特定的发射阶段，同时隐藏其他阶段
 */
function showLaunchStage(stageIndex) {
    const parts = document.querySelectorAll('.page:nth-child(2) .parts .part');
    const stageInfo = document.querySelectorAll('.page:nth-child(2) .parts .part .stage-info');
    if (!parts.length || stageIndex < 0 || stageIndex >= parts.length) return;
    
    // 更新当前阶段
    currentLaunchStage = stageIndex;
    
    // 隐藏所有部分
    parts.forEach(part => {
        part.style.opacity = '0.1';
        stageInfo.forEach(info => {
            info.style.opacity = '0';
        });
    });
    
    // 显示当前阶段
    parts[stageIndex].style.opacity = '1';
    stageInfo[stageIndex].style.opacity = '1';
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

document.addEventListener("DOMContentLoaded", function() {
    // 检查并初始化火箭模型
    initRocketModel();
    
    // 设置视频播放器功能
    setupVideoPlayer();
    
    // 初始化火箭发射动画
    initLaunchAnimation();
    
    const header = document.querySelector('.header');
    const lastPageContentStarContainer = document.querySelector('.page:nth-child(3) .content .star-bg');
    const bgContainer = document.querySelector('.page:nth-child(1) .bg');

    new HeaderController(header);

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
});