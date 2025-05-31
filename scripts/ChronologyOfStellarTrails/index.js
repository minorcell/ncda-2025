const bar = document.querySelector('.bar');

const cards = [
  {
    id: 1,
    imgSrc: "../../assets/images/ChronologyOfStellarTrails/index01.png",
    year: "1970",
    description: "中国于1970年4月24日发射第一颗人造地球卫星，是继苏联、美国、法国、日本之后世界上第5个能独立发射人造卫星的国家。",
    title: "发射第一颗人造地球卫星"
  },
  {
    id: 2,
    imgSrc: "../../assets/images/ChronologyOfStellarTrails/index02.png",
    year: "1975",
    description: "中国于1975年成功发射了第一颗返回式遥感卫星，标志着中国掌握了卫星返回技术。",
    title: "发射第一颗返回式遥感卫星"
  },
  {
    id: 3,
    imgSrc: "../../assets/images/ChronologyOfStellarTrails/index03.png",
    year: "1980",
    description: "中国于1980年成功发射了第一颗实用气象卫星风云一号，标志着中国掌握了气象卫星技术。",
    title: "发射第一颗实用气象卫星"
  }
]


/**
 * 渲染卡片到指定容器
 * @param {HTMLElement} container - 卡片容器
 * @param {Array} cardsData - 卡片数据
 */
function renderCards(container, cardsData) {
  // 清空容器
  container.innerHTML = '';

  // 遍历卡片数据生成HTML
  cardsData.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.setAttribute('data-id', card.id);

    cardElement.innerHTML = `
        <div class="card-image"
          style="background-image: url('${card.imgSrc}'); background-size: cover; background-position: center; background-repeat: no-repeat;"
        ></div>
        <div class="bar"></div>
        <div class="card-content">
          <div class="card-year">${card.year}</div>
          <div class="card-description">${card.description}</div>
          <a href="ChronologyOfStellarTrailsDetails.html?id=${card.id}" class="detail-btn">查看详情
            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="#ffffff" d="M16.175 13H4v-2h12.175l-5.6-5.6L12 4l8 8l-8 8l-1.425-1.4z"/></svg>
          </a>
        </div>
        <div class="card-title">${card.title}</div>
    `;

    container.appendChild(cardElement);
  });
}

/**
 * 使用Intersection Observer监听卡片进入视口
 */
function observeCards() {
  createVisibilityObserver('.card', (element, isVisible) => {
    if (isVisible) {
      element.classList.add('visible');
    } else {
      element.classList.remove('visible');
    }
  });
}

/**
 * 监视year进入视口
 */
function observeYears() {
  createVisibilityObserver('.card-year', (element, isVisible) => {
    if (isVisible) {
      element.classList.add('visible');
    } else {
      element.classList.remove('visible');
    }
  });
}

/**
 * 监视title进入视口
 */
function observeTitles() {
  createVisibilityObserver('.card-title', (element, isVisible) => {
    if (isVisible) {
      element.classList.add('visible');
    } else {
      element.classList.remove('visible');
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector('.header');
  const starContainer = document.querySelector('.star-bg');
  const scrollContainer = document.querySelector('.container');
  const cardsContainer = document.querySelector('.cards');

  // 初始化头部控制器
  new HeaderController(header, { scrollContainer });

  // 初始化星空背景
  new StarBackground(starContainer, {
    starCount: 500,
    starSizeMin: 0.08,
    starSizeMax: 0.16,
    xSpeed: 0.0002,
    ySpeed: 0.0002,
    elapsed: 0,
  });

  // 初始化流星效果
  new MeteorEffect(starContainer, {
    maxMeteors: 20,
    zIndex: 1,
  });

  // 渲染卡片
  renderCards(cardsContainer, cards);

  // 监听卡片可见性
  observeCards();

  // 监听年份可见性
  observeYears();

  // 监听标题可见性
  observeTitles();
});