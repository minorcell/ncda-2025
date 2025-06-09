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

        // 当前关卡索引
        this.currentLevelIndex = 0;

        // 当前问题索引
        this.currentQuestionIndex = 0;

        // 存储用户已选择的选项（可选）
        this.selectedOptions = new Map(); // key: questionId, value: optionId

        // 存储已获得的奖励
        this.rewards = [];

        // 初始化界面
        this.initUI();

        // 渲染第一个题目
        this.renderCurrentQuestion();
    }

    /* TODO:
     * 1. 获取当前关卡对象
     */
    getCurrentLevel() {
        return this.data[this.currentLevelIndex];
    }

    /*
     * 2. 获取当前关卡的当前问题
     */
    getCurrentQuestion() {
        const level = this.getCurrentLevel();
        return level.questions[this.currentQuestionIndex];
    }

    /*
     * 3. 获取当前问题选项及选中状态
     */
    getCurrentOptions() {
        const question = this.getCurrentQuestion();
        const selectedId = this.selectedOptions.get(question.id);
        return question.options.map(opt => ({
            ...opt,
            isSelected: opt.id === selectedId
        }));
    }

    /*
     * 4. 处理按钮交互：提交答案、查看解析、下一题、上一题
     */
    handleSubmit() {
        const question = this.getCurrentQuestion();
        const selectedId = this.selectedOptions.get(question.id);
        if (!selectedId) {
            alert('请先选择一个答案！');
            return;
        }

        question.isCompleted = true;

        const level = this.getCurrentLevel();
        const isLevelCompleted = level.questions.every(q => q.isCompleted);

        if (isLevelCompleted && !level.isCompleted) {
            level.isCompleted = true;

            // 只有第一次完成才加奖励
            if (!this.rewards.includes(level.reward)) {
                this.rewards.push(level.reward);
                this.updateRewardsUI(); // 添加奖励 UI 更新
            }
        }

        this.renderCurrentQuestion();
        this.updateProgress();
    }


    handleOptionSelect(optionId) {
        const question = this.getCurrentQuestion();
        this.selectedOptions.set(question.id, optionId);
        this.renderCurrentQuestion();
    }

    handleNext() {
        const level = this.getCurrentLevel();
        if (this.currentQuestionIndex < level.questions.length - 1) {
            this.currentQuestionIndex++;
        } else if (this.currentLevelIndex < this.data.length - 1) {
            this.currentLevelIndex++;
            this.currentQuestionIndex = 0;
        }
        this.renderCurrentQuestion();
    }

    handlePrev() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
        } else if (this.currentLevelIndex > 0) {
            this.currentLevelIndex--;
            const prevLevel = this.getCurrentLevel();
            this.currentQuestionIndex = prevLevel.questions.length - 1;
        }
        this.renderCurrentQuestion();
    }

    /*
     * 5. 更新整体进度 “x/总题数”
     */
    updateProgress() {
        const total = this.data.reduce((sum, level) => sum + level.questions.length, 0);
        const completed = this.data.reduce((sum, level) =>
            sum + level.questions.filter(q => q.isCompleted).length, 0
        );
        // 更新 UI
        document.querySelector('#progressText').innerText = `${completed}/${total}`;
    }

    /*
     * 6. 当前已获得的奖励
     */
    getEarnedRewards() {
        return this.rewards;
    }

    /*
     * 7. 初始化界面元素、事件绑定等
     */
    initUI() {
        // 绑定按钮
        document.querySelector('#submitBtn').addEventListener('click', () => this.handleSubmit());
        document.querySelector('#nextBtn').addEventListener('click', () => this.handleNext());
        document.querySelector('#prevBtn').addEventListener('click', () => this.handlePrev());
        // 可添加更多初始化逻辑
    }

    /*
     * 8. 渲染当前题目 UI（问题、选项、是否完成、答案解析等）
     */
    renderCurrentQuestion() {
        const level = this.getCurrentLevel();
        const question = this.getCurrentQuestion();
        const options = this.getCurrentOptions();

        document.querySelector('#levelTitle').innerText = level.title;
        document.querySelector('#questionTitle').innerText = question.title;

        const optionsContainer = document.querySelector('#optionsContainer');
        optionsContainer.innerHTML = '';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.innerText = opt.content;
            btn.className = `option-btn ${opt.isSelected ? 'selected' : ''}`;
            btn.addEventListener('click', () => this.handleOptionSelect(opt.id));
            optionsContainer.appendChild(btn);
        });

        const analysisBox = document.querySelector('#analysis');
        if (question.isCompleted) {
            analysisBox.innerText = question.analysis;
            analysisBox.style.display = 'block';
        } else {
            analysisBox.style.display = 'none';
        }

        this.updateProgress();
    }

    /*
     * 9. 渲染已获得的奖励
     */
    updateRewardsUI() {
        const rewardsContainer = document.querySelector('#rewardsContainer');
        rewardsContainer.innerHTML = '';
        this.rewards.forEach(imgPath => {
            const img = document.createElement('img');
            img.src = imgPath;
            img.alt = 'Reward';
            rewardsContainer.appendChild(img);
        });
    }

}


document.addEventListener("DOMContentLoaded", () => {
    // 初始化鼠标控制器
    new Mouse({
        defaultCursor: '../assets/images/common/MouseDefault.svg',
        clickCursor: '../assets/images/common/MouseClick.svg',
    });

    // 初始化QA控制器
    // new QAController(data);
});
