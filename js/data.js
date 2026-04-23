// 题库数据
const questionBank = [
    {
        id: 1,
        subject: 'math',
        type: 'single',
        difficulty: 'easy',
        question: '下列哪个数是质数？',
        options: ['4', '9', '11', '15'],
        answer: 2,
        explanation: '质数是指大于1的自然数，除了1和它本身以外不再有其他因数。11只能被1和11整除，因此是质数。'
    },
    {
        id: 2,
        subject: 'math',
        type: 'single',
        difficulty: 'medium',
        question: '函数 f(x) = x² - 4x + 3 的最小值是多少？',
        options: ['-1', '0', '1', '3'],
        answer: 0,
        explanation: '这是一个二次函数，开口向上。顶点坐标为 x = -b/(2a) = 4/2 = 2，f(2) = 4 - 8 + 3 = -1。'
    },
    {
        id: 3,
        subject: 'math',
        type: 'multiple',
        difficulty: 'medium',
        question: '下列哪些是三角函数？',
        options: ['sin(x)', 'cos(x)', 'tan(x)', 'log(x)'],
        answer: [0, 1, 2],
        explanation: 'sin(x)、cos(x)、tan(x)都是三角函数，而log(x)是对数函数。'
    },
    {
        id: 4,
        subject: 'math',
        type: 'judge',
        difficulty: 'easy',
        question: '圆的周长公式是 C = 2πr',
        options: ['正确', '错误'],
        answer: 0,
        explanation: '圆的周长公式确实是 C = 2πr，其中r是圆的半径。'
    },
    {
        id: 5,
        subject: 'math',
        type: 'fill',
        difficulty: 'medium',
        question: '等差数列 2, 5, 8, 11... 的公差是____',
        answer: '3',
        explanation: '等差数列的公差是相邻两项的差，5-2=3，8-5=3，所以公差是3。'
    },
    {
        id: 6,
        subject: 'english',
        type: 'single',
        difficulty: 'easy',
        question: '"I have two ______." 空格处应填什么？',
        options: ['sister', 'sisters', 'sisters\'', 'sisteres'],
        answer: 1,
        explanation: 'two后面接可数名词复数形式，sister的复数是sisters。'
    },
    {
        id: 7,
        subject: 'english',
        type: 'single',
        difficulty: 'medium',
        question: 'Which sentence is grammatically correct?',
        options: [
            'She don\'t like apples.',
            'She doesn\'t likes apples.',
            'She doesn\'t like apples.',
            'She not like apples.'
        ],
        answer: 2,
        explanation: '第三人称单数否定句用doesn\'t + 动词原形，所以"She doesn\'t like apples."是正确的。'
    },
    {
        id: 8,
        subject: 'english',
        type: 'judge',
        difficulty: 'easy',
        question: '"Goodbye" 和 "See you" 都可以用来道别。',
        options: ['正确', '错误'],
        answer: 0,
        explanation: '"Goodbye"和"See you"都是英语中常用的道别用语。'
    },
    {
        id: 9,
        subject: 'physics',
        type: 'single',
        difficulty: 'medium',
        question: '光在真空中的传播速度约为？',
        options: ['3×10⁶ m/s', '3×10⁷ m/s', '3×10⁸ m/s', '3×10⁹ m/s'],
        answer: 2,
        explanation: '光在真空中的传播速度约为3×10⁸ m/s（即300,000 km/s）。'
    },
    {
        id: 10,
        subject: 'physics',
        type: 'single',
        difficulty: 'hard',
        question: '根据牛顿第二定律 F = ma，如果质量不变，力增大为原来的2倍，加速度会？',
        options: ['不变', '变为原来的一半', '变为原来的2倍', '变为原来的4倍'],
        answer: 2,
        explanation: '根据F=ma，当m不变时，a与F成正比。F增大2倍，a也增大2倍。'
    },
    {
        id: 11,
        subject: 'chemistry',
        type: 'single',
        difficulty: 'easy',
        question: '水的化学式是？',
        options: ['CO₂', 'H₂O', 'O₂', 'NaCl'],
        answer: 1,
        explanation: '水由氢元素和氧元素组成，化学式为H₂O。'
    },
    {
        id: 12,
        subject: 'chemistry',
        type: 'multiple',
        difficulty: 'medium',
        question: '下列哪些是金属元素？',
        options: ['铁(Fe)', '铜(Cu)', '氧(O)', '金(Au)'],
        answer: [0, 1, 3],
        explanation: '铁、铜、金都是金属元素，氧是非金属元素。'
    },
    {
        id: 13,
        subject: 'computer',
        type: 'single',
        difficulty: 'easy',
        question: 'HTML是什么的缩写？',
        options: [
            'Hyper Text Markup Language',
            'High Tech Modern Language',
            'Hyper Transfer Make Link',
            'Home Tool Markup Language'
        ],
        answer: 0,
        explanation: 'HTML是Hyper Text Markup Language（超文本标记语言）的缩写。'
    },
    {
        id: 14,
        subject: 'computer',
        type: 'single',
        difficulty: 'medium',
        question: '在编程中，"for"循环通常用于？',
        options: [
            '条件判断',
            '重复执行固定次数的代码',
            '定义函数',
            '处理异常'
        ],
        answer: 1,
        explanation: 'for循环用于重复执行固定次数的代码，是迭代控制结构。'
    },
    {
        id: 15,
        subject: 'computer',
        type: 'judge',
        difficulty: 'easy',
        question: '1KB等于1024字节。',
        options: ['正确', '错误'],
        answer: 0,
        explanation: '在计算机中，1KB（千字节）等于1024字节（2的10次方）。'
    }
];

