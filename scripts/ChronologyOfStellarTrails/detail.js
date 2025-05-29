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

let currentMissionIndex = 0;

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
function updateMissionContent(index) {
  const mission = missionData[index];
  if (!mission) return;

  // Apply fade-out animation
  infoContainer.style.animation = 'none'; // Reset animation to allow re-trigger
  infoContainer.style.opacity = '0';

  setTimeout(() => {
    // Update Logo
    missionLogo.src = mission.logoSrc;
    missionLogo.alt = mission.rocketName + " logo";

    // Update Rocket Name
    missionRocketName.textContent = mission.rocketName;

    // Update Launch Date
    missionLaunchDate.textContent = mission.launchDate;

    // Update Astronauts
    // Clear existing astronauts, keeping the title
    const peopleElements = missionPeoplesContainer.querySelectorAll('.people');
    peopleElements.forEach(el => el.remove());

    mission.people.forEach(person => {
      const personDiv = document.createElement('div');
      personDiv.classList.add('people');
      personDiv.innerHTML = `
        <img src="${person.imgSrc}" alt="宇航员 ${person.name}" class="avatar">
        <h3 class="name">${person.name}</h3>
      `;
      missionPeoplesContainer.appendChild(personDiv);
    });

    // Update Launch Info
    missionLaunchInfoContainer.innerHTML = `
      <h3>起飞时间：${mission.missionStartDate}</h3>
      <h3>飞行时长：${mission.flyTime}</h3>
      <h3>降落时间：${mission.missionEndDate}</h3>
    `;

    // Update Description
    missionDetailContent.textContent = mission.description;

    // Apply fade-in animation
    infoContainer.style.opacity = '1';
    infoContainer.style.animation = 'slide-in-bck-center 1s ease-in-out forwards';
  }, 300); // Delay to allow fade-out to be visible
}

// 处理导航按钮点击
function handleNavigation() {
  lastCircle.addEventListener("click", function () {
    currentMissionIndex--;
    if (currentMissionIndex < 0) {
      currentMissionIndex = missionData.length - 1; // Loop to the last item
    }
    updateMissionContent(currentMissionIndex);
  });

  nextCircle.addEventListener("click", function () {
    currentMissionIndex++;
    if (currentMissionIndex >= missionData.length) {
      currentMissionIndex = 0; // Loop to the first item
    }
    updateMissionContent(currentMissionIndex);
  });
}

// 初始化页面
document.addEventListener("DOMContentLoaded", function () {
  // 初始化星空背景和流星效果
  StartBackground();

  // 初始化轨道动画
  initOrbitAnimation();

  // 初始化页面内容
  updateMissionContent(currentMissionIndex);

  // 处理导航按钮点击
  handleNavigation();
});
