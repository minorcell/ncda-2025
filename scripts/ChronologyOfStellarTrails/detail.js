const container = document.querySelector(".star-bg");
const orbitalCircles = document.querySelectorAll('.orbital-circle');
const lastCircle = document.querySelector(".last-circle");
const nextCircle = document.querySelector(".next-circle");

const infoContainer = document.querySelector('.info');
const missionLogo = document.querySelector('.info .intro .left .logo');
const missionRocketName = document.querySelector('.info .intro .left .roctet-name');
const missionLaunchDate = document.querySelector('.info .intro .left .launch-date');
const missionPeoplesContainer = document.querySelector('.info .intro .right .peoples');
const missionLaunchInfoContainer = document.querySelector('.info .intro .right .launch-info');
const missionDetailContent = document.querySelector('.info .detail-content');

let currentMissionIndex = 0; // 当前任务索引
let isAnimating = false; // 是否正在执行动画的标志
const animationDuration = 300; // 动画持续时间 (毫秒), 如果CSS中的动画时间修改了，这里也需要对应调整

const missionData = [
  {
    id: 1,  // id
    logoSrc: "../assets/images/ChronologyOfStellarTrails/shenzhouliuhaologo.webp",  // 任务logo
    rocketName: "神舟六号",  // 火箭名称
    launchDate: "2005 10 12",  // 发射日期
    people: [  // 参与人员
      {
        name: "费俊龙",  // 姓名
        imgSrc: "../assets/images/ChronologyOfStellarTrails/feijunlong.webp",  // 头像图片路径
      },
      {
        name: "聂海胜",
        imgSrc: "../assets/images/ChronologyOfStellarTrails/niehaisheng.webp",
      }
    ],
    missionStartDate: "2005.10.12 09:00",  // 起飞时间
    flyTime: "4天19小时32分",  // 飞行市场
    missionEndDate: "2005.10.17 09:00",  // 着陆时间
    description: "公元2005年10月12日神舟六号飞船搭载航天员费俊龙、聂海胜成功发射升空进入预定轨道。2005年10月17日返回舱在内蒙古中部预定区域成功着陆，完成了多人多天航天飞行的任务。神舟六号载人航天飞行的成功实现顺利开局，是中国载人航天工程继神舟五号首次载人飞行之后取得的又一具有里程碑意义的重大成果。"  // 任务描述
  },
  {
    id: 2,  // id
    logoSrc: "../assets/images/ChronologyOfStellarTrails/shenzhouliuhaologo.webp",  // 任务logo
    rocketName: "神舟七号",  // 火箭名称
    launchDate: "2008 09 25",  // 发射日期
    people: [  // 参与人员
      {
        name: "翟志刚",  // 姓名
        imgSrc: "../assets/images/ChronologyOfStellarTrails/feijunlong.webp",  // 头像图片路径
      },
      {
        name: "刘伯明",
        imgSrc: "../assets/images/ChronologyOfStellarTrails/niehaisheng.webp",
      }
    ],
    missionStartDate: "2008.09.25 09:00",  // 起飞时间
    flyTime: "4天19小时32分",  // 飞行市场
    missionEndDate: "2008.09.25 09:00",  // 着陆时间
    description: "公元2008年9月25日神舟七号飞船搭载航天员翟志刚、刘伯明成功发射升空进入预定轨道。2008年9月25日返回舱在内蒙古中部预定区域成功着陆，完成了多人多天航天飞行的任务。神舟七号载人航天飞行的成功实现顺利开局，是中国载人航天工程继神舟五号首次载人飞行之后取得的又一具有里程碑意义的重大成果。"  // 任务描述
  },
  {
    id: 3,  // id
    logoSrc: "../assets/images/ChronologyOfStellarTrails/shenzhouliuhaologo.webp",  // 任务logo
    rocketName: "神舟八号",  // 火箭名称
    launchDate: "2011 11 09",  // 发射日期
    people: [  // 参与人员
      {
        name: "景海鹏",  // 姓名
        imgSrc: "../assets/images/ChronologyOfStellarTrails/feijunlong.webp",  // 头像图片路径
      },
      {
        name: "刘洋",
        imgSrc: "../assets/images/ChronologyOfStellarTrails/niehaisheng.webp",
      }
    ],
    missionStartDate: "2011.11.09 09:00",  // 起飞时间
    flyTime: "4天19小时32分",  // 飞行市场
    missionEndDate: "2011.11.14 09:00",  // 着陆时间
    description: "公元2011年11月9日神舟八号飞船搭载航天员翟志刚、刘伯明成功发射升空进入预定轨道。2011年11月14日返回舱在内蒙古中部预定区域成功着陆，完成了多人多天航天飞行的任务。神舟八号载人航天飞行的成功实现顺利开局，是中国载人航天工程继神舟五号首次载人飞行之后取得的又一具有里程碑意义的重大成果。"  // 任务描述
  },
]