// AI题目模板库
const aiQuestionTemplates = {
    math: {
        easy: [
            {
                pattern: '计算 {a} + {b}',
                generator: () => {
                    const a = Math.floor(Math.random() * 50) + 1;
                    const b = Math.floor(Math.random() * 50) + 1;
                    return {
                        question: `计算 ${a} + ${b} = ?`,
                        options: [a + b, a + b + 5, a + b - 3, a + b + 10].sort(() => Math.random() - 0.5),
                        answer: 0,
                        explanation: `${a} + ${b} = ${a + b}`
                    };
                }
            },
            {
                pattern: '找出最大的数',
                generator: () => {
                    const nums = [12, 45, 23, 67, 34].sort(() => Math.random() - 0.5).slice(0, 4);
                    const max = Math.max(...nums);
                    return {
                        question: `下列哪个数最大？`,
                        options: nums,
                        answer: nums.indexOf(max),
                        explanation: `在给定的数字中，${max}是最大的。`
                    };
                }
            }
        ],
        medium: [
            {
                pattern: '解方程',
                generator: () => {
                    const a = Math.floor(Math.random() * 5) + 2;
                    const x = Math.floor(Math.random() * 10) + 1;
                    const b = a * x;
                    return {
                        question: `解方程：${a}x = ${b}`,
                        options: [x, x + 1, x - 1, x + 2].sort(() => Math.random() - 0.5),
                        answer: 0,
                        explanation: `${a}x = ${b}，所以 x = ${b} ÷ ${a} = ${x}`
                    };
                }
            },
            {
                pattern: '百分比计算',
                generator: () => {
                    const total = 100;
                    const percent = Math.floor(Math.random() * 40) + 10;
                    const result = Math.round(total * percent / 100);
                    return {
                        question: `${total}的${percent}%是多少？`,
                        options: [result, result + 5, result - 5, result + 10].sort(() => Math.random() - 0.5),
                        answer: 0,
                        explanation: `${total} × ${percent}% = ${total} × 0.${percent} = ${result}`
                    };
                }
            }
        ],
        hard: [
            {
                pattern: '二次方程',
                generator: () => {
                    const roots = [Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 6];
                    const sum = roots[0] + roots[1];
                    const product = roots[0] * roots[1];
                    return {
                        question: `方程 x² - ${sum}x + ${product} = 0 的根是？`,
                        options: [`x=${roots[0]}或x=${roots[1]}`, `x=${roots[0]+1}或x=${roots[1]}`, `x=${roots[0]}或x=${roots[1]+1}`, `x=${roots[0]-1}或x=${roots[1]}`],
                        answer: 0,
                        explanation: `根据韦达定理，x² - (${sum})x + ${product} = (x-${roots[0]})(x-${roots[1]}) = 0，所以x=${roots[0]}或x=${roots[1]}`
                    };
                }
            }
        ]
    },
    english: {
        easy: [
            {
                pattern: '词汇选择',
                generator: () => {
                    const words = [
                        {word: 'apple', translate: '苹果'},
                        {word: 'book', translate: '书'},
                        {word: 'cat', translate: '猫'},
                        {word: 'dog', translate: '狗'}
                    ];
                    const target = words[Math.floor(Math.random() * words.length)];
                    const options = words.map(w => w.word).sort(() => Math.random() - 0.5);
                    return {
                        question: `"${target.translate}"的英文单词是？`,
                        options: options,
                        answer: options.indexOf(target.word),
                        explanation: `"${target.translate}"的英文是"${target.word}"。`
                    };
                }
            }
        ],
        medium: [
            {
                pattern: '时态选择',
                generator: () => {
                    const sentences = [
                        {text: 'I _____ to school yesterday.', verb: 'go', past: 'went', options: ['go', 'went', 'gone', 'going']},
                        {text: 'She _____ English for 5 years.', verb: 'study', past: 'has studied', options: ['studies', 'studied', 'has studied', 'is studying']}
                    ];
                    const s = sentences[Math.floor(Math.random() * sentences.length)];
                    return {
                        question: s.text,
                        options: s.options,
                        answer: s.options.indexOf(s.past),
                        explanation: `根据句意和时间状语，这里应该使用正确的时态形式。`
                    };
                }
            }
        ]
    },
    physics: {
        easy: [
            {
                pattern: '基础概念',
                generator: () => {
                    const concepts = [
                        {q: '力的单位是？', options: ['牛顿(N)', '千克(kg)', '米(m)', '秒(s)'], a: 0, exp: '力的国际单位是牛顿，符号为N。'},
                        {q: '声音在下列哪种介质中传播最快？', options: ['空气', '水', '钢铁', '真空'], a: 2, exp: '声音在固体中传播最快，钢铁是固体，所以传播速度最快。'}
                    ];
                    const c = concepts[Math.floor(Math.random() * concepts.length)];
                    return {
                        question: c.q,
                        options: c.options,
                        answer: c.a,
                        explanation: c.exp
                    };
                }
            }
        ],
        medium: [
            {
                pattern: '简单计算',
                generator: () => {
                    const v = Math.floor(Math.random() * 20) + 10;
                    const t = Math.floor(Math.random() * 10) + 2;
                    const s = v * t;
                    return {
                        question: `一个物体以${v}m/s的速度匀速运动${t}秒，通过的路程是？`,
                        options: [`${s}m`, `${s + 10}m`, `${s - 10}m`, `${s * 2}m`],
                        answer: 0,
                        explanation: `根据公式 s = vt，路程 = ${v} × ${t} = ${s}m`
                    };
                }
            }
        ]
    },
    chemistry: {
        easy: [
            {
                pattern: '元素知识',
                generator: () => {
                    const elements = [
                        {symbol: 'O', name: '氧', number: 8},
                        {symbol: 'H', name: '氢', number: 1},
                        {symbol: 'C', name: '碳', number: 6},
                        {symbol: 'N', name: '氮', number: 7}
                    ];
                    const e = elements[Math.floor(Math.random() * elements.length)];
                    return {
                        question: `元素符号"${e.symbol}"代表什么元素？`,
                        options: elements.map(el => el.name).sort(() => Math.random() - 0.5),
                        answer: 0,
                        explanation: `"${e.symbol}"是${e.name}元素的化学符号。`
                    };
                }
            }
        ]
    },
    computer: {
        easy: [
            {
                pattern: '基础概念',
                generator: () => {
                    const concepts = [
                        {q: 'CPU是什么的缩写？', options: ['中央处理器', '内存', '硬盘', '显卡'], a: 0, exp: 'CPU是Central Processing Unit（中央处理器）的缩写。'},
                        {q: '以下哪个是编程语言？', options: ['HTML', 'Python', 'HTTP', 'URL'], a: 1, exp: 'Python是一种高级编程语言，HTML是标记语言，HTTP是协议，URL是地址格式。'}
                    ];
                    const c = concepts[Math.floor(Math.random() * concepts.length)];
                    return {
                        question: c.q,
                        options: c.options,
                        answer: c.a,
                        explanation: c.exp
                    };
                }
            }
        ],
        medium: [
            {
                pattern: '算法概念',
                generator: () => {
                    return {
                        question: '以下哪种数据结构是"先进先出"的？',
                        options: ['栈(Stack)', '队列(Queue)', '链表(Linked List)', '树(Tree)'],
                        answer: 1,
                        explanation: '队列(Queue)是先进先出(FIFO)的数据结构，而栈是后进先出(LIFO)。'
                    };
                }
            }
        ]
    }
};

