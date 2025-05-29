const container = document.getElementById("star");
if (container) {
  const StarBackgroundInstance = new StarBackground(container, {
    starCount: 500, // 星星数量
    starSizeMin: 0.04, // 最小星星尺寸
    starSizeMax: 0.12, // 最大星星尺寸
    xSpeed: 0.00005, // X轴旋转速度
    ySpeed: 0.00005, // Y轴旋转速度
    elapsed: 0, // 初始动画时间
  });
} else {
  console.error("未找到对应的容器元素");
}

const containers = document.getElementById("star");
if (containers) {
  new MeteorEffect(container, {
    maxMeteors: 15, // 同时存在的最大流星数量
    zIndex: 1, // 容器层级
    meteor: {
      // 起始位置配置
      startXMin: 0, // X坐标最小值
      startXMax: 10, // X坐标最大值
      startYMin: 0, // Y坐标最小值
      startYMax: 30, // Y坐标最大值

      // 流星外观配置
      lengthMin: 5, // 长度最小值
      lengthMax: 15, // 长度最大值
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

document.addEventListener("DOMContentLoaded", () => {
  const timeline = document.querySelector(".timeline");
  const timelineItems = document.querySelectorAll(".item-left, .item-right");
  const firstItem = timelineItems[0];
  const lastItem = timelineItems[timelineItems.length - 1];

  // 获取第一个时间点 content-title 的位置
  const firstTitle = firstItem.querySelector(".content-title");
  const firstTitleRect = firstTitle.getBoundingClientRect(); //获取firstTitle元素在视口内的位置信息（矩形对象）
  const firstItemRect = firstItem.getBoundingClientRect(); //获取firstItem元素在视口内的位置信息（矩形对象）
  const targetTop = firstTitleRect.top - firstItemRect.top;

  // 获取时间轴起始和结束位置
  const firstItemFullRect = firstItem.getBoundingClientRect();
  const lastItemFullRect = lastItem.getBoundingClientRect();
  const timelineStart = firstItemFullRect.top + window.pageYOffset; //计算时间轴的起始位置，结合元素顶部位置和页面偏移量
  const timelineEnd = lastItemFullRect.bottom + window.pageYOffset; //计算时间轴结束位置，结合元素底部位置和页面滚动偏移量

  // 监听滚动事件
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset;
    const timelineRect = timeline.getBoundingClientRect();
    const timelineTop = timelineRect.top + window.pageYOffset; //计算时间轴顶部在页面中的位置结合视口顶部位置和页面偏移量

    // 计算滚动位置相对于时间轴起始位置的偏移量
    let newTop = scrollTop - timelineStart;

    // 确保加粗线段在时间轴范围内滑动
    if (newTop < 0) {
      newTop = 0;
    } else if (newTop > timelineEnd - timelineStart - timelineRect.height) {
      newTop = timelineEnd - timelineStart - timelineRect.height;
    }

    // 设置自定义属性
    timeline.style.setProperty("--timeline-after-top", `${newTop}px`);

    timelineItems.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const title = item.querySelector(".content-title");
      if (index === 0) {
        // 第一个时间点的 content-title 不动
        title.style.transform = "translateY(0)";
        return;
      }

      // 判断加粗线段是否在该事件点位置
      const isAtItem =
        scrollTop + newTop >= item.offsetTop &&
        scrollTop + newTop <= item.offsetTop + item.offsetHeight;

      if (isAtItem) {
        // 移动到与第一个时间点的 content-title 相同位置
        title.style.transform = `translateY(-5rem)`;
      } else {
        // 恢复默认位置
        title.style.transform = "translateY(0)";
      }
    });
  });
});
