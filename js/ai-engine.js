// AI智能出题引擎
class AIQuestionEngine {
    constructor() {
        this.templates = window.aiQuestionTemplates || {};
        this.subjects = ['math', 'english', 'physics', 'chemistry', 'computer'];
    }

    // 根据主题智能匹配科目
    detectSubject(topic) {
        const keywords = {
            math: ['数学', '代数', '几何', '微积分', '函数', '方程', '计算', '数列', '概率', '统计'],
            english: ['英语', '语法', '单词', '词汇', '阅读', '写作', '听力', '口语', '时态'],
            physics: ['物理', '力学', '电磁', '光学', '热学', '运动', '能量', '力'],
            chemistry: ['化学', '元素', '化合物', '反应', '分子', '原子', '酸碱', '有机'],
            computer: ['计算机', '编程', '代码', '算法', '数据结构', '网络', '数据库', '前端', '后端']
        };

        for (const [subject, words] of Object.entries(keywords)) {
            if (words.some(w => topic.toLowerCase().includes(w.toLowerCase()))) {
                return subject;
            }
        }
        return 'math'; // 默认数学
    }

    // 生成题目
    generateQuestions(topic, count, difficulty, types) {
        const subject = this.detectSubject(topic);
        const questions = [];
        const templates = this.templates[subject]?.[difficulty] || this.templates['math']?.[difficulty] || [];
        
        for (let i = 0; i < count; i++) {
            const template = templates[i % templates.length];
            if (template) {
                const generated = template.generator();
                const type = types[i % types.length] || 'single';
                
                questions.push({
                    id: Date.now() + i,
                    subject,
                    type,
                    difficulty,
                    topic,
                    question: generated.question,
                    options: generated.options,
                    answer: generated.answer,
                    explanation: generated.explanation,
                    isAIGenerated: true
                });
            }
        }

        // 如果模板不够，使用智能生成
        while (questions.length < count) {
            questions.push(this.smartGenerate(topic, subject, difficulty, types[questions.length % types.length]));
        }

        return questions;
    }

    // 智能生成题目（基于主题的智能算法）
    smartGenerate(topic, subject, difficulty, type) {
        const generators = {
            math: () => this.generateMathQuestion(difficulty),
            english: () => this.generateEnglishQuestion(difficulty),
            physics: () => this.generatePhysicsQuestion(difficulty),
            chemistry: () => this.generateChemistryQuestion(difficulty),
            computer: () => this.generateComputerQuestion(difficulty)
        };

        const generator = generators[subject] || generators['math'];
        return generator();
    }

    // 生成数学题
    generateMathQuestion(difficulty) {
        const generators = {
            easy: () => {
                const a = Math.floor(Math.random() * 20) + 1;
                const b = Math.floor(Math.random() * 20) + 1;
                const ops = ['+', '-'];
                const op = ops[Math.floor(Math.random() * ops.length)];
                let answer, question;
                
                if (op === '+') {
                    answer = a + b;
                    question = `${a} + ${b} = ?`;
                } else {
                    const max = Math.max(a, b);
                    const min = Math.min(a, b);
                    answer = max - min;
                    question = `${max} - ${min} = ?`;
                }
                
                const options = [answer, answer + 5, answer - 3, answer + 10].sort(() => Math.random() - 0.5);
                
                return {
                    question,
                    options,
                    answer: options.indexOf(answer),
                    explanation: `${question.replace(' = ?', '')} = ${answer}`
                };
            },
            medium: () => {
                const patterns = [
                    () => {
                        const a = Math.floor(Math.random() * 10) + 2;
                        const b = Math.floor(Math.random() * 10) + 1;
                        const answer = a * b;
                        return {
                            question: `${a} × ${b} = ?`,
                            options: [answer, answer + a, answer - b, answer + 10].sort(() => Math.random() - 0.5),
                            answer: 0,
                            explanation: `${a} × ${b} = ${answer}`
                        };
                    },
                    () => {
                        const num = Math.floor(Math.random() * 50) + 50;
                        const percent = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
                        const answer = num * percent / 100;
                        return {
                            question: `${num}的${percent}%是多少？`,
                            options: [answer, answer + 5, answer - 5, answer * 2].sort(() => Math.random() - 0.5),
                            answer: 0,
                            explanation: `${num} × ${percent}% = ${num} × 0.${percent} = ${answer}`
                        };
                    }
                ];
                const gen = patterns[Math.floor(Math.random() * patterns.length)];
                return gen();
            },
            hard: () => {
                const a = Math.floor(Math.random() * 5) + 1;
                const b = Math.floor(Math.random() * 20) + 5;
                const c = Math.floor(Math.random() * 10) + 1;
                const answer = a * b + c;
                
                return {
                    question: `计算：${a} × ${b} + ${c} = ?`,
                    options: [answer, answer + 5, answer - 5, answer + 10].sort(() => Math.random() - 0.5),
                    answer: 0,
                    explanation: `${a} × ${b} + ${c} = ${a * b} + ${c} = ${answer}`
                };
            }
        };
        
        const gen = generators[difficulty] || generators['easy'];
        const result = gen();
        
        return {
            id: Date.now(),
            subject: 'math',
            type: 'single',
            difficulty,
            question: result.question,
            options: result.options,
            answer: result.answer,
            explanation: result.explanation,
            isAIGenerated: true
        };
    }