// 学习记录数据
let studyHistory = JSON.parse(localStorage.getItem('studyHistory')) || [];
let wrongNotes = JSON.parse(localStorage.getItem('wrongNotes')) || [];
let studyStats = JSON.parse(localStorage.getItem('studyStats')) || {
    completed: 0,
    correct: 0,
    totalTime: 0,
    streakDays: 1,
    lastStudyDate: new Date().toDateString()
};

// 保存学习记录
function saveStudyHistory(record) {
    studyHistory.unshift(record);
    if (studyHistory.length > 100) studyHistory.pop();
    localStorage.setItem('studyHistory', JSON.stringify(studyHistory));
}

// 保存错题
function saveWrongNote(question, userAnswer) {
    const existing = wrongNotes.find(n => n.id === question.id);
    if (!existing) {
        wrongNotes.push({
            ...question,
            userAnswer,
            timestamp: new Date().toISOString(),
            mastered: false
        });
        localStorage.setItem('wrongNotes', JSON.stringify(wrongNotes));
    }
}

// 更新统计
function updateStats(correct, timeSpent) {
    studyStats.completed++;
    if (correct) studyStats.correct++;
    studyStats.totalTime += timeSpent;
    
    // 更新连续学习天数
    const today = new Date().toDateString();
    const lastDate = new Date(studyStats.lastStudyDate);
    const diffDays = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        studyStats.streakDays++;
    } else if (diffDays > 1) {
        studyStats.streakDays = 1;
    }
    studyStats.lastStudyDate = today;
    
    localStorage.setItem('studyStats', JSON.stringify(studyStats));
}

// 导出数据
window.questionBank = questionBank;
window.aiQuestionTemplates = aiQuestionTemplates;
window.studyHistory = studyHistory;
window.wrongNotes = wrongNotes;
window.studyStats = studyStats;
window.saveStudyHistory = saveStudyHistory;
window.saveWrongNote = saveWrongNote;
window.updateStats = updateStats;
