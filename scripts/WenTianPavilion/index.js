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
        reward: "../../assets/images/WenTianPavilion/back01.svg",
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
        reward: "../../assets/images/WenTianPavilion/back02.svg",
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
        reward: "../../assets/images/WenTianPavilion/back03.svg",
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
        reward: "../../assets/images/WenTianPavilion/back04.svg",
    }
]

// 答题控制器
class QAController {
    constructor(data) {
        this.data = data;
        // 当前关卡索引
        this.currentLevelIndex = 0;
        // 当前关卡问题索引
        this.currentQuestionIndex = 0;
        // 已获得奖励碎片列表
        this.currentRewardFragments = [];
        // 是否完成了所有关卡
        this.isAllLevelCompleted = false;
        // 选中的选项 ID
        this.selectedOptionId = null;

        // DOM 元素
        this.initInfo = document.querySelector(".init-info");
        this.levelInfo = document.querySelector(".level-info");
        this.startContent = document.querySelector(".start-content");
        this.qaBox = document.querySelector(".qa-box");
        this.fragmentBox = document.querySelector(".fragment-box");
        this.backpackBox = document.querySelector(".backpack-box");
        this.puzzleBox = document.querySelector(".puzzle-box");
        this.backEntry = document.querySelector(".back-entry");

        // 头部信息元素
        this.levelTitleElem = this.levelInfo.querySelector(".level-title");
        this.progressTextContainer = this.levelInfo.querySelector(".progress-text");
        this.processBarElem = this.levelInfo.querySelector(".process-bar");

        // QA 区元素
        this.questionElem = this.qaBox.querySelector(".question");
        this.optionsContainer = this.qaBox.querySelector(".options");
        this.submitBtn = this.qaBox.querySelector(".submit");
        this.analysisBtn = this.qaBox.querySelector(".analysis");
        this.nextBtn = this.qaBox.querySelector(".next");
        this.prevBtn = this.qaBox.querySelector(".prev");
        this.analysisTextElem = null; // 动态创建展示解析

        // 碎片区元素
        this.fragmentContinueBtn = this.fragmentBox.querySelector(".continue-btn");
        this.fragmentImgElem = this.fragmentBox.querySelector(".fragment-img img");
        this.fragmentProgressElem = this.fragmentBox.querySelector(".progress-box");

        // 背包区元素
        this.backpackContinueBtn = this.backpackBox.querySelector(".continue-btn");
        this.backpackItemContainer = this.backpackBox.querySelector(".backpack-item");
        this.backpackInfoElem = this.backpackBox.querySelector(".info");

        // 拼图区元素
        this.puzzleInfoElem = this.puzzleBox.querySelector(".info");
        this.puzzleItemContainer = this.puzzleBox.querySelector(".puzzle-item");

        // 开始按钮
        this.startBtn = this.startContent.querySelector(".start-btn");

        this.init();
    }

    init() {
        // 初始隐藏所有，显示开始
        this.showHideController([
            this.levelInfo,
            this.qaBox,
            this.fragmentBox,
            this.backpackBox,
            this.puzzleBox,
            this.backEntry
        ], [this.initInfo, this.startContent]);

        // 点击开始
        if (this.startBtn) {
            this.startBtn.addEventListener("click", () => {
                this.showHideController([
                    this.initInfo,
                    this.startContent
                ], [this.levelInfo, this.qaBox, this.backEntry]);
                this.updateHeader();
                this.showQuestion();
            });
        }

        // 下一题或下一关
        if (this.nextBtn) {
            this.nextBtn.style.cursor = 'pointer';
            this.nextBtn.addEventListener("click", () => {
                const level = this.getCurrentLevel();
                // 还有当前关卡下的下一个问题
                if (this.currentQuestionIndex < level.questions.length - 1) {
                    this.currentQuestionIndex++;
                }
                // 当前是最后问题且有下一关
                else if (this.currentQuestionIndex === level.questions.length - 1 && this.currentLevelIndex < this.data.length - 1) {
                    this.currentLevelIndex++;
                    this.currentQuestionIndex = 0;
                } else {
                    return;
                }
                this.selectedOptionId = null;
                this.updateHeader();
                this.showQuestion();
            });
        }
        // 上一题或上一关
        if (this.prevBtn) {
            this.prevBtn.style.cursor = 'pointer';
            this.prevBtn.addEventListener("click", () => {
                // 有上一题
                if (this.currentQuestionIndex > 0) {
                    this.currentQuestionIndex--;
                }
                // 第一题且有上一关，则跳到上一关最后一题
                else if (this.currentQuestionIndex === 0 && this.currentLevelIndex > 0) {
                    this.currentLevelIndex--;
                    const prevLevel = this.getCurrentLevel();
                    this.currentQuestionIndex = prevLevel.questions.length - 1;
                } else {
                    return;
                }
                this.selectedOptionId = null;
                this.updateHeader();
                this.showQuestion();
            });
        }
        // 提交
        if (this.submitBtn) this.submitBtn.addEventListener("click", () => this.handleSubmit());
        // 查看解析
        if (this.analysisBtn) this.analysisBtn.addEventListener("click", () => this.showAnalysis());
        // 碎片区继续
        if (this.fragmentContinueBtn) this.fragmentContinueBtn.addEventListener("click", () => this.handleFragmentContinue());
        // 背包区继续
        if (this.backpackContinueBtn) this.backpackContinueBtn.addEventListener("click", () => this.handleBackpackContinue());
        // 打开背包入口
        if (this.backEntry) {
            this.backEntry.style.cursor = 'pointer';
            this.backEntry.addEventListener("click", () => this.openBackpack());
        }
    }