    // 生成英语题
    generateEnglishQuestion(difficulty) {
        const vocab = {
            easy: [
                {word: 'apple', meaning: '苹果', options: ['苹果', '香蕉', '橙子', '梨']},
                {word: 'book', meaning: '书', options: ['书', '笔', '纸', '桌子']},
                {word: 'cat', meaning: '猫', options: ['猫', '狗', '鸟', '鱼']},
                {word: 'happy', meaning: '快乐的', options: ['快乐的', '悲伤的', '生气的', '累的']}
            ],
            medium: [
                {word: 'environment', meaning: '环境', options: ['环境', '经济', '教育', '科技']},
                {word: 'technology', meaning: '技术', options: ['技术', '科学', '艺术', '历史']}
            ],
            hard: [
                {word: 'extraordinary', meaning: '非凡的', options: ['非凡的', '普通的', '无聊的', '简单的']}
            ]
        };
        
        const words = vocab[difficulty] || vocab['easy'];
        const word = words[Math.floor(Math.random() * words.length)];
        
        return {
            id: Date.now(),
            subject: 'english',
            type: 'single',
            difficulty,
            question: `"${word.word}"的中文意思是？`,
            options: word.options,
            answer: 0,
            explanation: `"${word.word}"的意思是"${word.meaning}"。`,
            isAIGenerated: true
        };
    }

    // 生成物理题
    generatePhysicsQuestion(difficulty) {
        const questions = {
            easy: [
                {
                    question: '光在真空中的传播速度约为？',
                    options: ['3×10⁸ m/s', '3×10⁶ m/s', '3×10⁷ m/s', '3×10⁹ m/s'],
                    answer: 0,
                    explanation: '光在真空中的速度约为3×10⁸ m/s。'
                },
                {
                    question: '力的单位是？',
                    options: ['牛顿(N)', '千克(kg)', '米(m)', '帕斯卡(Pa)'],
                    answer: 0,
                    explanation: '力的国际单位是牛顿(N)。'
                }
            ],
            medium: [
                {
                    question: '一个物体质量为10kg，受到20N的力，其加速度为？',
                    options: ['2 m/s²', '0.5 m/s²', '5 m/s²', '10 m/s²'],
                    answer: 0,
                    explanation: '根据F=ma，a=F/m=20/10=2 m/s²'
                }
            ],
            hard: [
                {
                    question: '一个物体从静止开始自由下落，3秒后的速度约为？（g=10m/s²）',
                    options: ['30 m/s', '15 m/s', '45 m/s', '20 m/s'],
                    answer: 0,
                    explanation: 'v = gt = 10 × 3 = 30 m/s'
                }
            ]
        };
        
        const qs = questions[difficulty] || questions['easy'];
        const q = qs[Math.floor(Math.random() * qs.length)];
        
        return {
            id: Date.now(),
            subject: 'physics',
            type: 'single',
            difficulty,
            ...q,
            isAIGenerated: true
        };
    }

    // 生成化学题
    generateChemistryQuestion(difficulty) {
        const elements = [
            {symbol: 'H', name: '氢', number: 1},
            {symbol: 'O', name: '氧', number: 8},
            {symbol: 'C', name: '碳', number: 6},
            {symbol: 'N', name: '氮', number: 7},
            {symbol: 'Na', name: '钠', number: 11},
            {symbol: 'Cl', name: '氯', number: 17}
        ];
        
        const e = elements[Math.floor(Math.random() * elements.length)];
        const otherElements = elements.filter(el => el.symbol !== e.symbol).slice(0, 3);
        const options = [e.name, ...otherElements.map(el => el.name)].sort(() => Math.random() - 0.5);
        
        return {
            id: Date.now(),
            subject: 'chemistry',
            type: 'single',
            difficulty,
            question: `元素符号"${e.symbol}"代表的元素名称是？`,
            options,
            answer: options.indexOf(e.name),
            explanation: `"${e.symbol}"是${e.name}元素的化学符号，原子序数为${e.number}。`,
            isAIGenerated: true
        };
    }

