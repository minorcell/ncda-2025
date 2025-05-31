
/**
 * 创建并配置 Intersection Observer 的通用函数
 * @param {string} selector - 要观察的元素的 CSS 选择器
 * @param {function} visibilityChangeCallback - 当元素可见性改变时执行的回调函数，接收 (element, isVisible) 参数
 * @param {object} [customOptions={}] - Intersection Observer 的自定义选项
 */
function createVisibilityObserver(selector, visibilityChangeCallback, customOptions = {}) {
    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3, // 默认30%可见时触发
    };

    const options = { ...defaultOptions, ...customOptions };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            // 调用回调函数，并传递元素和当前的可见性状态
            visibilityChangeCallback(entry.target, entry.isIntersecting);
        });
    }, options);

    document.querySelectorAll(selector).forEach(element => {
        observer.observe(element);
    });
}