    getCurrentLevel() {
        return this.data[this.currentLevelIndex];
    }

    // 计算所有层级总题目数
    getTotalQuestions() {
        return this.data.reduce((sum, lvl) => sum + (lvl.questions ? lvl.questions.length : 0), 0);
    }

    // 计算已完成题目数
    getCompletedQuestions() {
        let count = 0;
        this.data.forEach(lvl => {
            lvl.questions.forEach(q => {
                if (q.isCompleted) count++;
            });
        });
        return count;
    }

    updateHeader() {
        const level = this.getCurrentLevel();
        // 更新标题显示当前关卡标题
        if (this.levelTitleElem) this.levelTitleElem.textContent = `当前关卡：${level.title}`;
        // 进度显示所有题目完成进度
        const totalAll = this.getTotalQuestions();
        const doneAll = this.getCompletedQuestions();
        // 更新进度文本
        if (this.progressTextContainer) {
            this.progressTextContainer.innerHTML = `<span style="color: #7a93ff;">已答 ${doneAll}</span>/${totalAll}`;
        }
        // 更新进度条宽度按比例
        if (this.processBarElem) {
            const ratio = totalAll > 0 ? doneAll / totalAll : 0;
            this.processBarElem.style.width = `${ratio * 100}%`;
        }

        // 按钮状态：上一题可见条件
        if (this.prevBtn) {
            const showPrev = this.currentQuestionIndex > 0 || this.currentLevelIndex > 0;
            this.prevBtn.style.visibility = showPrev ? 'visible' : 'hidden';
        }
        // 下一题可见条件
        if (this.nextBtn) {
            const hasNextInLevel = this.currentQuestionIndex < level.questions.length - 1;
            const hasNextLevel = this.currentQuestionIndex === level.questions.length - 1 && this.currentLevelIndex < this.data.length - 1;
            this.nextBtn.style.visibility = (hasNextInLevel || hasNextLevel) ? 'visible' : 'hidden';
        }
        // 清除可能存在的解析
        if (this.analysisTextElem) {
            this.analysisTextElem.remove();
            this.analysisTextElem = null;
        }
    }

    showQuestion() {
        const level = this.getCurrentLevel();
        const question = level.questions[this.currentQuestionIndex];
        // 更新题目内容
        if (this.questionElem) this.questionElem.innerHTML = `<img src="../assets/images/WenTianPavilion/QuestionChar.svg" alt="question"> ${question.title}`;
        // 清空选项
        if (this.optionsContainer) this.optionsContainer.innerHTML = '';
        if (this.optionsContainer) {
            question.options.forEach(opt => {
                const div = document.createElement('div');
                div.classList.add('option');
                div.dataset.id = opt.id;
                div.textContent = opt.content;
                div.style.cursor = 'pointer';
                // 初始无边框
                div.style.border = '1px solid transparent';
                div.addEventListener('click', () => this.selectOption(div));
                this.optionsContainer.appendChild(div);
            });
        }
        // 重置选项
        this.selectedOptionId = null;
        // 重置按钮状态
        if (this.submitBtn) {
            this.submitBtn.style.pointerEvents = 'auto';
            this.submitBtn.style.opacity = '1';
        }
        if (this.analysisBtn) this.analysisBtn.style.display = 'none';
    }

    selectOption(div) {
        if (this.optionsContainer) {
            Array.from(this.optionsContainer.children).forEach(child => {
                child.classList.remove('selected');
            });
        }
        div.classList.add('selected');
        // 增加边框提示
        div.style.borderBottom = '2px solid rgba(127, 48, 150, 1)';
        div.style.borderRadius = '10px';
        this.selectedOptionId = div.dataset.id;
    }

