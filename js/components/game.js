import { DataManager } from '../services/storage.js';

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
            allBtns.forEach(btn => btn.disabled = true);

            const isCorrect = selectedText === correctAnswer;
            const textToPlay = currentMode === 'vocab' ? currentItem.word : currentItem.en;
            
            // 1. Tự động phát âm thanh ngay lập tức
            window.playGameAudio(textToPlay);

            // 2. Chạy thuật toán thăng/rớt 5 cấp độ (Chỉ áp dụng cho từ vựng)
            if (currentMode === 'vocab') {
                DataManager.updateVocabLevel(currentItem.word, isCorrect);
            }

            // 3. Tạo khối HTML hiển thị ĐẦY ĐỦ chi tiết từ vựng/mẫu câu
            let fullDataHtml = '';
            if (currentMode === 'vocab') {
                const safeWord = currentItem.word.replace(/'/g, "\\'");
                fullDataHtml = `
                    <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 12px; text-align: left; border-left: 4px solid var(--primary-color); box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <div>
                                <span style="font-size: 1.2rem; font-weight: 700; color: var(--text-color);">${currentItem.word}</span>
                                <span style="font-size: 0.9rem; font-style: italic; color: var(--primary-color); margin-left: 6px;">${currentItem.type || ''}</span>
                                <div style="font-size: 0.9rem; color: #888; font-family: monospace;">${currentItem.phonetic || ''}</div>
                            </div>
                            <button class="icon-action-btn" onclick="window.playGameAudio('${safeWord}')" style="margin:0; background: #f0f4f8; border-radius: 50%; width: 35px; height: 35px; color: var(--primary-color);">
                                <i class="fa-solid fa-volume-high"></i>
                            </button>
                        </div>
                        <div style="font-size: 1rem; color: #333; font-weight: 500; margin-bottom: 10px;">${currentItem.meaning}</div>
                        ${currentItem.example ? `
                            <div style="padding: 10px; background: #f8f9fa; border-radius: 8px;">
                                <div style="font-size: 0.95rem; font-style: italic; color: var(--text-color); margin-bottom: 4px;">"${currentItem.example}"</div>
                                <div style="font-size: 0.85rem; color: #666;">${currentItem.example_vi || ''}</div>
                            </div>
                        ` : ''}
                    </div>
                `;
            } else {
                const safeSentence = currentItem.en.replace(/'/g, "\\'");
                fullDataHtml = `
                    <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 12px; text-align: left; border-left: 4px solid var(--primary-color); box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div style="font-size: 1.1rem; font-weight: bold; color: var(--text-color); margin-bottom: 8px; padding-right: 10px;">${currentItem.en}</div>
                            <button class="icon-action-btn" onclick="window.playGameAudio('${safeSentence}')" style="margin:0; background: #f0f4f8; border-radius: 50%; width: 35px; height: 35px; color: var(--primary-color); flex-shrink: 0;">
                                <i class="fa-solid fa-volume-high"></i>
                            </button>
                        </div>
                        <div style="font-size: 1rem; color: #444;">${currentItem.vi}</div>
                    </div>
                `;
            }

            // 4. Xử lý Logic đúng / sai và in ra màn hình
            let feedbackTitle = '';

            if (isCorrect) {
                selectedBtn.classList.add('correct');
                selectedBtn.querySelector('.option-icon').innerHTML = '<i class="fa-solid fa-check"></i>';
                
                feedbackTitle = `<div style="color: var(--success-color); font-weight: bold; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
                                    <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i> 
                                    <span>Chính xác! ${currentMode === 'vocab' ? '(Đã thăng cấp 🚀)' : ''}</span>
                                 </div>`;
                currentScore += 10;
                scoreEl.textContent = currentScore;
            } else {
                selectedBtn.classList.add('wrong');
                selectedBtn.querySelector('.option-icon').innerHTML = '<i class="fa-solid fa-xmark"></i>';
                
                feedbackTitle = `<div style="color: var(--danger-color); font-weight: bold; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
                                    <i class="fa-solid fa-circle-xmark" style="font-size: 1.3rem;"></i> 
                                    <span>Sai rồi! ${currentMode === 'vocab' ? '(Rớt về Cấp 1 🔻)' : ''}</span>
                                 </div>`;
                
                allBtns.forEach(btn => {
                    if (btn.querySelector('.option-text').textContent === correctAnswer) {
                        btn.classList.add('correct');
                        btn.querySelector('.option-icon').innerHTML = '<i class="fa-solid fa-check"></i>';
                    }
                });
            }

            // Ẩn 4 nút đáp án đi cho đỡ rối mắt, thay bằng khung chứa chi tiết từ vựng
            answerOptionsEl.classList.add('hidden');
            
            // In tất cả kết quả ra màn hình
            feedbackEl.innerHTML = feedbackTitle + fullDataHtml;
            nextBtnEl.classList.remove('hidden');
        }

        nextBtnEl.addEventListener('click', generateQuestion);
    }
};