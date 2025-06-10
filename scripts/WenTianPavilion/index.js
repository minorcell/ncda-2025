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
        reward: "../../assets/images/WenTianPavilion/back01.png",
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
        reward: "../../assets/images/WenTianPavilion/back02.png",
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
        reward: "../../assets/images/WenTianPavilion/back03.png",
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
        reward: "../../assets/images/WenTianPavilion/back04.png",
    }
]

// TODO: 答题控制器
class QAController {
    
}

document.addEventListener("DOMContentLoaded", () => {
    const qaContainer = document.querySelector('.qa-container');
    const startContent = document.querySelector('.start-content');
    const qaBox = document.querySelector(".qa-box")
    const fragmentBox = document.querySelector(".fragment-box")
    const backpackBox = document.querySelector(".backpack-box")
    const initInfo = document.querySelector(".init-info")
    const levelInfo = document.querySelector(".level-info")
    // 初始化鼠标控制器
    new Mouse({
        defaultCursor: '../assets/images/common/MouseDefault.svg',
        clickCursor: '../assets/images/common/MouseClick.svg',
    });

    // 初始化星空背景
    new StarBackground(qaContainer, {
        starCount: 300,
        starSizeMin: 0.08,
        starSizeMax: 0.16,
        xSpeed: 0.0002,
        ySpeed: 0.0002,
        elapsed: 0
    });

    // 初始化QA控制器
    // new QAController(data);

    // 开发调试
    startContent.style.display = 'none'
    qaBox.style.display = 'none'
    fragmentBox.style.display = 'none'
    backpackBox.style.display = 'none'
    initInfo.style.display = 'none'
});
