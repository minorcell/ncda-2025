# NCDA-2025 项目规范

## 项目结构

```
ncda-2025/
├── .github/               # GitHub 配置文件
│   └── workflows/         # GitHub Actions 工作流配置
├── assets/               # 静态资源
│   ├── images/           # 图片资源
│   ├── videos/           # 视频资源
│   ├── fonts/            # 字体文件
│   └── audio/            # 音频资源
├── styles/               # CSS 样式
│   ├── reset.css         # 重置默认样式
│   ├── fonts.css         # 字体定义
│   ├── keyframes.css     # 动画关键帧定义
│   └── index/            # 页面特定样式
│       └── index.css     # 首页样式
└── index.html            # 主页面
```

## CSS 编码规范

### 命名规范

- 使用破折号（-）连接的小写单词作为类名，例如：`.page-title`，`.header-logo`
- ID 应避免用于样式，主要用于 JavaScript 操作或锚点

### 文件组织

- `reset.css`: 只包含全局重置和基础样式，加载其他 CSS 文件
- `fonts.css`: 定义所有字体和文本样式
- `keyframes.css`: 集中定义所有动画关键帧

## 字体规范

所有字体定义应该集中在 `fonts.css` 文件中：

- 使用 `@font-face` 引入自定义字体
- 定义一组字体变量，用于全局一致的字体应用
- 字体大小使用相对单位（rem, em, vw 等）

## 动画规范

所有动画关键帧应该集中在 `keyframes.css` 文件中：

- 使用有描述性的名称命名关键帧
- 复杂动画分解为多个简单动画组合

## 静态资源规范

### 图片资源

- 图片放在 `assets/images/` 目录
- 优先使用 WebP 格式，提供 JPEG/PNG 作为备选
- 图片命名使用小写字母和破折号，例如：`hero-background.webp`
- 图标优先使用 SVG 格式

### 视频资源

- 视频放在 `assets/videos/` 目录
- 长视频考虑流式播放解决方案
- 视频命名同样使用小写字母和破折号

### 音频资源

- 音频放在 `assets/audio/` 目录
- 优先使用 MP3 格式，兼顾文件大小和质量

## 性能优化

- 图片资源适当压缩
- 延迟加载非首屏资源
- 避免使用大量的 CSS 阴影、滤镜等高消耗属性
- 动画尽量只使用 transform 和 opacity 属性

## 浏览器兼容性

- 支持主流现代浏览器（Chrome、Firefox、Safari、Edge）最新两个版本
- 使用 CSS 变量时，考虑提供回退值
- 使用新特性时，参考 [caniuse.com](https://caniuse.com/) 确认兼容性

## 代码提交规范

- 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范
- commit 类型:
  - feat: 新功能
  - fix: 修复问题
  - docs: 文档更新
  - style: 代码格式（不影响功能）
  - refactor: 重构
  - perf: 性能优化
  - test: 测试相关
  - build: 构建系统或外部依赖
  - ci: CI 配置

---

本文档最后更新时间：2025 年 5 月 12 日