    handleSubmit() {
        const level = this.getCurrentLevel();
        const question = level.questions[this.currentQuestionIndex];
        if (!this.selectedOptionId) {
            return;
        }
        // 禁止重复提交
        if (this.submitBtn) {
            this.submitBtn.style.pointerEvents = 'none';
            this.submitBtn.style.opacity = '0.6';
        }
        // 标记已完成
        question.isCompleted = true;
        // 显示解析按钮
        if (this.analysisBtn) this.analysisBtn.style.display = 'flex';
        // 检查答案正确性
        const correct = this.selectedOptionId === question.answer;
        // 可选：高亮正确或错误
        if (this.optionsContainer) {
            Array.from(this.optionsContainer.children).forEach(child => {
                if (child.dataset.id === question.answer) {
                    child.style.backgroundColor = '#e0ffe0';
                } else if (child.classList.contains('selected') && !correct) {
                    child.style.backgroundColor = '#ffe0e0';
                }
            });
        }
        // 无论正确与否，只要是最后一题，都完成关卡
        if (this.currentQuestionIndex === level.questions.length - 1) {
            level.isCompleted = true;
            // 收集碎片
            this.currentRewardFragments.push(level.reward);
            // 如果是最后关卡，直接显示拼图页面
            if (this.currentLevelIndex === this.data.length - 1) {
                this.isAllLevelCompleted = true;
                // 隐藏所有其他界面，显示拼图
                this.showHideController([
                    this.qaBox,
                    this.levelInfo,
                    this.fragmentBox,
                    this.backEntry,
                    this.backpackBox
                ], [this.puzzleBox]);
                this.renderPuzzle();
            } else {
                this.collectFragment();
            }
        }
    }

    showAnalysis() {
        if (this.analysisTextElem) return;
        const level = this.getCurrentLevel();
        const question = level.questions[this.currentQuestionIndex];
        const div = document.createElement('div');
        div.classList.add('analysis-text');
        div.textContent = question.analysis;
        if (this.qaBox) this.qaBox.appendChild(div);
        this.analysisTextElem = div;
    }

    collectFragment() {
        const level = this.getCurrentLevel();
        this.showHideController([
            this.qaBox,
            this.levelInfo,
            this.backEntry
        ], [this.fragmentBox]);
        if (this.fragmentImgElem) this.fragmentImgElem.src = level.reward;
        const totalLevels = this.data.length;
        const got = this.currentRewardFragments.length;
        if (this.fragmentProgressElem) this.fragmentProgressElem.textContent = `碎片获取进度 ${got}/${totalLevels}`;
    }

    handleFragmentContinue() {
        if (this.currentLevelIndex < this.data.length - 1) {
            this.currentLevelIndex++;
            this.currentQuestionIndex = 0;
            this.selectedOptionId = null;
            this.showHideController([
                this.fragmentBox
            ], [this.levelInfo, this.qaBox, this.backEntry]);
            this.updateHeader();
            this.showQuestion();
        } else {
            this.isAllLevelCompleted = true;
            this.showHideController([
                this.fragmentBox,
                this.levelInfo,
                this.qaBox
            ], [this.backEntry, this.backpackBox]);
            this.renderBackpack();
        }
    }

    openBackpack() {
        this.showHideController([
            this.initInfo,
            this.startContent,
            this.levelInfo,
            this.qaBox,
            this.fragmentBox,
            this.puzzleBox
        ], [this.backpackBox]);
        this.renderBackpack();
    }

    renderBackpack() {
        const totalLevels = this.data.length;
        const got = this.currentRewardFragments.length;
        if (this.backpackInfoElem) this.backpackInfoElem.textContent = `碎片收集进度 ${got}/${totalLevels}`;
        if (this.backpackItemContainer) this.backpackItemContainer.innerHTML = '';
        for (let i = 0; i < totalLevels; i++) {
            const img = document.createElement('img');
            if (i < got) {
                img.src = this.currentRewardFragments[i];
                img.alt = 'fragment';
            } else {
                img.src = '../assets/images/WenTianPavilion/unkonw.svg';
                img.alt = 'unkonw';
            }
            if (this.backpackItemContainer) this.backpackItemContainer.appendChild(img);
        }
        if (got === totalLevels) {
            this.showHideController([
                this.initInfo,
                this.startContent,
                this.levelInfo,
                this.qaBox,
                this.fragmentBox,
                this.backEntry
            ], [this.puzzleBox]);
            this.renderPuzzle();
        }
    }

    handleBackpackContinue() {
        if (this.isAllLevelCompleted) {
            this.openBackpack();
        } else {
            this.showHideController([
                this.backpackBox
            ], [this.levelInfo, this.qaBox, this.backEntry]);
            this.updateHeader();
            this.showQuestion();
        }
    }

    renderPuzzle() {
        if (this.puzzleInfoElem) this.puzzleInfoElem.textContent = '拖拽完成拼图';
        // 此处可初始化拼图逻辑
    }

    showHideController(hiddenControllers, showControllers) {
        hiddenControllers.forEach(controller => {
            if (controller) controller.style.display = 'none';
        });
        showControllers.forEach(controller => {
            if (controller) controller.style.display = 'flex';
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const qaContainer = document.querySelector('.qa-container');
    new Mouse({
        defaultCursor: '../assets/images/common/MouseDefault.svg',
        clickCursor: '../assets/images/common/MouseClick.svg',
    });
    new StarBackground(qaContainer, {
        starCount: 300,
        starSizeMin: 0.08,
        starSizeMax: 0.16,
        xSpeed: 0.0002,
        ySpeed: 0.0002,
        elapsed: 0
    });
    new QAController(data);
});
