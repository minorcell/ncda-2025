class Mouse {
    constructor({
        defaultCursor,
        clickCursor,
    }) {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);

        this.defaultCursor = defaultCursor;
        this.clickCursor = clickCursor;

        this.visible = true;

        this.init();
    }

    init() {
        this.setCursorImage(this.defaultCursor);

        // Move
        document.addEventListener('mousemove', (e) => {
            this.showCursor();
            const isLink = e.target.tagName === 'A' || e.target.tagName === 'BUTTON';
            const cursorImg = isLink ? this.clickCursor : this.defaultCursor;
            const transform = isLink ? 'scale(1.5)' : 'scale(1) rotate(15deg)';

            this.setCursorImage(cursorImg);
            this.cursor.style.transform = transform;
            this.cursor.style.left = `${e.clientX}px`;
            this.cursor.style.top = `${e.clientY}px`;
        });

        // Down
        document.addEventListener('mousedown', () => {
            this.setCursorImage(this.clickCursor);
            this.cursor.style.transform = 'scale(1.5)';
        });

        // Up
        document.addEventListener('mouseup', () => {
            this.setCursorImage(this.defaultCursor);
            this.cursor.style.transform = 'scale(1) rotate(15deg)';
        });

        // Hide native cursor
        document.body.style.cursor = 'none';

        // Handle leave/enter
        document.addEventListener('mouseleave', () => this.hideCursor());
        document.addEventListener('mouseenter', () => this.showCursor());
    }

    setCursorImage(src) {
        if (this.cursor.style.backgroundImage !== `url("${src}")`) {
            this.cursor.style.backgroundImage = `url("${src}")`;
        }
    }

    hideCursor() {
        this.visible = false;
        this.cursor.classList.add('hidden');
    }

    showCursor() {
        if (!this.visible) {
            this.visible = true;
            this.cursor.classList.remove('hidden');
        }
    }
}