// 初始化轨道动画
function initOrbitAnimation() {
  // 首先清除所有已有的点
  orbitalCircles.forEach(circle => {
    // 保留轨道圆，清除所有点
    while (circle.firstChild) {
      circle.removeChild(circle.firstChild);
    }
  });

  // 获取轨道容器的尺寸
  const orbitContainer = document.querySelector('.orbital');
  const containerWidth = orbitContainer.offsetWidth;
  const containerHeight = orbitContainer.offsetHeight;

  // 每个轨道圆的大小比例数组
  const sizeRatios = [2 / 12, 3 / 12, 4.5 / 12, 6.5 / 12, 9 / 12, 12 / 12];

  // 为每个轨道圆设置不同的旋转速度和点
  orbitalCircles.forEach((circle, index) => {
    // 计算每个轨道的半径
    const ratio = sizeRatios[index];
    const diameter = Math.min(containerWidth, containerHeight) * ratio;
    const radius = diameter / 2;

    // 设置基础旋转速度和方向（偶数圈顺时针，奇数圈逆时针）
    const baseSpeed = 20;
    const speed = baseSpeed + (index * 5);
    const direction = index % 2 === 0 ? 1 : -1; // 1顺时针，-1逆时针

    // 设置轨道圆的动画
    circle.style.animation = `orbit ${speed}s linear ${direction === 1 ? '' : 'reverse'} infinite`;

    // 在每个轨道上添加点
    const dotCount = index === 0 ? 0 : 3 + index; // 第一个轨道没有点，其他轨道点数递增

    for (let i = 0; i < dotCount; i++) {
      // 计算点的位置角度（均匀分布）
      const angle = (360 / dotCount) * i;
      const radian = (angle * Math.PI) / 180;

      // 创建新的点
      const dot = document.createElement('div');
      dot.className = 'dot';

      // 计算并设置点的位置
      const x = radius * Math.cos(radian);
      const y = radius * Math.sin(radian);

      dot.style.position = 'absolute';
      dot.style.left = `calc(50% + ${x}px)`;
      dot.style.top = `calc(50% + ${y}px)`;

      // 添加到轨道
      circle.appendChild(dot);
    }
  });
}

// 初始化星空背景和流星效果
function StartBackground() {
  // 创建星空背景
  new StarBackground(container, {
    starCount: 500,
    starSizeMin: 0.08,
    starSizeMax: 0.24,
    xSpeed: 0.0001,
    ySpeed: 0.0001,
    elapsed: 0,
  });

  // 创建流星效果
  new MeteorEffect(container, {
    maxMeteors: 20,
    zIndex: 1,
  });
}

