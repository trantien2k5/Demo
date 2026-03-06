import { DataManager } from '../../core/services/storage.js';

export const GameTab = {
    render: () => {
        return `
            <div id="review-menu-area" class="review-menu">
                <h2 style="margin-bottom: 10px; color: var(--text-color);">Bạn muốn học gì?</h2>
                
                <div class="card" style="padding: 15px; margin-bottom: 5px; border: 2px solid var(--primary-color);">
                    <h3 style="font-size: 1rem; color: var(--text-color); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-gear" style="color: #888;"></i> Chế độ Từ vựng
                    </h3>
                    <div class="filter-container" id="quiz-vocab-filter" style="margin-bottom: 15px;">
                        <button class="filter-chip active" data-filter="all">Tất cả</button>
                        <button class="filter-chip" data-filter="learning">Chưa thuộc</button>
                        <button class="filter-chip" data-filter="learned">Đã thuộc</button>
                    </div>
                    
                    <div class="review-card" id="btn-mode-vocab" style="margin: 0; padding: 12px; box-shadow: none; background: #f8f9fa; border: 1px solid #eee;">
                        <div class="review-icon bg-vocab" style="width: 45px; height: 45px; font-size: 1.2rem;">
                            <i class="fa-solid fa-spell-check"></i>
                        </div>
                        <div class="review-info">
                            <h3 style="font-size: 1rem;">Bắt đầu Trắc nghiệm</h3>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="margin-left: auto; color: var(--primary-color);"></i>
                    </div>
                </div>

                <div class="review-card" id="btn-mode-sentence">
                    <div class="review-icon bg-sentence">
                        <i class="fa-solid fa-comments"></i>
                    </div>
                    <div class="review-info">
                        <h3>Phản xạ Giao tiếp</h3>
                        <p>Luyện tập dịch nhanh các mẫu câu</p>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="margin-left: auto; color: #ccc;"></i>
                </div>
            </div>

            <div id="quiz-area" class="hidden">
                <div class="quiz-header">
                    <button class="back-btn" id="btn-back-menu"><i class="fa-solid fa-arrow-left"></i></button>
                    <div class="game-score" style="margin: 0;">Điểm: <span id="current-score">0</span></div>
                </div>

                <div class="quiz-question-card">
                    <p id="quiz-subtitle" style="color: #888; font-size: 0.9rem; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;">Chọn nghĩa đúng</p>
                    <div class="game-word" id="question-word" style="font-size: 1.5rem; margin: 0; line-height: 1.4;">Loading...</div>
                </div>
                
                <div class="feedback-text" id="game-feedback" style="margin-bottom: 15px;"></div>
                
                <div class="options-grid" id="answer-options">
                </div>

                <button id="next-question-btn" class="action-btn hidden">Tiếp tục <i class="fa-solid fa-arrow-right" style="margin-left: 5px;"></i></button>
            </div>
        `;
    },
    
    init: () => {
        // Khai báo hàm phát âm thanh toàn cục để HTML bên trong có thể gọi lại bằng nút bấm
        window.playGameAudio = function(text) {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'en-US'; 
                utterance.rate = 0.9;     
                window.speechSynthesis.speak(utterance);
            }
        };

        const menuArea = document.getElementById('review-menu-area');
        const quizArea = document.getElementById('quiz-area');
        const btnBack = document.getElementById('btn-back-menu');
        
        const btnModeVocab = document.getElementById('btn-mode-vocab');
        const btnModeSentence = document.getElementById('btn-mode-sentence');
        const filterChips = document.querySelectorAll('#quiz-vocab-filter .filter-chip');
        
        const questionWordEl = document.getElementById('question-word');
        const quizSubtitleEl = document.getElementById('quiz-subtitle');
        const answerOptionsEl = document.getElementById('answer-options');
        const nextBtnEl = document.getElementById('next-question-btn');
        const feedbackEl = document.getElementById('game-feedback');
        const scoreEl = document.getElementById('current-score');

        let currentScore = 0;
        let currentMode = 'vocab'; 
        let vocabFilterMode = 'all'; 
        let currentDataPool = [];    
        let currentItem = null;

        filterChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                filterChips.forEach(c => c.classList.remove('active'));
                e.currentTarget.classList.add('active');
                vocabFilterMode = e.currentTarget.getAttribute('data-filter');
            });
        });

        function startQuiz(mode) {
            currentMode = mode;
            currentScore = 0;
            scoreEl.textContent = currentScore;

            // HIỆU ỨNG BẮN PHÁO HOA TUNG TÓE 🎆
                if (window.confetti) {
                    confetti({
                        particleCount: 100, // Số lượng hạt
                        spread: 70,         // Độ văng xa
                        origin: { y: 0.6 }, // Vị trí bắn (Từ dưới nổ lên)
                        colors: ['#05cd99', '#3b82f6', '#fbbf24'] // Màu sắc pháo
                    });
                }
            
            if (mode === 'vocab') {
                const fullVocab = DataManager.getVocabList();
                currentDataPool = fullVocab.filter(item => vocabFilterMode === 'all' || item.status === vocabFilterMode);
                
                if (currentDataPool.length === 0) {
                    alert("Không có từ vựng nào trong mục này. Vui lòng chọn chế độ khác!");
                    return; 
                }
                quizSubtitleEl.textContent = "Chọn nghĩa đúng của từ";
            } else {
                currentDataPool = DataManager.getSentenceList();
                if (currentDataPool.length === 0) return;
                quizSubtitleEl.textContent = "Dịch câu sau sang tiếng Việt";
            }

            menuArea.classList.add('hidden');
            quizArea.classList.remove('hidden');
            generateQuestion();
        }

        btnModeVocab.addEventListener('click', () => startQuiz('vocab'));
        btnModeSentence.addEventListener('click', () => startQuiz('sentence'));

        btnBack.addEventListener('click', () => {
            quizArea.classList.add('hidden');
            menuArea.classList.remove('hidden');
            // Bọc thêm lớp khiên an toàn trước khi tắt loa
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel(); 
            }
        });

        function shuffleArray(array) {
            const newArr = [...array];
            for (let i = newArr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
            }
            return newArr;
        }

        function generateQuestion() {
            nextBtnEl.classList.add('hidden');
            feedbackEl.innerHTML = "";
            answerOptionsEl.innerHTML = "";
            answerOptionsEl.classList.remove('hidden');
            
            const questionKey = currentMode === 'vocab' ? 'word' : 'en';
            const answerKey = currentMode === 'vocab' ? 'meaning' : 'vi';

            currentItem = currentDataPool[Math.floor(Math.random() * currentDataPool.length)];
            questionWordEl.textContent = currentItem[questionKey];

            const globalData = currentMode === 'vocab' ? DataManager.getVocabList() : DataManager.getSentenceList();
            
            let wrongOptions = globalData.filter(item => item[questionKey] !== currentItem[questionKey]);
            wrongOptions = shuffleArray(wrongOptions).slice(0, 3);
            
            let correctText = currentItem[answerKey] || "Chưa có nghĩa";
            let wrongTexts = wrongOptions.map(item => item[answerKey] || "Chưa có nghĩa");

            let options = [correctText, ...wrongTexts];
            options = shuffleArray(options);

            options.forEach(optionText => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.innerHTML = `
                    <span class="option-text">${optionText}</span>
                    <span class="option-icon"></span>
                `;
                
                btn.addEventListener('click', function() {
                    handleAnswer(this, optionText, correctText);
                });
                
                answerOptionsEl.appendChild(btn);
            });
        }

        function handleAnswer(selectedBtn, selectedText, correctAnswer) {
            const allBtns = answerOptionsEl.querySelectorAll('.option-btn');
            allBtns.forEach(btn => {
                btn.disabled = true;
                btn.style.pointerEvents = 'none'; 
            });

            const isCorrect = selectedText === correctAnswer;
            let feedbackTitle = '';

            if (isCorrect) {
                selectedBtn.classList.add('correct');
                selectedBtn.querySelector('.option-icon').innerHTML = '<i class="fa-solid fa-check"></i>';
                feedbackTitle = `<div style="color: var(--success-color); font-weight: bold; font-size: 1.1rem; display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                                    <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i> 
                                    <span>Chính xác! ${currentMode === 'vocab' ? '(Thăng cấp 🚀)' : ''}</span>
                                 </div>`;
                currentScore += 10;
                scoreEl.textContent = currentScore;
            } else {
                selectedBtn.classList.add('wrong');
                selectedBtn.querySelector('.option-icon').innerHTML = '<i class="fa-solid fa-xmark"></i>';
                feedbackTitle = `<div style="color: var(--danger-color); font-weight: bold; font-size: 1.1rem; display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                                    <i class="fa-solid fa-circle-xmark" style="font-size: 1.3rem;"></i> 
                                    <span>Sai rồi! ${currentMode === 'vocab' ? '(Về Cấp 1 🔻)' : ''}</span>
                                 </div>`;
                
                allBtns.forEach(btn => {
                    if (btn.querySelector('.option-text').textContent === correctAnswer) {
                        btn.classList.add('correct');
                        btn.querySelector('.option-icon').innerHTML = '<i class="fa-solid fa-check"></i>';
                    }
                });
            }

            // XỬ LÝ NGAY LẬP TỨC KHÔNG DELAY
            const textToPlay = currentMode === 'vocab' ? currentItem.word : currentItem.en;
            window.playGameAudio(textToPlay);

            if (currentMode === 'vocab') {
                DataManager.updateVocabLevel(currentItem.word, isCorrect);
            }

            let fullDataHtml = '';
            if (currentMode === 'vocab') {
                const safeWord = currentItem.word.replace(/'/g, "\\'");
                fullDataHtml = `
                    <div class="card fade-in" style="margin-top: 0; padding: 15px; text-align: left; border-left: 5px solid var(--primary-color);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                            <div>
                                <span style="font-size: 1.3rem; font-weight: 800; color: var(--text-color);">${currentItem.word}</span>
                                <span style="font-size: 0.85rem; font-style: italic; color: var(--primary-color); margin-left: 6px; background: #e0f2fe; padding: 2px 8px; border-radius: 6px;">${currentItem.type || ''}</span>
                            </div>
                            <button class="icon-action-btn" onclick="window.playGameAudio('${safeWord}')" style="margin:0; flex-shrink: 0; width: 35px; height: 35px;">
                                <i class="fa-solid fa-volume-high"></i>
                            </button>
                        </div>
                        <div style="font-size: 0.9rem; color: var(--text-muted); font-family: monospace; margin-bottom: 8px;">${currentItem.phonetic || ''}</div>
                        <div style="font-size: 1rem; color: var(--text-color); font-weight: 600; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dashed #e2e8f0;">${currentItem.meaning}</div>
                        ${currentItem.example ? `
                            <div style="background: #f8fafc; padding: 10px; border-radius: 8px;">
                                <div style="font-size: 0.95rem; font-style: italic; color: var(--text-color); margin-bottom: 4px;">"${currentItem.example}"</div>
                                <div style="font-size: 0.85rem; color: var(--text-muted);">${currentItem.example_vi || ''}</div>
                            </div>
                        ` : ''}
                    </div>
                `;
            } else {
                const safeSentence = currentItem.en.replace(/'/g, "\\'");
                fullDataHtml = `
                    <div class="card fade-in" style="margin-top: 0; padding: 15px; text-align: left; border-left: 5px solid var(--primary-color);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div style="font-size: 1.1rem; font-weight: bold; color: var(--text-color); margin-bottom: 10px; padding-right: 15px;">${currentItem.en}</div>
                            <button class="icon-action-btn" onclick="window.playGameAudio('${safeSentence}')" style="margin:0; flex-shrink: 0; width: 35px; height: 35px;">
                                <i class="fa-solid fa-volume-high"></i>
                            </button>
                        </div>
                        <div style="font-size: 1rem; color: var(--text-muted); padding-top: 10px; border-top: 1px dashed #e2e8f0;">${currentItem.vi}</div>
                    </div>
                `;
            }

            answerOptionsEl.classList.add('hidden');
            feedbackEl.innerHTML = feedbackTitle + fullDataHtml;
            nextBtnEl.classList.remove('hidden');
        }

        nextBtnEl.addEventListener('click', generateQuestion);
    }
};