    // 生成计算机题
    generateComputerQuestion(difficulty) {
        const questions = {
            easy: [
                {
                    question: 'HTML是什么的缩写？',
                    options: ['超文本标记语言', '超文本传输协议', '高级文本语言', '主页标记语言'],
                    answer: 0,
                    explanation: 'HTML是HyperText Markup Language（超文本标记语言）的缩写。'
                },
                {
                    question: '1KB等于多少字节？',
                    options: ['1024字节', '1000字节', '512字节', '2048字节'],
                    answer: 0,
                    explanation: '1KB = 1024字节（2的10次方）。'
                }
            ],
            medium: [
                {
                    question: '以下哪种数据结构是"先进先出"的？',
                    options: ['队列(Queue)', '栈(Stack)', '链表(List)', '树(Tree)'],
                    answer: 0,
                    explanation: '队列(Queue)遵循先进先出(FIFO)原则。'
                }
            ],
            hard: [
                {
                    question: '时间复杂度为O(n log n)的排序算法是？',
                    options: ['快速排序', '冒泡排序', '选择排序', '插入排序'],
                    answer: 0,
                    explanation: '快速排序的平均时间复杂度为O(n log n)。'
                }
            ]
        };
        
        const qs = questions[difficulty] || questions['easy'];
        const q = qs[Math.floor(Math.random() * qs.length)];
        
        return {
            id: Date.now(),
            subject: 'computer',
            type: 'single',
            difficulty,
            ...q,
            isAIGenerated: true
        };
    }

    // 生成智能解析
    generateExplanation(question, userAnswer, isCorrect) {
        const explanations = {
            correct: [
                '回答正确！这道题考查了基础知识，你的掌握情况很好。',
                '很棒！你做对了。建议继续巩固相关知识点。',
                '正确！这道题的关键在于理解核心概念。'
            ],
            wrong: [
                `这道题的正确答案是选项${String.fromCharCode(65 + question.answer)}。`,
                '回答错误，让我来帮你分析一下：',
                '这道题有一定难度，我们来详细解析一下：'
            ]
        };

        let explanation = isCorrect 
            ? explanations.correct[Math.floor(Math.random() * explanations.correct.length)]
            : explanations.wrong[Math.floor(Math.random() * explanations.wrong.length)];

        explanation += '\n\n' + question.explanation;

        // 添加学习建议
        if (!isCorrect) {
            explanation += '\n\n💡 学习建议：';
            explanation += '\n• 仔细理解题目考查的核心知识点';
            explanation += '\n• 建议复习相关章节内容';
            explanation += '\n• 可以多做几道类似的题目巩固';
        }

        return explanation;
    }

    // 生成个性化推荐
    generateRecommendations(stats, wrongNotes) {
        const recommendations = [];

        // 基于错题推荐
        if (wrongNotes.length > 0) {
            const subjects = [...new Set(wrongNotes.map(n => n.subject))];
            subjects.forEach(subject => {
                const subjectNames = {
                    math: '数学',
                    english: '英语',
                    physics: '物理',
                    chemistry: '化学',
                    computer: '计算机'
                };
                recommendations.push({
                    title: `复习${subjectNames[subject]}错题`,
                    description: `你还有${wrongNotes.filter(n => n.subject === subject).length}道${subjectNames[subject]}错题待复习`,
                    action: 'review-wrong'
                });
            });
        }

        // 基于正确率推荐
        const accuracy = stats.completed > 0 ? (stats.correct / stats.completed * 100) : 0;
        if (accuracy < 60) {
            recommendations.push({
                title: '基础巩固练习',
                description: '你的正确率还有提升空间，建议从基础题目开始练习',
                action: 'easy-practice'
            });
        } else if (accuracy > 85) {
            recommendations.push({
                title: '挑战高难度题目',
                description: '你的基础很扎实，试试更有挑战性的题目吧',
                action: 'hard-practice'
            });
        }

        // 添加通用推荐
        recommendations.push({
            title: 'AI智能出题',
            description: '让AI为你生成个性化的练习题',
            action: 'ai-generate'
        });

        return recommendations;
    }
}

// 初始化AI引擎
window.aiEngine = new AIQuestionEngine();
