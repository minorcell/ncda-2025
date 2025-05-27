document.addEventListener('DOMContentLoaded', () => {
  const timeline = document.querySelector('.timeline');
  const timelineItems = document.querySelectorAll('.item-left, .item-right');
  const itemPositions = [];

  // 获取每个时间轴项目的垂直位置
  timelineItems.forEach(item => {
    const rect = item.getBoundingClientRect();
    const top = rect.top + window.pageYOffset;
    itemPositions.push(top);
  });

  // 监听滚动事件
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    let closestIndex = 0;
    let minDistance = Math.abs(itemPositions[0] - scrollTop);

    // 找到离当前滚动位置最近的时间轴项目
    for (let i = 1; i < itemPositions.length; i++) {
      const distance = Math.abs(itemPositions[i] - scrollTop);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    // 计算加粗线的新 top 值
    const timelineRect = timeline.getBoundingClientRect();
    const timelineTop = timelineRect.top + window.pageYOffset;
    const newTop = itemPositions[closestIndex] - timelineTop;

    // 设置自定义属性
    timeline.style.setProperty('--timeline-after-top', `${newTop}px`);
  });
});

const container = document.getElementById('star')
if (container) {
  const StarBackgroundInstance = new StarBackground(container, {
    starCount: 500,     // 星星数量
    starSizeMin: 0.04,   // 最小星星尺寸
    starSizeMax: 0.12,   // 最大星星尺寸
    xSpeed: 0.00005,     // X轴旋转速度
    ySpeed: 0.00005,     // Y轴旋转速度
    elapsed: 0           // 初始动画时间
  });
}
else {
  console.error('未找到对应的容器元素');

}

const containers = document.getElementById('star')
if (containers) {
  new MeteorEffect(container, {
    maxMeteors: 15,      // 同时存在的最大流星数量
    zIndex: 1,           // 容器层级
    meteor: {
      // 起始位置配置
      startXMin: 0,   // X坐标最小值
      startXMax: 10,  // X坐标最大值
      startYMin: 0,    // Y坐标最小值
      startYMax: 30,   // Y坐标最大值

      // 流星外观配置
      lengthMin: 5,   // 长度最小值
      lengthMax: 15,   // 长度最大值
      widthMin: 0.1,   // 宽度最小值
      widthMax: 0.2,   // 宽度最大值

      // 运动参数配置
      angleMin: 150,   // 运动角度最小值
      angleMax: 180,   // 运动角度最大值
      speedMin: 0.5,     // 速度最小值
      speedMax: 1,     // 速度最大值

      // 尾迹效果配置
      tailLengthMin: 1.2,  // 尾迹长度系数最小值
      tailLengthMax: 2     // 尾迹长度系数最大值
    }
  });
}
else {
  console.error('未找到对应的容器元素')
}

