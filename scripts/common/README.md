# Common 模块

这个目录包含了可重用的 JavaScript 模块，包括UI控制器、视觉效果组件和通用工具函数。

## 组件列表

### HeaderController

一个用于控制页面头部（header）行为的组件。它可以根据滚动位置改变头部的样式或可见性，例如在向下滚动时隐藏头部，向上滚动时显示头部，或者在滚动到特定位置时改变头部背景。

**使用方法：**

```javascript
// 引入 HeaderController.js (如果尚未在 HTML 中通过 <script> 标签引入)
// import HeaderController from './HeaderController.js'; // 如果使用 ES6 模块

// 获取头部元素和滚动容器元素
const headerElement = document.querySelector('.header');
const scrollContainerElement = document.querySelector('.main-content'); // 或者 window

// 初始化 HeaderController
new HeaderController(headerElement, {
    scrollContainer: scrollContainerElement, // 监听此元素的滚动事件，默认为 window
    // 其他可选配置...
});
```

**主要功能：**
- 监听指定滚动容器的滚动事件。
- 根据滚动距离和方向，为头部元素添加/移除 CSS 类（例如 `header-hidden`, `header-scrolled`），以便通过 CSS 定义不同状态下的样式。

### StarBackground

基于 Three.js 的星空背景组件，创建一个动态的星空效果。

```javascript
// 创建星空背景
new StarBackground(container, {
    starCount: 1000,     // 星星数量
    starSizeMin: 0.04,   // 最小星星尺寸
    starSizeMax: 0.12,   // 最大星星尺寸
    xSpeed: 0.00005,     // X轴旋转速度
    ySpeed: 0.00005,     // Y轴旋转速度
    elapsed: 0           // 初始动画时间
});
```

### MeteorEffect

使用 SVG 和原生 JavaScript 实现的流星效果组件。

```javascript
// 创建流星效果
new MeteorEffect(container, {
    maxMeteors: 15,      // 同时存在的最大流星数量
    zIndex: 1,           // 容器层级
    meteor: {
        // 起始位置配置
        startXMin: 50,   // X坐标最小值
        startXMax: 100,  // X坐标最大值
        startYMin: 0,    // Y坐标最小值
        startYMax: 30,   // Y坐标最大值
        
        // 流星外观配置
        lengthMin: 10,   // 长度最小值
        lengthMax: 20,   // 长度最大值
        widthMin: 0.1,   // 宽度最小值
        widthMax: 0.2,   // 宽度最大值
        
        // 运动参数配置
        angleMin: 150,   // 运动角度最小值
        angleMax: 180,   // 运动角度最大值
        speedMin: 1,     // 速度最小值
        speedMax: 2,     // 速度最大值
        
        // 尾迹效果配置
        tailLengthMin: 1.2,  // 尾迹长度系数最小值
        tailLengthMax: 2     // 尾迹长度系数最大值
    }
});
```

### utils.js

该文件包含一些通用的辅助函数。

#### createVisibilityObserver

一个用于创建和管理 `IntersectionObserver` 实例的通用函数。它可以方便地监测元素是否进入或离开视口，并执行相应的回调操作，常用于实现元素的懒加载、进入视口动画等效果。

**参数：**

-   `selector` (string): 需要观察的元素的 CSS 选择器。
-   `visibilityChangeCallback` (function): 当元素的可见性状态改变时执行的回调函数。该函数接收两个参数：
    -   `element` (HTMLElement): 当前状态改变的 DOM 元素。
    -   `isVisible` (boolean): 表示元素当前是否可见（即与视口交叉）。
-   `customOptions` (object, 可选): `IntersectionObserver` 的自定义配置对象，可以覆盖默认配置（如 `root`, `rootMargin`, `threshold`）。

**使用方法：**

```javascript
// 引入 utils.js (如果尚未在 HTML 中通过 <script> 标签引入)
// 或者确保 createVisibilityObserver 函数在当前作用域可用

// 示例：当 .animated-item 元素进入视口时添加 'visible' 类，离开时移除
createVisibilityObserver('.animated-item', (element, isVisible) => {
  if (isVisible) {
    element.classList.add('visible');
    // 可选：如果只需要触发一次，可以在这里取消观察
    // observer.unobserve(element); // 注意: observer 实例在此回调中不易直接获取，需调整 createVisibilityObserver 实现或回调设计
  } else {
    element.classList.remove('visible');
  }
}, { threshold: 0.5 }); // 当元素 50% 进入视口时触发
```
**默认选项：**
- `root`: `null` (视口)
- `rootMargin`: `'0px'`
- `threshold`: `0.3` (元素30%可见时触发)

## 特点

1. **模块化设计**：每个组件和工具函数都是独立的模块，可以单独引入和使用。
2. **高度可配置**：许多组件提供丰富的配置选项，可以根据需要调整行为和视觉效果。
3. **性能优化**：
   - StarBackground 使用 Three.js 进行硬件加速渲染。
   - MeteorEffect 使用 SVG 实现，并包含可见性检测，只在可见时创建流星。
   - `createVisibilityObserver` 利用 Intersection Observer API 高效检测元素可见性。
4. **响应式**：视觉效果组件通常能自动适应容器大小，支持窗口调整。

## 使用建议

1. **容器要求**（主要针对视觉效果组件）：
   - 容器元素需要有明确的宽高。
   - 建议将容器的 `position` 设置为 `relative` 或 `absolute`。

2. **性能考虑**：
   - StarBackground 适用于需要大量星星的场景。
   - MeteorEffect 建议限制 `maxMeteors` 在合理范围内（推荐 10-20）。
   - 使用 `createVisibilityObserver` 时，合理设置 `threshold` 并考虑是否需要在回调中 `unobserve` 元素以避免不必要的计算。

3. **层级管理**（主要针对视觉效果组件）：
   - 可以通过 `zIndex` 配置控制组件的层级。
   - 确保不同效果之间的层级关系合理。

## 示例

```javascript
// 在页面中同时使用星空背景和流星效果
const container = document.querySelector('.effect-container');

// 添加星空背景
new StarBackground(container, {
    starCount: 800,
    starSizeMax: 0.1
});

// 添加流星效果
new MeteorEffect(container, {
    maxMeteors: 12,
    meteor: {
        speedMax: 1.5
    }
});

// 使用 utils.js 中的 createVisibilityObserver 监听元素动画
createVisibilityObserver('.some-animated-section', (element, isVisible) => {
  if (isVisible) {
    element.style.opacity = 1;
    element.style.transform = 'translateY(0)';
  } else {
    element.style.opacity = 0;
    element.style.transform = 'translateY(20px)';
  }
}, { threshold: 0.2 });
```