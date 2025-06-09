const news = [
    {
        title: '全球快报',
        content: '全球快报是一个展示全球新闻的页面，提供最新的国际新闻和事件。它旨在为用户提供一个快速了解世界各地发生的重要新闻的平台。',
        date: '2023-10-01',
    },
    {
        title: '抓住新机遇，扩大业务规模',
        content: '随着全球经济的发展，企业需要不断扩大业务规模以保持竞争力。全球快报提供了最新的行业新闻和市场趋势，帮助企业抓住新机遇，扩大业务规模。',
        date: '2023-11-01',
    },
    {
        title: '创新驱动发展',
        content: '全球快报关注科技和创新，为企业提供最新的技术和创新趋势。它帮助企业保持技术领先，提高业务效率和创新能力。',
        date: '2023-12-01',
    },
    {
        title: '关注市场变化',
        content: '全球快报关注市场变化，为企业提供最新的市场趋势和市场数据。它帮助企业把握市场机会，提高业务效率和市场竞争力。',
        date: '2024-01-01',
    },
    {
        title: '关注市场变化',
        content: '全球快报关注市场变化，为企业提供最新的市场趋势和市场数据。它帮助企业把握市场机会，提高业务效率和市场竞争力。',
        date: '2024-01-01',
    },
    {
        title: '关注市场变化',
        content: '全球快报关注市场变化，为企业提供最新的市场趋势和市场数据。它帮助企业把握市场机会，提高业务效率和市场竞争力。',
        date: '2024-01-01',
    },
    {
        title: '关注市场变化',
        content: '全球快报关注市场变化，为企业提供最新的市场趋势和市场数据。它帮助企业把握市场机会，提高业务效率和市场竞争力。',
        date: '2024-01-01',
    },
    {
        title: '关注市场变化',
        content: '全球快报关注市场变化，为企业提供最新的市场趋势和市场数据。它帮助企业把握市场机会，提高业务效率和市场竞争力。',
        date: '2024-01-01',
    },
    {
        title: '关注市场变化',
        content: '全球快报关注市场变化，为企业提供最新的市场趋势和市场数据。它帮助企业把握市场机会，提高业务效率和市场竞争力。',
        date: '2024-01-01',
    },
    {
        title: '关注市场变化',
        content: '全球快报关注市场变化，为企业提供最新的市场趋势和市场数据。它帮助企业把握市场机会，提高业务效率和市场竞争力。',
        date: '2024-01-01',
    }
]

const htkjyymfw = [
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW01.jpg",
        vodeo: "../../assets/videos/launch.mp4",
    },
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW02.png",
        vodeo: "../../assets/videos/launch.mp4",
    },
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW03.png",
        vodeo: "../../assets/videos/launch.mp4",
    },
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW05.jpg",
        vodeo: "../../assets/videos/launch.mp4",
    },
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW06.webp",
        vodeo: "../../assets/videos/launch.mp4",
    },
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW01.jpg",
        vodeo: "../../assets/videos/launch.mp4",
    },
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW02.png",
        vodeo: "../../assets/videos/launch.mp4",
    },
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW03.png",
        vodeo: "../../assets/videos/launch.mp4",
    },
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW05.jpg",
        vodeo: "../../assets/videos/launch.mp4",
    },
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW06.webp",
        vodeo: "../../assets/videos/launch.mp4",
    },
]

const gkhz = [
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW01.jpg",
        vodeo: "../../assets/videos/launch.mp4",
    },
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW02.png",
        vodeo: "../../assets/videos/launch.mp4",
    },
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW03.png",
        vodeo: "../../assets/videos/launch.mp4",
    },
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW05.jpg",
        vodeo: "../../assets/videos/launch.mp4",
    },
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW06.webp",
        vodeo: "../../assets/videos/launch.mp4",
    },
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW01.jpg",
        vodeo: "../../assets/videos/launch.mp4",
    },
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW02.png",
        vodeo: "../../assets/videos/launch.mp4",
    },
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW03.png",
        vodeo: "../../assets/videos/launch.mp4",
    },
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW05.jpg",
        vodeo: "../../assets/videos/launch.mp4",
    },
    {
        img: "../../assets/images/GlobalQuickReport/HTKJYYYMSFW06.webp",
        vodeo: "../../assets/videos/launch.mp4",
    },
]

function createNewsItem(news = []) {
    const newsContainer = document.querySelector('.news');
    newsContainer.innerHTML = news.map((item, index) =>
        `<div class="new-item" data-index="${index}">
            <div class="title">${item.title}</div>
            <div class="date">${item.date}</div>
            <div class="new-content-box">
                <div class="close-btn"></div>
                <div class="children">
                    <div class="new-box-title">${item.title}</div>
                    <div class="line"></div>
                    <p class="new-content">${item.content}</p>
                </div>
            </div>
        </div>`
    ).join('');

    newsContainer.addEventListener('click', (event) => {
        const target = event.target.closest('.new-item');
        if (target) {
            const index = target.getAttribute('data-index');
            const box = document.querySelector(`.new-item[data-index="${index}"] .new-content-box`);
            document.querySelectorAll('.new-content-box').forEach(item => {
                item.style.display = 'none';
            });
            box.style.opacity = '1';
            box.style.transition = 'opacity 0.3s ease-in-out';
            box.style.display = 'block';

            const closeBtn = box.querySelector('.close-btn');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                box.style.display = 'none';
            });
        }
    });
}

function createPopupVideoOverlay(videoSrc) {
    // 如果已有弹窗，先清除
    const existing = document.querySelector('.video-popup-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'video-popup-overlay';
    overlay.innerHTML = `
        <div class="video-popup">
            <div class="close-video-btn"></div>
            <video src="${videoSrc}" autoplay controls></video>
        </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('.close-video-btn').addEventListener('click', () => {
        overlay.remove();
    });
}


function initHTKJYYYMSFW() {
    const container = document.querySelector('.htkj-yyymsfw');
    container.innerHTML = htkjyymfw.map((item, index) =>
        `<div class="item">
            <img src="${item.img}" data-index="${index}" alt="HTKJYYYMSFW Image">
        </div>`
    ).join('');

    container.addEventListener('click', (event) => {
        const img = event.target.closest('img');
        if (img) {
            const index = img.dataset.index;
            const videoSrc = htkjyymfw[index].vodeo;
            createPopupVideoOverlay(videoSrc);
        }
    });
}

function initGJHZ() {
    const container = document.querySelector('.gjhz');
    container.innerHTML = gkhz.map((item, index) =>
        `<div class="item">
            <img src="${item.img}" data-index="${index}" alt="GKHZ Image">
        </div>`
    ).join('');

    container.addEventListener('click', (event) => {
        const img = event.target.closest('img');
        if (img) {
            const index = img.dataset.index;
            const videoSrc = gkhz[index].vodeo;
            createPopupVideoOverlay(videoSrc);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector('.header');
    const scrollContainer = document.querySelector('.container');
    const starBg = document.querySelector('.star-bg');

    // 初始化头部控制器
    new HeaderController(header, { scrollContainer });


    // 初始化鼠标控制器
    new Mouse({
        defaultCursor: '../assets/images/common/MouseDefault.svg',
        clickCursor: '../assets/images/common/MouseClick.svg',
    });

    // 初始化星空背景
    new StarBackground(starBg, {
        starCount: 200
    });

    new MeteorEffect(starBg)

    // 创建新闻项
    createNewsItem(news);

    // 初始化HTKJYYYMSFW
    initHTKJYYYMSFW();

    // 初始化GKHZ
    initGJHZ();
});
