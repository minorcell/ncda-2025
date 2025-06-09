const data = [
    {
        id: '1',
        title: "载人航天基建步骤",
        isCompleted: false,
        questions: [
            {
                id: '1-1',
                title: "载人航天的基本步骤是什么？",
                isCompleted: false,
                options: [
                    {
                        id: '1-1-1',
                        content: "设计和建造航天器",
                    },
                    {
                        id: '1-1-2',
                        content: "进行载人飞行测试",
                    }
                ],
                answer: '1-1-1',
                analysis: "载人航天的基本步骤包括设计和建造航天器，以及进行载人飞行测试。载人航天的主要目标是探索太空和建立太空站。"
            },
            {
                id: '1-2',
                title: "载人航天的主要目标是什么？",
                isCompleted: false,
                options: [
                    {
                        id: '1-2-1',
                        content: "探索太空",
                    },
                    {
                        id: '1-2-2',
                        content: "建立太空站",
                    }
                ],
                answer: '1-2-1',
                analysis: "载人航天的主要目标是探索太空和建立太空站。载人航天的主要任务是探索太空，寻找未知的世界。"
            }
        ],
        reward: "../assets/images/WenTianPavilion/reward1.png",
    },
    {
        id: '2',
        title: "神舟系列载人飞船",
        isCompleted: false,
        questions: [
            {
                id: '2-1',
                title: "神舟系列载人飞船的主要任务是什么？",
                isCompleted: false,
                options: [
                    {
                        id: '2-1-1',
                        content: "进行载人飞行测试",
                    },
                    {
                        id: '2-1-2',
                        content: "建立太空站",
                    }
                ],
                answer: '2-1-1',
                analysis: "神舟系列载人飞船的主要任务是进行载人飞行测试。它们是中国载人航天工程的重要组成部分。"
            },
            {
                id: '2-2',
                title: "神舟系列载人飞船的设计特点是什么？",
                isCompleted: false,
                options: [
                    {
                        id: '2-2-1',
                        content: "具有高度的可靠性和安全性",
                    },
                    {
                        id: '2-2-2',
                        content: "可以在太空中长时间停留",
                    }
                ],
                answer: '2-2-1',
                analysis: "神舟系列载人飞船的设计特点是具有高度的可靠性和安全性。它们能够在太空中进行多次任务。"
            }
        ],
        reward: "../assets/images/WenTianPavilion/reward2.png",
    },
    {
        id: '3',
        title: "空间站",
        isCompleted: false,
        questions: [
            {
                id: '3-1',
                title: "空间站的主要任务是什么？",
                isCompleted: false,
                options: [
                    {
                        id: '3-1-1',
                        content: "进行载人飞行测试",
                    },
                    {
                        id: '3-1-2',
                        content: "进行科学实验和技术试验",
                    }
                ],
                answer: '3-1-2',
                analysis: "空间站的主要任务是进行科学实验和技术试验。它们是中国载人航天工程的重要组成部分。"
            }
        ],
        reward: "../assets/images/WenTianPavilion/reward3.png",
    },
    {
        id: '4',
        title: "人造卫星",
        isCompleted: false,
        questions: [
            {
                id: '4-1',
                title: "人造卫星的主要任务是什么？",
                isCompleted: false,
                options: [
                    {
                        id: '4-1-1',
                        content: "探索太空",
                    },
                    {
                        id: '4-1-2',
                        content: "建立太空站",
                    }
                ],
                answer: '4-1-1',
                analysis: "人造卫星的主要任务是探索太空。它们是中国载人航天工程的重要组成部分。"
            }
        ],
        reward: "../assets/images/WenTianPavilion/reward4.png",
    }
]

class QAController {
    constructor(data) {
        this.data = data;
        this.totalQuestions = this.data.reduce((sum, level) => sum + level.questions.length, 0);
        this.totalLevels = this.data.length;

        this.currentLevelIndex = 0;
        this.currentQuestionIndex = 0;
        this.selectedOptions = new Map();
        this.rewards = [];
        this.isPuzzleSolved = false;

        this.getDOMElements();
        this.initUI();
    }

