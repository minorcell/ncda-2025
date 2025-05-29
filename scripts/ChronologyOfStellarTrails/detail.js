const container = document.querySelector(".star-bg");
const lastCircle = document.querySelector(".last-circle");
const nextCircle = document.querySelector(".next-circle");
const orbitalCircles = document.querySelectorAll('.orbital-circle');

const missionData = [
  {
    id: 1,
    rocketName: "神舟六号",
    launchDate: "20051012",
    people: [
      {
        name: "费俊龙",
        imgSrc: "../assets/images/ChronologyOfStellarTrails/first.webp",
      },
      {
        name: "聂海胜",
        imgSrc: "../assets/images/ChronologyOfStellarTrails/second.webp",
      }
    ],
    missionStartDate: "2005.10.12 09:00",
    flyTime: "4天19小时32分",
    missionEndDate: "2005.10.17 04:32",
    description: "公元2005年10月12日神舟六号飞船搭载航天员费俊龙、聂海胜成功发射升空进入预定轨道。2005年10月17日返回舱在内蒙古中部预定区域成功着陆，完成了多人多天航天飞行的任务。神舟六号载人航天飞行的成功实现顺利开局，是中国载人航天工程继神舟五号首次载人飞行之后取得的又一具有里程碑意义的重大成果。"
  },
  {
    id: 2,
    rocketName: "神舟七号",
    launchDate: "20051012",
    people: [
      {
        name: "费俊龙",
        imgSrc: "../assets/images/ChronologyOfStellarTrails/first.webp",
      },
      {
        name: "聂海胜",
        imgSrc: "../assets/images/ChronologyOfStellarTrails/second.webp",
      }
    ],
    missionStartDate: "2005.10.12 09:00",
    flyTime: "4天19小时32分",
    missionEndDate: "2005.10.17 04:32",
    description: "公元2005年10月12日神舟六号飞船搭载航天员费俊龙、聂海胜成功发射升空进入预定轨道。2005年10月17日返回舱在内蒙古中部预定区域成功着陆，完成了多人多天航天飞行的任务。神舟六号载人航天飞行的成功实现顺利开局，是中国载人航天工程继神舟五号首次载人飞行之后取得的又一具有里程碑意义的重大成果。"
  },
  {
    id: 3,
    rocketName: "神舟八号",
    launchDate: "20051012",
    people: [
      {
        name: "费俊龙",
        imgSrc: "../assets/images/ChronologyOfStellarTrails/first.webp",
      },
      {
        name: "聂海胜",
        imgSrc: "../assets/images/ChronologyOfStellarTrails/second.webp",
      }
    ],
    missionStartDate: "2005.10.12 09:00",
    flyTime: "4天19小时32分",
    missionEndDate: "2005.10.17 04:32",
    description: "公元2005年10月12日神舟六号飞船搭载航天员费俊龙、聂海胜成功发射升空进入预定轨道。2005年10月17日返回舱在内蒙古中部预定区域成功着陆，完成了多人多天航天飞行的任务。神舟六号载人航天飞行的成功实现顺利开局，是中国载人航天工程继神舟五号首次载人飞行之后取得的又一具有里程碑意义的重大成果。"
  },
];

let currentMissionIndex = 0;

// 更新页面内容的函数
function updateMissionContent(index) {
  const mission = missionData[index];
  if (!mission) return;

  // 更新标题和日期
  document.querySelector('.header h1').textContent = mission.rocketName;
  document.querySelector('.date').textContent = mission.launchDate.replace(/(.{4})(.{2})(.{2})/, '$1 $2 $3');

  // 更新宇航员信息
  const astronautsContainer = document.querySelector('.astronauts');
  let astronautsHTML = '<div class="astronauts-introduction">宇航员</div>';
  mission.people.forEach(person => {
    astronautsHTML += `
            <div class="astronaut">
                <img src="${person.imgSrc}" alt="${person.name}">
                <p>${person.name}</p>
            </div>
        `;
  });
  astronautsContainer.innerHTML = astronautsHTML;

  // 更新任务详情
  const missionContent = document.querySelector('.mission-content');
  missionContent.innerHTML = `
        <p>起飞时: ${mission.missionStartDate}</p>
        <p>飞行时间: ${mission.flyTime}</p>
        <p>降落时: ${mission.missionEndDate}</p>
    `;

  // 更新描述
  document.querySelector('.description').textContent = mission.description;

  // 添加过渡动画
  const elements = ['.header', '.astronauts', '.mission-details', '.description'];
  elements.forEach(selector => {
    const element = document.querySelector(selector);
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    setTimeout(() => {
      element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 50);
  });
}

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

function StartBackground() {
  // 创建星空背景
  new StarBackground(container, {
    starCount: 1000,
    starSizeMin: 0.04,
    starSizeMax: 0.12,
    xSpeed: 0.00005,
    ySpeed: 0.00005,
    elapsed: 0,
  });

  // 创建流星效果
  new MeteorEffect(container, {
    maxMeteors: 20,
    zIndex: 1,
    meteor: {
      startXMin: 10,
      startXMax: 20,
      startYMin: 10,
      startYMax: 40,
      lengthMin: 10,
      lengthMax: 25,
      widthMin: 0.1,
      widthMax: 0.2,
      angleMin: 150,
      angleMax: 180,
      speedMin: 0.5,
      speedMax: 1,
      tailLengthMin: 1.2,
      tailLengthMax: 2,
    },
  });
}

function HandleCircleClick() {
  lastCircle.addEventListener("click", function () {
    if (currentMissionIndex > 0) {
      currentMissionIndex--;
    } else {
      currentMissionIndex = missionData.length - 1; // 循环到最后一个
    }
    updateMissionContent(currentMissionIndex);
  });

  nextCircle.addEventListener("click", function () {
    if (currentMissionIndex < missionData.length - 1) {
      currentMissionIndex++;
    } else {
      currentMissionIndex = 0; // 循环回到第一个
    }
    updateMissionContent(currentMissionIndex);
  });
}


document.addEventListener("DOMContentLoaded", function () {
  // 初始化页面内容
  updateMissionContent(currentMissionIndex);

  // 初始化星空背景和流星效果
  StartBackground();

  // 初始化轨道动画
  initOrbitAnimation();

  // 处理导航按钮点击
  HandleCircleClick();
});
