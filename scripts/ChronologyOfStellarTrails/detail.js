// 选择类名为 right-circle 的元素，并将它们存储在 rightCircles 变量中
const rightCircles = document.querySelectorAll('.right-circle');
// 遍历 rightCircles 中的每个元素
rightCircles.forEach(circle => {
  // 为每个元素添加点击事件监听器
  circle.addEventListener('click', function () {
    // 当元素被点击时，为其添加 'clicked' 类
    this.classList.add('clicked');
    // 设置一个定时器，在 500 毫秒后执行回调函数
    setTimeout(() => {
      // 定时器到期后，移除元素的 'clicked' 类
      this.classList.remove('clicked');
    }, 500);
  });
});
// ... existing code ...

const rightcircles = document.querySelectorAll('.right-circle');
// 获取当前页面的路径
const currentPagePath = window.location.pathname;
// 使用正则表达式提取当前页面编号，假设页面命名规则为 ChronologyOfStellarTrailsDetailsX.html
const match = currentPagePath.match(/ChronologyOfStellarTrailsDetails(\d+)\.html/);
// 如果匹配成功，将提取到的编号转换为整数；否则默认页面编号为 1
const currentPageNumber = match ? parseInt(match[1], 10) : 1;

// 遍历 rightCircles 中的每个元素，为每个元素添加页面跳转功能
rightCircles.forEach(circle => {
  // 为每个元素添加点击事件监听器
  circle.addEventListener('click', function () {
    // 定义新页面的编号变量
    let newPageNumber;
    // 判断点击的是向上箭头还是向下箭头
    if (this.textContent === '↑') {
      // 如果是向上箭头，计算新页面编号，确保不小于 1
      newPageNumber = Math.max(1, currentPageNumber - 1);
    } else if (this.textContent === '↓') {
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