    getDOMElements() {
        // Screens
        this.startScreen = document.getElementById('start-screen');
        this.qaScreen = document.getElementById('qa-screen');

        // Buttons
        this.startBtn = document.getElementById('start-btn');
        this.submitBtn = document.getElementById('submit-btn');
        this.analysisBtn = document.getElementById('analysis-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.continueBtn = document.getElementById('continue-btn');
        this.startPuzzleBtn = document.getElementById('start-puzzle-btn');
        this.continueAnsweringBtn = document.getElementById('continue-answering-btn');
        this.closeBackpackBtn = document.getElementById('close-backpack-btn');

        // QA Area
        this.taskList = document.getElementById('task-list');
        this.progressText = document.getElementById('progress-text');
        this.progressBar = document.getElementById('progress-bar');
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        this.analysisContainer = document.getElementById('analysis-container');
        this.analysisText = document.getElementById('analysis-text');

        // Modals
        this.rewardModal = document.getElementById('reward-modal');
        this.rewardImg = document.getElementById('reward-img');
        this.rewardProgressText = document.getElementById('reward-progress-text');
        this.allFragmentsModal = document.getElementById('all-fragments-modal');
        this.allFragmentsContainer = document.getElementById('all-fragments-container');
        this.puzzleModal = document.getElementById('puzzle-modal');

        // Backpack
        this.backpackContainer = document.getElementById('backpack-container');
        this.backpackIcon = document.getElementById('backpack-icon');
        this.backpackText = document.getElementById('backpack-text');
        this.backpackModal = document.getElementById('backpack-modal');
        this.backpackProgressText = document.getElementById('backpack-progress-text');
        this.backpackFragmentsContainer = document.getElementById('backpack-fragments-container');

        // Puzzle
        this.puzzleDropZone = document.getElementById('puzzle-drop-zone');
        this.puzzlePiecesContainer = document.getElementById('puzzle-pieces-container');

        // Header elements
        this.levelTitleHeader = document.getElementById('level-title-header');
        this.levelEnHeader = document.getElementById('level-en-header');
    }

    initUI() {
        this.startBtn.addEventListener('click', () => this.handleStart());
        this.submitBtn.addEventListener('click', () => this.handleSubmit());
        this.analysisBtn.addEventListener('click', () => this.toggleAnalysis(true));
        this.nextBtn.addEventListener('click', () => this.handleNext());
        this.prevBtn.addEventListener('click', () => this.handlePrev());
        this.continueBtn.addEventListener('click', () => this.handleContinue());

        this.backpackIcon.addEventListener('click', () => this.toggleBackpack());
        this.continueAnsweringBtn.addEventListener('click', () => this.toggleBackpack(false));
        this.closeBackpackBtn.addEventListener('click', () => this.toggleBackpack(false));

        this.startPuzzleBtn.addEventListener('click', () => this.startPuzzle());

        // Hide the dynamic header initially, show it after start
        if (this.levelTitleHeader) this.levelTitleHeader.parentElement.style.visibility = 'hidden';
    }

    handleStart() {
        this.startScreen.classList.remove('active');
        this.qaScreen.classList.add('active');
        this.backpackContainer.style.display = 'block';

        // Show and update the header for the first time
        if (this.levelTitleHeader) this.levelTitleHeader.parentElement.style.visibility = 'visible';
        this.renderAll();
    }

    getCurrentLevel() { return this.data[this.currentLevelIndex]; }
    getCurrentQuestion() { return this.getCurrentLevel().questions[this.currentQuestionIndex]; }

    renderAll() {
        this.renderTaskList();
        this.renderCurrentQuestion();
        this.updateProgress();
        this.updateHeader();
    }

    renderTaskList() {
        this.taskList.innerHTML = '';
        this.data.forEach((level, index) => {
            const li = document.createElement('li');
            li.textContent = level.title;
            li.className = 'task-list-item';
            if (index === this.currentLevelIndex) li.classList.add('active');
            if (level.isCompleted) li.classList.add('completed');
            li.addEventListener('click', () => this.jumpToLevel(index));
            this.taskList.appendChild(li);
        });
    }

    renderCurrentQuestion() {
        const level = this.getCurrentLevel();
        const question = this.getCurrentQuestion();
        const selectedOptionId = this.selectedOptions.get(question.id);

        this.questionText.textContent = question.title;
        this.optionsContainer.innerHTML = '';

        question.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            const optionLetter = String.fromCharCode(65 + index); // A, B, ...
            btn.innerHTML = `<span>${optionLetter}.</span> ${opt.content}`;
            btn.className = 'pixel-btn option-btn';
            if (opt.id === selectedOptionId) btn.classList.add('selected');

            // If answered, show correct/wrong styles
            if (question.isCompleted) {
                btn.disabled = true;
                if (opt.id === question.answer) btn.classList.add('correct');
                if (opt.id === selectedOptionId && opt.id !== question.answer) btn.classList.add('wrong');
            } else {
                btn.addEventListener('click', () => this.handleOptionSelect(opt.id));
            }
            this.optionsContainer.appendChild(btn);
        });

