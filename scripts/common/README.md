# Common 模块

这个目录包含了可重用的视觉效果组件，主要用于创建星空和流星等动态效果。

## 组件列表

### StarBackground

基于 Three.js 的星空背景组件，创建一个动态的星空效果。

```javascript
import { StarBackground } from '../common/StarBackground.js';

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
import { MeteorEffect } from '../common/MeteorEffect.js';

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

## 特点

1. **模块化设计**：每个组件都是独立的模块，可以单独引入和使用。
2. **高度可配置**：提供丰富的配置选项，可以根据需要调整视觉效果。
3. **性能优化**：
   - StarBackground 使用 Three.js 进行硬件加速渲染
   - MeteorEffect 使用 SVG 实现，并包含可见性检测，只在可见时创建流星
4. **响应式**：自动适应容器大小，支持窗口调整。

## 使用建议

1. **容器要求**：
   - 容器元素需要有明确的宽高
   - 建议将容器的 position 设置为 relative 或 absolute

2. **性能考虑**：
   - StarBackground 适用于需要大量星星的场景
   - MeteorEffect 建议限制 maxMeteors 在合理范围内（推荐 10-20）

3. **层级管理**：
   - 可以通过 zIndex 配置控制组件的层级
   - 确保不同效果之间的层级关系合理

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
```