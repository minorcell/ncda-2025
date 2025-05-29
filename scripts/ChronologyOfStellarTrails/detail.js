// 选择类名为 right-circle 的元素，并将它们存储在 rightCircles 变量中
const rightCircles = document.querySelectorAll(".right-circle");
// 遍历 rightCircles 中的每个元素
rightCircles.forEach((circle) => {
  // 为每个元素添加点击事件监听器
  circle.addEventListener("click", function () {
    // 当元素被点击时，为其添加 'clicked' 类
    this.classList.add("clicked");
    // 设置一个定时器，在 500 毫秒后执行回调函数
    setTimeout(() => {
      // 定时器到期后，移除元素的 'clicked' 类
      this.classList.remove("clicked");
    }, 500);
  });
});
// ... existing code ...

const rightcircles = document.querySelectorAll(".right-circle");
// 获取当前页面的路径
const currentPagePath = window.location.pathname;
// 使用正则表达式提取当前页面编号，假设页面命名规则为 ChronologyOfStellarTrailsDetailsX.html
const match = currentPagePath.match(
  /ChronologyOfStellarTrailsDetails(\d+)\.html/
);
// 如果匹配成功，将提取到的编号转换为整数；否则默认页面编号为 1
const currentPageNumber = match ? parseInt(match[1], 10) : 1;

// 遍历 rightCircles 中的每个元素，为每个元素添加页面跳转功能
rightCircles.forEach((circle) => {
  // 为每个元素添加点击事件监听器
  circle.addEventListener("click", function () {
    // 定义新页面的编号变量
    let newPageNumber;
    // 判断点击的是向上箭头还是向下箭头
    if (this.textContent === "↑") {
      // 如果是向上箭头，计算新页面编号，确保不小于 1
      newPageNumber = Math.max(1, currentPageNumber - 1);
    } else if (this.textContent === "↓") {
      // 如果是向下箭头，计算新页面编号，确保不大于 9
      newPageNumber = Math.min(9, currentPageNumber + 1);
    }

    // 如果新页面编号存在，则进行页面跳转
    if (newPageNumber !== undefined) {
      // 生成新页面的路径
      const newPagePath = `ChronologyOfStellarTrailsDetails${newPageNumber}.html`;
      // 跳转到新页面
      window.location.href = newPagePath;
    }
  });
});

const container = document.querySelector(".star-bg");
if (container) {
  new StarBackground(container, {
    starCount: 1000, // 星星数量
    starSizeMin: 0.04, // 最小星星尺寸
    starSizeMax: 0.12, // 最大星星尺寸
    xSpeed: 0.00005, // X轴旋转速度
    ySpeed: 0.00005, // Y轴旋转速度
    elapsed: 0, // 初始动画时间
  });
} else {
  console.error("未找到对应的容器元素");
}

const containers = document.querySelector(".star-bg");
if (containers) {
  new MeteorEffect(container, {
    maxMeteors: 20, // 同时存在的最大流星数量
    zIndex: 1, // 容器层级
    meteor: {
      // 起始位置配置
      startXMin: 10, // X坐标最小值
      startXMax: 20, // X坐标最大值
      startYMin: 10, // Y坐标最小值
      startYMax: 40, // Y坐标最大值

      // 流星外观配置
      lengthMin: 10, // 长度最小值
      lengthMax: 25, // 长度最大值
      widthMin: 0.1, // 宽度最小值
      widthMax: 0.2, // 宽度最大值

      // 运动参数配置
      angleMin: 150, // 运动角度最小值
      angleMax: 180, // 运动角度最大值
      speedMin: 0.5, // 速度最小值
      speedMax: 1, // 速度最大值

      // 尾迹效果配置
      tailLengthMin: 1.2, // 尾迹长度系数最小值
      tailLengthMax: 2, // 尾迹长度系数最大值
    },
  });
} else {
  console.error("未找到对应的容器元素");
}
