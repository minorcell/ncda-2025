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