// 更新页面内容的函数
function updateMissionContent(index, direction) { // index: 目标任务的索引, direction: 切换方向 ('next', 'prev', 'initial')
  if (isAnimating) return;
  isAnimating = true; // 设置动画标志为真

  const mission = missionData[index];
  if (!mission) { // 如果找不到任务数据
    isAnimating = false; // 重置动画标志
    return;
  }

  const performUpdate = () => {
    // 更新Logo
    missionLogo.src = mission.logoSrc;
    missionLogo.alt = mission.rocketName + " logo";
    // 更新火箭名称
    missionRocketName.textContent = mission.rocketName;
    // 更新发射日期
    missionLaunchDate.textContent = mission.launchDate;
    // 更新宇航员信息
    const peopleElements = missionPeoplesContainer.querySelectorAll('.people');
    peopleElements.forEach(el => el.remove()); // 清除已有的宇航员元素 (保留标题)
    mission.people.forEach(person => {
      const personDiv = document.createElement('div');
      personDiv.classList.add('people');
      personDiv.innerHTML = `
        <img src="${person.imgSrc}" alt="宇航员 ${person.name}" class="avatar">
        <h3 class="name">${person.name}</h3>
      `;
      missionPeoplesContainer.appendChild(personDiv);
    });
    // 更新发射信息
    missionLaunchInfoContainer.innerHTML = `
      <h3>起飞时间：${mission.missionStartDate}</h3>
      <h3>飞行时长：${mission.flyTime}</h3>
      <h3>降落时间：${mission.missionEndDate}</h3>
    `;
    // 更新任务描述
    missionDetailContent.textContent = mission.description;

    // 应用滑入动画
    let slideInAnimation = '';
    if (direction === 'next') {
      slideInAnimation = `slideInUpRotate ${animationDuration / 1000}s ease-in-out forwards`; // 新内容从底部向上滑入并旋转
    } else if (direction === 'prev') {
      slideInAnimation = `slideInDownRotate ${animationDuration / 1000}s ease-in-out forwards`; // 新内容从顶部向下滑入并旋转
    } else { // initial 初始加载
      slideInAnimation = `slideInUpRotate ${animationDuration / 1000}s ease-in-out forwards`; // 默认初始动画 (从底部向上滑入并旋转)
    }
    infoContainer.style.animation = 'none'; // 清除之前的动画状态，确保新动画能够触发
    requestAnimationFrame(() => { // 确保样式刷新后再应用新动画
      infoContainer.style.animation = slideInAnimation;
    });


    setTimeout(() => {
      isAnimating = false; // 动画结束后，重置动画标志
    }, animationDuration);
  };

  if (direction === 'initial') { // 如果是初始加载
    infoContainer.style.opacity = '0'; // 初始时设置为透明，以配合滑入动画
    performUpdate();
    requestAnimationFrame(() => { // 确保 opacity:0 已应用，再开始动画（设为1，动画本身会处理opacity）
      infoContainer.style.opacity = '1';
    });
  } else {
    let slideOutAnimation = '';
    if (direction === 'next') {
      slideOutAnimation = `slideOutUpRotate ${animationDuration / 1000}s ease-in-out forwards`; // 当前内容向上滑出并旋转
    } else if (direction === 'prev') {
      slideOutAnimation = `slideOutDownRotate ${animationDuration / 1000}s ease-in-out forwards`; // 当前内容向下滑出并旋转
    }
    infoContainer.style.animation = 'none';
    requestAnimationFrame(() => {
      infoContainer.style.animation = slideOutAnimation;
    });

    setTimeout(performUpdate, animationDuration); // 滑出动画结束后执行内容更新和滑入动画
  }
}

// 处理导航按钮点击
function handleNavigation() {
  lastCircle.addEventListener("click", function () {
    if (isAnimating) return;
    currentMissionIndex--;
    if (currentMissionIndex < 0) {
      currentMissionIndex = missionData.length - 1; // 循环到最后一个
    }
    updateMissionContent(currentMissionIndex, 'prev');
  });

  nextCircle.addEventListener("click", function () {
    if (isAnimating) return;
    currentMissionIndex++;
    if (currentMissionIndex >= missionData.length) {
      currentMissionIndex = 0; // 循环到第一个
    }
    updateMissionContent(currentMissionIndex, 'next');
  });
}

// 初始化页面
document.addEventListener("DOMContentLoaded", function () {
  StartBackground(); // 初始化星空背景和流星效果
  initOrbitAnimation(); // 初始化轨道动画
  updateMissionContent(currentMissionIndex, 'initial'); // 初始加载第一条任务数据
  handleNavigation(); // 设置导航按钮的点击事件监听
});
