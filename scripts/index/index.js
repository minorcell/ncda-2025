class HeaderController {
    constructor() {
        this.header = document.querySelector('.header');
        this.container = document.querySelector('.container');
        this.lastScrollY = this.container.scrollTop;
        this.ticking = false;
        this.init();
    }

    init() {
        this.container.addEventListener('scroll', () => this.onScroll());
    }

    onScroll() {
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.updateHeader();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    updateHeader() {
        const currentScrollY = this.container.scrollTop;

        if (currentScrollY > this.lastScrollY && currentScrollY > this.header.offsetHeight) {
            this.header.style.transform = 'translateY(-100%)';
        }
        else {
            this.header.style.transform = 'translateY(0)';
        }

        this.lastScrollY = currentScrollY;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HeaderController();
});
