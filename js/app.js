// 主应用程序
class LearningApp {
    constructor() {
        this.currentPage = 'home';
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.practiceTimer = null;
        this.practiceTime = 0;
        this.currentUser = null;
        this.init();
    }

    init() {
        // 检查登录状态
        this.checkLoginStatus();
        
        if (this.currentUser) {
            this.initMainApp();
        } else {
            this.initAuthPages();
        }
    }

    // 初始化认证页面
    initAuthPages() {
        this.bindAuthEvents();
    }

    // 初始化主应用
    initMainApp() {
        this.bindEvents();
        this.updateDashboard();
        this.updateHomeStats();
        this.renderQuestionList();
        this.renderWrongNotes();
        this.renderHistory();
        this.loadSettings();
        this.updateUserInfo();
    }

    // 认证相关事件绑定
    bindAuthEvents() {
        // 显示注册页面
        document.getElementById('show-register')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-page').style.display = 'none';
            document.getElementById('register-page').style.display = 'flex';
        });

        // 显示登录页面
        document.getElementById('show-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('register-page').style.display = 'none';
            document.getElementById('login-page').style.display = 'flex';
        });

        // 登录表单
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // 注册表单
        document.getElementById('register-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
    }

    // 检查登录状态
    checkLoginStatus() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
            document.getElementById('login-page').style.display = 'none';
            document.getElementById('register-page').style.display = 'none';
            document.getElementById('main-app').style.display = 'flex';
        }
    }

    // 处理登录
    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // 从localStorage获取用户
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = user;
            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
            }
            
            // 显示主应用
            document.getElementById('login-page').style.display = 'none';
            document.getElementById('register-page').style.display = 'none';
            document.getElementById('main-app').style.display = 'flex';
            
            this.initMainApp();
            alert('登录成功！欢迎回来，' + user.username);
        } else {
            alert('邮箱或密码错误，请重试');
        }
    }

    // 处理注册
    handleRegister() {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        const agreeTerms = document.getElementById('agree-terms').checked;

        if (!agreeTerms) {
            alert('请先同意服务条款和隐私政策');
            return;
        }

        if (password !== confirm) {
            alert('两次输入的密码不一致');
            return;
        }

        if (password.length < 6) {
            alert('密码长度至少6位');
            return;
        }

        // 检查邮箱是否已注册
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === email)) {
            alert('该邮箱已被注册');
            return;
        }

        // 保存用户
        const newUser = {
            id: Date.now(),
            username,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('注册成功！请登录');
        
        // 切换到登录页面
        document.getElementById('register-page').style.display = 'none';
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('login-email').value = email;
    }

    // 登出
    logout() {
        if (confirm('确定要退出登录吗？')) {
            this.currentUser = null;
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            
            document.getElementById('main-app').style.display = 'none';
            document.getElementById('login-page').style.display = 'flex';
            
            // 清空表单
            document.getElementById('login-email').value = '';
            document.getElementById('login-password').value = '';
        }
    }

    // 更新用户信息显示
    updateUserInfo() {
        if (this.currentUser) {
            document.getElementById('current-username').textContent = this.currentUser.username;
            document.getElementById('settings-username').value = this.currentUser.username;
            document.getElementById('settings-email').value = this.currentUser.email;
            
            // 显示注册时间
            if (this.currentUser.createdAt) {
                const date = new Date(this.currentUser.createdAt);
                document.getElementById('settings-created').value = date.toLocaleString('zh-CN');
            }
        }
    }

    bindEvents() {
        // 导航切换
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => this.switchPage(item.dataset.page));
        });

        // 登出按钮
        document.getElementById('logout-btn')?.addEventListener('click', () => this.logout());

        // 题库筛选
        document.getElementById('subject-filter')?.addEventListener('change', () => this.renderQuestionList());
        document.getElementById('difficulty-filter')?.addEventListener('change', () => this.renderQuestionList());
        document.getElementById('type-filter')?.addEventListener('change', () => this.renderQuestionList());

        // 开始练习
        document.getElementById('start-practice-btn')?.addEventListener('click', () => this.startPractice());

        // 练习控制
        document.getElementById('prev-btn')?.addEventListener('click', () => this.prevQuestion());
        document.getElementById('next-btn')?.addEventListener('click', () => this.nextQuestion());
        document.getElementById('submit-btn')?.addEventListener('click', () => this.submitAnswer());

        // AI生成
        document.getElementById('generate-btn')?.addEventListener('click', () => this.generateAIQuestions());
        document.getElementById('regenerate-btn')?.addEventListener('click', () => this.generateAIQuestions());
        document.getElementById('save-to-bank-btn')?.addEventListener('click', () => this.saveToBank());

        // 错题本
        document.getElementById('review-wrong-btn')?.addEventListener('click', () => this.startWrongReview());

        // 结果弹窗
        document.getElementById('view-wrong-btn')?.addEventListener('click', () => {
            this.closeModal('result-modal');
            this.switchPage('wrong-notes');
        });
        document.getElementById('continue-btn')?.addEventListener('click', () => {
            this.closeModal('result-modal');
        });

        // 弹窗关闭
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                modal.classList.remove('active');
            });
        });

        // 点击弹窗外部关闭
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    switchPage(page) {
        this.currentPage = page;
        
        // 更新导航状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });

        // 切换页面显示
        document.querySelectorAll('.page').forEach(p => {
            p.classList.toggle('active', p.id === page);
        });

        // 页面特定更新
        if (page === 'home') {
            this.updateHomeStats();
        } else if (page === 'dashboard') {
            this.updateDashboard();
        } else if (page === 'wrong-notes') {
            this.renderWrongNotes();
        } else if (page === 'history') {
            this.renderHistory();
        } else if (page === 'settings') {
            this.loadSettings();
        }
    }

    updateDashboard() {
        const stats = window.studyStats;
        
        // 更新统计数据
        document.getElementById('completed-count').textContent = stats.completed;
        document.getElementById('accuracy-rate').textContent = 
            stats.completed > 0 ? Math.round(stats.correct / stats.completed * 100) + '%' : '0%';
        document.getElementById('streak-days').textContent = stats.streakDays;
        document.getElementById('study-time').textContent = 
            Math.floor(stats.totalTime / 60) + '小时';

        // 生成推荐
        const recommendations = window.aiEngine.generateRecommendations(stats, window.wrongNotes);
        const recList = document.getElementById('recommendation-list');
        recList.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item" data-action="${rec.action}">
                <h4>${rec.title}</h4>
                <p>${rec.description}</p>
            </div>
        `).join('');

        // 绑定推荐点击事件
        recList.querySelectorAll('.recommendation-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                if (action === 'review-wrong') {
                    this.switchPage('wrong-notes');
                } else if (action === 'ai-generate') {
                    this.switchPage('ai-practice');
                } else if (action === 'easy-practice') {
                    document.getElementById('difficulty-filter').value = 'easy';
                    this.switchPage('question-bank');
                } else if (action === 'hard-practice') {
                    document.getElementById('difficulty-filter').value = 'hard';
                    this.switchPage('question-bank');
                }
            });
        });

        // 绘制进度图表
        this.drawProgressChart();
    }

    // 更新首页统计
    updateHomeStats() {
        const stats = window.studyStats;
        
        document.getElementById('home-completed-count').textContent = stats.completed;
        document.getElementById('home-accuracy-rate').textContent = 
            stats.completed > 0 ? Math.round(stats.correct / stats.completed * 100) + '%' : '0%';
        document.getElementById('home-streak-days').textContent = stats.streakDays;
        document.getElementById('home-study-time').textContent = 
            Math.floor(stats.totalTime / 60) + '小时';
    }

    drawProgressChart() {
        const canvas = document.getElementById('progressCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        // 获取最近7天的数据
        const days = 7;
        const data = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            const dayRecords = window.studyHistory.filter(h => 
                new Date(h.timestamp).toDateString() === dateStr
            );
            data.push(dayRecords.length);
        }

        // 绘制柱状图
        const width = rect.width;
        const height = rect.height;
        const padding = 20;
        const barWidth = (width - padding * 2) / days * 0.6;
        const maxValue = Math.max(...data, 1);

        ctx.clearRect(0, 0, width, height);

        data.forEach((value, index) => {
            const x = padding + (width - padding * 2) / days * index + (width - padding * 2) / days * 0.2;
            const barHeight = (value / maxValue) * (height - padding * 2);
            const y = height - padding - barHeight;

            // 绘制柱子
            const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
            gradient.addColorStop(0, '#6366f1');
            gradient.addColorStop(1, '#8b5cf6');
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);

            // 绘制数值
            ctx.fillStyle = '#1f2937';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(value, x + barWidth / 2, y - 5);
        });
    }

    renderQuestionList() {
        const subject = document.getElementById('subject-filter')?.value;
        const difficulty = document.getElementById('difficulty-filter')?.value;
        const type = document.getElementById('type-filter')?.value;

        let questions = window.questionBank;
        
        if (subject) questions = questions.filter(q => q.subject === subject);
        if (difficulty) questions = questions.filter(q => q.difficulty === difficulty);
        if (type) questions = questions.filter(q => q.type === type);

        const listContainer = document.getElementById('question-list');
        if (!listContainer) return;

        if (questions.length === 0) {
            listContainer.innerHTML = '<div class="empty-state">暂无符合条件的题目</div>';
            return;
        }

        const subjectNames = {
            math: '数学', english: '英语', physics: '物理', 
            chemistry: '化学', computer: '计算机'
        };

        const difficultyNames = {
            easy: '简单', medium: '中等', hard: '困难'
        };

        listContainer.innerHTML = questions.map((q, index) => `
            <div class="question-preview" data-index="${index}">
                <div class="question-preview-header">
                    <div class="question-tags">
                        <span class="tag tag-subject">${subjectNames[q.subject]}</span>
                        <span class="tag tag-difficulty-${q.difficulty}">${difficultyNames[q.difficulty]}</span>
                    </div>
                    <span class="question-type">${this.getTypeName(q.type)}</span>
                </div>
                <p class="question-text">${q.question}</p>
            </div>
        `).join('');

        // 绑定点击事件
        listContainer.querySelectorAll('.question-preview').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.startPractice([questions[index]]);
            });
        });
    }

    getTypeName(type) {
        const names = {
            single: '单选题',
            multiple: '多选题',
            judge: '判断题',
            fill: '填空题'
        };
        return names[type] || type;
    }

    startPractice(questions = null) {
        if (!questions) {
            // 从筛选结果中获取题目
            const subject = document.getElementById('subject-filter')?.value;
            const difficulty = document.getElementById('difficulty-filter')?.value;
            const type = document.getElementById('type-filter')?.value;

            questions = window.questionBank;
            if (subject) questions = questions.filter(q => q.subject === subject);
            if (difficulty) questions = questions.filter(q => q.difficulty === difficulty);
            if (type) questions = questions.filter(q => q.type === type);

            if (questions.length === 0) {
                alert('请先选择题目');
                return;
            }

            // 随机选择10道题
            questions = questions.sort(() => Math.random() - 0.5).slice(0, 10);
        }

        this.currentQuestions = questions;
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(questions.length).fill(null);
        this.practiceTime = 0;

        // 显示练习区域
        document.getElementById('question-list').style.display = 'none';
        document.getElementById('practice-area').style.display = 'block';

        // 启动计时器
        this.startTimer();

        // 显示第一题
        this.showQuestion(0);
    }

    startTimer() {
        this.practiceTimer = setInterval(() => {
            this.practiceTime++;
            const minutes = Math.floor(this.practiceTime / 60).toString().padStart(2, '0');
            const seconds = (this.practiceTime % 60).toString().padStart(2, '0');
            document.getElementById('practice-timer').textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.practiceTimer);
    }

    showQuestion(index) {
        this.currentQuestionIndex = index;
        const question = this.currentQuestions[index];

        // 更新计数器
        document.getElementById('current-q-num').textContent = index + 1;
        document.getElementById('total-q-num').textContent = this.currentQuestions.length;

        // 更新按钮状态
        document.getElementById('prev-btn').disabled = index === 0;
        document.getElementById('next-btn').textContent = 
            index === this.currentQuestions.length - 1 ? '完成' : '下一题';

        // 渲染题目
        const container = document.getElementById('current-question');
        let html = `<div class="question-title">${index + 1}. ${question.question}</div>`;

        if (question.type === 'fill') {
            html += `
                <div class="fill-answer">
                    <input type="text" class="fill-input" placeholder="请输入答案" 
                        value="${this.userAnswers[index] || ''}">
                </div>
            `;
        } else {
            html += '<div class="options-list">';
            question.options.forEach((opt, i) => {
                const selected = this.userAnswers[index] === i ? 'selected' : '';
                const label = String.fromCharCode(65 + i);
                html += `
                    <div class="option-item ${selected}" data-index="${i}">
                        <span class="option-label">${label}</span>
                        <span class="option-text">${opt}</span>
                    </div>
                `;
            });
            html += '</div>';
        }

        container.innerHTML = html;

        // 绑定选项点击事件
        container.querySelectorAll('.option-item').forEach(item => {
            item.addEventListener('click', () => {
                const optIndex = parseInt(item.dataset.index);
                this.userAnswers[index] = optIndex;
                
                container.querySelectorAll('.option-item').forEach(opt => {
                    opt.classList.remove('selected');
                });
                item.classList.add('selected');
            });
        });

        // 绑定填空输入事件
        const fillInput = container.querySelector('.fill-input');
        if (fillInput) {
            fillInput.addEventListener('input', (e) => {
                this.userAnswers[index] = e.target.value.trim();
            });
        }
    }

    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.showQuestion(this.currentQuestionIndex - 1);
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.currentQuestions.length - 1) {
            this.showQuestion(this.currentQuestionIndex + 1);
        } else {
            this.finishPractice();
        }
    }

    submitAnswer() {
        const question = this.currentQuestions[this.currentQuestionIndex];
        const userAnswer = this.userAnswers[this.currentQuestionIndex];

        if (userAnswer === null || userAnswer === '') {
            alert('请先选择答案');
            return;
        }

        const isCorrect = this.checkAnswer(question, userAnswer);
        
        // 显示答案状态
        const container = document.getElementById('current-question');
        if (question.type !== 'fill') {
            container.querySelectorAll('.option-item').forEach((item, i) => {
                item.classList.remove('selected');
                if (i === question.answer) {
                    item.classList.add('correct');
                } else if (i === userAnswer && !isCorrect) {
                    item.classList.add('wrong');
                }
            });
        }

        // 显示AI解析按钮
        if (!container.querySelector('.explanation-btn')) {
            const btn = document.createElement('button');
            btn.className = 'explanation-btn';
            btn.innerHTML = '<i class="fas fa-robot"></i> 查看AI解析';
            btn.addEventListener('click', () => this.showAIExplanation(question, userAnswer, isCorrect));
            container.appendChild(btn);
        }

        // 保存错题
        if (!isCorrect) {
            window.saveWrongNote(question, userAnswer);
        }
    }

    checkAnswer(question, userAnswer) {
        if (question.type === 'fill') {
            return userAnswer.toString().toLowerCase().trim() === question.answer.toString().toLowerCase().trim();
        }
        return userAnswer === question.answer;
    }

    showAIExplanation(question, userAnswer, isCorrect) {
        const modal = document.getElementById('ai-explanation-modal');
        const explanation = window.aiEngine.generateExplanation(question, userAnswer, isCorrect);

        document.getElementById('modal-question').innerHTML = `
            <h4>题目：${question.question}</h4>
            <p>你的答案：${this.formatAnswer(question, userAnswer)}</p>
            <p>正确答案：${this.formatAnswer(question, question.answer)}</p>
        `;

        document.getElementById('ai-explanation').innerHTML = `
            <h3><i class="fas fa-lightbulb"></i> 智能解析</h3>
            <p>${explanation.replace(/\n/g, '<br>')}</p>
        `;

        modal.classList.add('active');
    }

    formatAnswer(question, answer) {
        if (question.type === 'fill') {
            return answer;
        }
        if (Array.isArray(answer)) {
            return answer.map(i => question.options[i]).join(', ');
        }
        return question.options[answer] || String.fromCharCode(65 + answer);
    }

    finishPractice() {
        this.stopTimer();

        // 计算成绩
        let correct = 0;
        this.currentQuestions.forEach((q, i) => {
            if (this.checkAnswer(q, this.userAnswers[i])) {
                correct++;
            }
        });

        const total = this.currentQuestions.length;
        const score = Math.round(correct / total * 100);

        // 更新统计
        window.updateStats(correct, this.practiceTime);

        // 保存学习记录
        window.saveStudyHistory({
            type: 'practice',
            total,
            correct,
            time: this.practiceTime,
            timestamp: new Date().toISOString()
        });

        // 显示结果
        document.getElementById('result-score').textContent = score;
        document.getElementById('result-total').textContent = total;
        document.getElementById('result-correct').textContent = correct;
        document.getElementById('result-wrong').textContent = total - correct;
        document.getElementById('result-time').textContent = 
            `${Math.floor(this.practiceTime / 60)}:${(this.practiceTime % 60).toString().padStart(2, '0')}`;

        document.getElementById('result-modal').classList.add('active');

        // 重置练习区域
        setTimeout(() => {
            document.getElementById('question-list').style.display = 'grid';
            document.getElementById('practice-area').style.display = 'none';
        }, 500);
    }

    generateAIQuestions() {
        const topic = document.getElementById('ai-topic').value.trim();
        const count = parseInt(document.getElementById('ai-count').value);
        const difficulty = document.getElementById('ai-difficulty').value;
        
        const typeCheckboxes = document.querySelectorAll('.checkbox-group input:checked');
        const types = Array.from(typeCheckboxes).map(cb => cb.value);

        if (!topic) {
            alert('请输入知识点或主题');
            return;
        }

        if (types.length === 0) {
            alert('请至少选择一种题型');
            return;
        }

        // 显示加载状态
        const container = document.getElementById('ai-questions-container');
        container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
        document.getElementById('generated-questions').style.display = 'block';

        // 模拟AI生成延迟
        setTimeout(() => {
            const questions = window.aiEngine.generateQuestions(topic, count, difficulty, types);
            this.renderAIQuestions(questions);
        }, 1500);
    }

    renderAIQuestions(questions) {
        const container = document.getElementById('ai-questions-container');
        
        container.innerHTML = questions.map((q, i) => `
            <div class="ai-question-card">
                <h4>${i + 1}. ${q.question}</h4>
                ${q.type !== 'fill' ? `
                    <div class="options-list" style="margin-top: 12px;">
                        ${q.options.map((opt, j) => `
                            <div class="option-item">
                                <span class="option-label">${String.fromCharCode(65 + j)}</span>
                                <span class="option-text">${opt}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p style="margin-top: 12px; color: #6b7280;">填空题</p>'}
                <div style="margin-top: 12px; padding: 12px; background: rgba(16, 185, 129, 0.1); border-radius: 6px;">
                    <strong>答案：</strong>${this.formatAnswer(q, q.answer)}
                </div>
                <div style="margin-top: 8px; padding: 12px; background: rgba(59, 130, 246, 0.1); border-radius: 6px;">
                    <strong>解析：</strong>${q.explanation}
                </div>
            </div>
        `).join('');

        this.generatedQuestions = questions;
    }

    saveToBank() {
        if (!this.generatedQuestions || this.generatedQuestions.length === 0) {
            alert('没有可保存的题目');
            return;
        }

        // 添加到题库
        this.generatedQuestions.forEach(q => {
            q.id = Date.now() + Math.random();
            window.questionBank.push(q);
        });

        alert(`成功保存 ${this.generatedQuestions.length} 道题目到题库！`);
        
        // 切换到题库页面
        this.switchPage('question-bank');
    }

    renderWrongNotes() {
        const container = document.getElementById('wrong-notes-list');
        if (!container) return;

        const wrongNotes = window.wrongNotes;
        
        // 更新统计
        document.getElementById('wrong-total').textContent = wrongNotes.length;
        document.getElementById('mastered-count').textContent = wrongNotes.filter(n => n.mastered).length;
        document.getElementById('pending-review').textContent = wrongNotes.filter(n => !n.mastered).length;

        if (wrongNotes.length === 0) {
            container.innerHTML = '<div class="empty-state">暂无错题，继续保持！</div>';
            return;
        }

        const subjectNames = {
            math: '数学', english: '英语', physics: '物理', 
            chemistry: '化学', computer: '计算机'
        };

        container.innerHTML = wrongNotes.map((note, index) => `
            <div class="wrong-note-item">
                <div class="wrong-note-header">
                    <div class="question-tags">
                        <span class="tag tag-subject">${subjectNames[note.subject]}</span>
                        ${note.mastered ? '<span class="tag tag-difficulty-easy">已掌握</span>' : '<span class="tag tag-difficulty-hard">待复习</span>'}
                    </div>
                    <span class="wrong-date">${new Date(note.timestamp).toLocaleDateString()}</span>
                </div>
                <p class="question-text">${note.question}</p>
                <div style="margin-top: 8px; color: #ef4444;">
                    你的答案：${this.formatAnswer(note, note.userAnswer)}
                </div>
                <div style="margin-top: 4px; color: #10b981;">
                    正确答案：${this.formatAnswer(note, note.answer)}
                </div>
                <div class="wrong-note-actions">
                    <button class="btn-primary btn-small" onclick="app.showAIExplanation(${JSON.stringify(note).replace(/"/g, '&quot;')}, ${note.userAnswer}, false)">
                        <i class="fas fa-robot"></i> 查看解析
                    </button>
                    ${!note.mastered ? `
                        <button class="btn-secondary btn-small" onclick="app.markAsMastered(${index})">
                            标记为已掌握
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    markAsMastered(index) {
        window.wrongNotes[index].mastered = true;
        localStorage.setItem('wrongNotes', JSON.stringify(window.wrongNotes));
        this.renderWrongNotes();
    }

    startWrongReview() {
        const pending = window.wrongNotes.filter(n => !n.mastered);
        if (pending.length === 0) {
            alert('没有待复习的错题');
            return;
        }
        this.startPractice(pending.slice(0, 10));
    }

    renderHistory() {
        const container = document.getElementById('history-timeline');
        if (!container) return;

        const history = window.studyHistory;
        
        if (history.length === 0) {
            container.innerHTML = '<div class="empty-state">暂无学习记录</div>';
            return;
        }

        const typeIcons = {
            practice: 'fa-pencil-alt',
            ai: 'fa-robot',
            review: 'fa-redo'
        };

        const typeNames = {
            practice: '练习',
            ai: 'AI出题',
            review: '错题复习'
        };

        container.innerHTML = history.map(record => {
            const date = new Date(record.timestamp);
            const accuracy = record.total > 0 ? Math.round(record.correct / record.total * 100) : 0;
            
            return `
                <div class="history-item">
                    <div class="history-icon ${record.type}">
                        <i class="fas ${typeIcons[record.type] || 'fa-book'}"></i>
                    </div>
                    <div class="history-info">
                        <h4>${typeNames[record.type] || '学习'}</h4>
                        <p>完成 ${record.total} 题，正确 ${record.correct} 题</p>
                    </div>
                    <div class="history-meta">
                        <div class="history-time">${date.toLocaleString()}</div>
                        <div class="history-result" style="color: ${accuracy >= 60 ? '#10b981' : '#ef4444'}">
                            正确率 ${accuracy}%
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    // 加载设置
    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        
        if (settings.dailyGoal) {
            document.getElementById('daily-goal').value = settings.dailyGoal;
        }
        if (settings.defaultDifficulty) {
            document.getElementById('default-difficulty').value = settings.defaultDifficulty;
        }
        if (settings.notifyStudy !== undefined) {
            document.getElementById('notify-study').checked = settings.notifyStudy;
        }
        if (settings.notifyReview !== undefined) {
            document.getElementById('notify-review').checked = settings.notifyReview;
        }
        if (settings.notifyAchievement !== undefined) {
            document.getElementById('notify-achievement').checked = settings.notifyAchievement;
        }
        if (settings.autoSave !== undefined) {
            document.getElementById('auto-save').checked = settings.autoSave;
        }

        // 绑定设置保存事件
        document.getElementById('save-profile-btn')?.addEventListener('click', () => this.saveProfile());
        document.getElementById('save-settings-btn')?.addEventListener('click', () => this.saveSettings());
        document.getElementById('change-password-btn')?.addEventListener('click', () => this.changePassword());
        document.getElementById('delete-account-btn')?.addEventListener('click', () => this.deleteAccount());
        document.getElementById('export-data-btn')?.addEventListener('click', () => this.exportData());
        document.getElementById('import-data-btn')?.addEventListener('click', () => this.importData());
        document.getElementById('clear-data-btn')?.addEventListener('click', () => this.clearData());
    }

    // 保存资料
    saveProfile() {
        const username = document.getElementById('settings-username').value.trim();
            
        if (!username) {
            alert('用户名不能为空');
            return;
        }
    
        if (this.currentUser) {
            this.currentUser.username = username;
                
            // 更新用户列表
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const index = users.findIndex(u => u.id === this.currentUser.id);
            if (index !== -1) {
                users[index] = this.currentUser;
                localStorage.setItem('users', JSON.stringify(users));
            }
    
            // 更新当前用户
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateUserInfo();
                
            alert('资料保存成功！');
        }
    }
    
    // 修改密码
    changePassword() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
    
        // 验证当前密码
        if (!currentPassword) {
            alert('请输入当前密码');
            return;
        }
    
        if (currentPassword !== this.currentUser.password) {
            alert('当前密码错误');
            return;
        }
    
        // 验证新密码
        if (!newPassword) {
            alert('请输入新密码');
            return;
        }
    
        if (newPassword.length < 6) {
            alert('新密码长度至少6位');
            return;
        }
    
        if (newPassword === currentPassword) {
            alert('新密码不能与当前密码相同');
            return;
        }
    
        if (newPassword !== confirmPassword) {
            alert('两次输入的新密码不一致');
            return;
        }
    
        // 更新密码
        this.currentUser.password = newPassword;
            
        // 更新用户列表
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const index = users.findIndex(u => u.id === this.currentUser.id);
        if (index !== -1) {
            users[index] = this.currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }
    
        // 更新当前用户
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    
        // 清空表单
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
    
        alert('密码修改成功！');
    }
    
    // 注销账号
    deleteAccount() {
        if (!confirm('⚠️ 警告：注销账号将永久删除您的所有数据！\n\n包括：\n- 账号信息\n- 学习记录\n- 错题本\n- 学习统计\n\n此操作不可恢复！确定继续吗？')) {
            return;
        }
    
        if (!confirm('最后确认：真的要注销账号吗？\n\n请输入“确认注销”以继续：')) {
            return;
        }
    
        const confirmText = prompt('请输入“确认注销”以确认：');
        if (confirmText !== '确认注销') {
            alert('已取消注销操作');
            return;
        }
    
        // 删除当前用户
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const filteredUsers = users.filter(u => u.id !== this.currentUser.id);
        localStorage.setItem('users', JSON.stringify(filteredUsers));
    
        // 清空所有学习数据
        localStorage.removeItem('currentUser');
        localStorage.removeItem('studyStats');
        localStorage.removeItem('studyHistory');
        localStorage.removeItem('wrongNotes');
        localStorage.removeItem('questionBank');
        localStorage.removeItem('userSettings');
    
        alert('账号已注销，所有数据已删除');
            
        // 刷新页面
        location.reload();
    }

    // 保存设置
    saveSettings() {
        const settings = {
            dailyGoal: parseInt(document.getElementById('daily-goal').value),
            defaultDifficulty: document.getElementById('default-difficulty').value,
            notifyStudy: document.getElementById('notify-study').checked,
            notifyReview: document.getElementById('notify-review').checked,
            notifyAchievement: document.getElementById('notify-achievement').checked,
            autoSave: document.getElementById('auto-save').checked
        };

        localStorage.setItem('userSettings', JSON.stringify(settings));
        alert('设置保存成功！');
    }

    // 导出数据
    exportData() {
        const data = {
            users: JSON.parse(localStorage.getItem('users') || '[]'),
            studyStats: JSON.parse(localStorage.getItem('studyStats') || '{}'),
            studyHistory: JSON.parse(localStorage.getItem('studyHistory') || '[]'),
            wrongNotes: JSON.parse(localStorage.getItem('wrongNotes') || '[]'),
            questionBank: JSON.parse(localStorage.getItem('questionBank') || '[]'),
            settings: JSON.parse(localStorage.getItem('userSettings') || '{}'),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-learning-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        alert('数据导出成功！');
    }

    // 导入数据
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    if (confirm('导入数据将覆盖当前数据，确定继续吗？')) {
                        if (data.users) localStorage.setItem('users', JSON.stringify(data.users));
                        if (data.studyStats) localStorage.setItem('studyStats', JSON.stringify(data.studyStats));
                        if (data.studyHistory) localStorage.setItem('studyHistory', JSON.stringify(data.studyHistory));
                        if (data.wrongNotes) localStorage.setItem('wrongNotes', JSON.stringify(data.wrongNotes));
                        if (data.questionBank) localStorage.setItem('questionBank', JSON.stringify(data.questionBank));
                        if (data.settings) localStorage.setItem('userSettings', JSON.stringify(data.settings));
                        
                        alert('数据导入成功！页面将刷新。');
                        location.reload();
                    }
                } catch (error) {
                    alert('导入失败：文件格式错误');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    // 清空数据
    clearData() {
        if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
            if (confirm('再次确认：真的要清空所有学习数据吗？')) {
                localStorage.removeItem('studyStats');
                localStorage.removeItem('studyHistory');
                localStorage.removeItem('wrongNotes');
                localStorage.removeItem('questionBank');
                localStorage.removeItem('userSettings');
                
                alert('数据已清空！页面将刷新。');
                location.reload();
            }
        }
    }
}

// 初始化应用
const app = new LearningApp();
window.app = app;