        this.submitBtn.style.display = !question.isCompleted ? 'inline-block' : 'none';
        this.analysisBtn.style.display = question.isCompleted ? 'inline-block' : 'none';
        this.toggleAnalysis(question.isCompleted);
    }

    handleOptionSelect(optionId) {
        const question = this.getCurrentQuestion();
        this.selectedOptions.set(question.id, optionId);
        this.renderCurrentQuestion();
    }

    handleSubmit() {
        const question = this.getCurrentQuestion();
        const selectedId = this.selectedOptions.get(question.id);
        if (!selectedId) {
            alert('请先选择一个答案！');
            return;
        }

        // Check answer
        const isCorrect = selectedId === question.answer;

        if (isCorrect) {
            question.isCompleted = true;
            this.renderCurrentQuestion();
            this.updateProgress();

            const level = this.getCurrentLevel();
            const isLevelCompleted = level.questions.every(q => q.isCompleted);

            if (isLevelCompleted && !level.isCompleted) {
                level.isCompleted = true;
                if (!this.rewards.find(r => r.id === level.id)) {
                    this.rewards.push({ id: level.id, reward: level.reward });
                    // Use a timeout to avoid showing reward modal immediately after correct answer
                    setTimeout(() => this.showRewardModal(), 500);
                }
                this.renderTaskList(); // Update checkmark
            }
        } else {
            // Temporarily add wrong class for feedback
            const selectedButton = this.optionsContainer.querySelector(`.option-btn.selected`);
            if (selectedButton) {
                selectedButton.classList.add('wrong');
                // Remove the class after the animation to allow re-selection
                setTimeout(() => {
                    selectedButton.classList.remove('wrong');
                }, 500);
            }
            alert('答案错误，请再试一次！');
        }
    }

    toggleAnalysis(show) {
        if (show) {
            const question = this.getCurrentQuestion();
            this.analysisText.textContent = question.analysis;
            this.analysisContainer.style.display = 'block';
        } else {
            this.analysisContainer.style.display = 'none';
        }
    }

    updateProgress() {
        const completed = this.data.reduce((sum, level) => sum + level.questions.filter(q => q.isCompleted).length, 0);
        this.progressText.innerText = `${completed}/${this.totalQuestions}`;
        this.progressBar.style.width = `${(completed / this.totalQuestions) * 100}%`;
    }

    handleNext() {
        const level = this.getCurrentLevel();
        if (this.currentQuestionIndex < level.questions.length - 1) {
            this.currentQuestionIndex++;
        } else if (this.currentLevelIndex < this.data.length - 1) {
            this.currentLevelIndex++;
            this.currentQuestionIndex = 0;
        }
        this.renderAll();
    }

    handlePrev() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
        } else if (this.currentLevelIndex > 0) {
            this.currentLevelIndex--;
            const prevLevel = this.getCurrentLevel();
            this.currentQuestionIndex = prevLevel.questions.length - 1;
        }
        this.renderAll();
    }

    jumpToLevel(levelIndex) {
        this.currentLevelIndex = levelIndex;
        this.currentQuestionIndex = 0;
        this.renderAll();
    }

    showRewardModal() {
        const level = this.getCurrentLevel();
        this.rewardImg.src = level.reward;
        this.rewardProgressText.textContent = `碎片收集进度 ${this.rewards.length}/${this.totalLevels}`;
        this.rewardModal.classList.add('active');
    }

    handleContinue() {
        this.rewardModal.classList.remove('active');
        if (this.rewards.length === this.totalLevels) {
            this.showAllFragmentsModal();
        }
    }

    showAllFragmentsModal() {
        this.allFragmentsContainer.innerHTML = '';
        this.rewards.forEach(r => {
            const img = document.createElement('img');
            img.src = r.reward;
            img.className = 'fragment-img';
            this.allFragmentsContainer.appendChild(img);
        });
        this.allFragmentsModal.classList.add('active');
    }

    toggleBackpack(forceOpen) {
        const shouldOpen = forceOpen !== undefined ? forceOpen : !this.backpackModal.classList.contains('active');
        if (shouldOpen) {
            this.renderBackpack();
            this.backpackModal.classList.add('active');
            this.backpackText.textContent = '关闭';
        } else {
            this.backpackModal.classList.remove('active');
            this.backpackText.textContent = '打开';
        }
    }

    renderBackpack() {
        this.backpackProgressText.textContent = `碎片收集进度 ${this.rewards.length}/${this.totalLevels}`;
        this.backpackFragmentsContainer.innerHTML = '';
        for (let i = 0; i < this.totalLevels; i++) {
            const rewardItem = this.rewards.find(r => r.id === this.data[i].id);
            const img = document.createElement('img');
            img.className = 'fragment-img';
            if (rewardItem) {
                img.src = rewardItem.reward;
            } else {
                img.src = '../assets/images/WenTianPavilion/QuestionBg.svg'; // Placeholder for uncollected
                img.classList.add('uncollected');
            }
            this.backpackFragmentsContainer.appendChild(img);
        }
        this.closeBackpackBtn.style.display = this.isPuzzleSolved ? 'inline-block' : 'none';
    }

    startPuzzle() {
        this.allFragmentsModal.classList.remove('active');
        this.puzzleModal.classList.add('active');
        this.initPuzzle();
    }

    initPuzzle() {
        this.puzzlePiecesContainer.innerHTML = '';
        // Shuffle rewards for puzzle pieces
        const puzzlePieces = [...this.rewards].sort(() => Math.random() - 0.5);

        puzzlePieces.forEach((r, index) => {
            const piece = document.createElement('img');
            piece.src = r.reward;
            piece.className = 'puzzle-piece';
            piece.dataset.id = r.id;
            piece.draggable = true;
            piece.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', r.id);
            });
            this.puzzlePiecesContainer.appendChild(piece);
        });

        Array.from(this.puzzleDropZone.children).forEach((slot, index) => {
            slot.dataset.id = this.data[index].id; // Assign correct ID to each slot
            slot.addEventListener('dragover', e => e.preventDefault());
            slot.addEventListener('drop', e => {
                e.preventDefault();
                const droppedPieceId = e.dataTransfer.getData('text/plain');
                if (slot.dataset.id === droppedPieceId) {
                    const piece = document.querySelector(`.puzzle-piece[data-id="${droppedPieceId}"]`);
                    slot.appendChild(piece);
                    piece.draggable = false;
                    slot.classList.add('dropped');
                    this.checkPuzzleCompletion();
                }
            });
        });
    }

    checkPuzzleCompletion() {
        const droppedSlots = this.puzzleDropZone.querySelectorAll('.dropped');
        if (droppedSlots.length === this.totalLevels) {
            this.isPuzzleSolved = true;
            alert('恭喜你，成功完成了拼图！');
            this.puzzleModal.classList.remove('active');
            this.toggleBackpack(true); // Open backpack to show final state
        }
    }

    updateHeader() {
        if (!this.levelTitleHeader || !this.levelEnHeader) return;

        const level = this.getCurrentLevel();
        const completedQuestions = this.data.reduce((sum, lvl) => sum + lvl.questions.filter(q => q.isCompleted).length, 0);

        this.levelTitleHeader.textContent = `任务清单 → ${level.title}`;
        this.levelEnHeader.textContent = `当前进度：${completedQuestions} / ${this.totalQuestions}`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const qaContainer = document.querySelector('.qa-container');
    // 初始化鼠标控制器
    new Mouse({
        defaultCursor: '../assets/images/common/MouseDefault.svg',
        clickCursor: '../assets/images/common/MouseClick.svg',
    });

    // 初始化QA控制器
    // new QAController(data);

    // 初始化星空背景
    new StarBackground(qaContainer, {
        starCount: 300,
        starSizeMin: 0.08,
        starSizeMax: 0.16,
        xSpeed: 0.0002,
        ySpeed: 0.0002,
        elapsed: 0
    });
});
