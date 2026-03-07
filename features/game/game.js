import { DataManager } from '../../core/services/storage.js';

export const GameTab = {
    render: () => {
        return `
            <style>
                /* Khung bọc ngoài cùng: Cao 100% và ép mọi thứ vào giữa tâm */
                .game-container { 
                    width: 100%; 
                    height: 100%; 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; /* Căn giữa theo chiều ngang */
                    justify-content: center; /* Căn giữa theo chiều dọc */
                }

                .review-menu { display: grid; grid-template-columns: 1fr; gap: 15px; width: 100%; max-width: 800px; }
                .review-card { background: var(--bg-card); border: 1px solid var(--card-border); border-radius: 20px; padding: 20px; display: flex; align-items: center; gap: 20px; box-shadow: var(--card-shadow); cursor: pointer; transition: all 0.2s ease; }
                .review-card:hover { transform: translateY(-3px); border-color: var(--primary-color); }
                .review-icon { width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: white; flex-shrink: 0; }
                .bg-vocab { background: var(--gradient-vocab); }
                .bg-sentence { background: var(--gradient-sentence); }
                .review-info h3 { font-size: 1.2rem; color: var(--text-color); margin-bottom: 4px; font-weight: 800; }
                .review-info p { font-size: 0.9rem; color: var(--text-muted); }

                /* Khung trắc nghiệm: Giới hạn độ rộng để không bị dị dạng */
                #quiz-area { 
                    width: 100%; 
                    max-width: 700px; 
                    display: flex; 
                    flex-direction: column; 
                    justify-content: center;
                }

                .quiz-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-shrink: 0; }
                .game-score { font-size: 1.2rem; font-weight: 800; color: var(--primary-color); background: var(--bg-card); padding: 8px 20px; border-radius: 12px; border: 1px solid var(--card-border); box-shadow: var(--card-shadow); }
                
                .quiz-question-card { background: var(--bg-card); padding: 20px 15px; border-radius: 24px; text-align: center; box-shadow: var(--card-shadow); border: 1px solid var(--card-border); margin-bottom: 15px; flex-shrink: 0; }
                #quiz-subtitle { font-size: 0.85rem; color: var(--text-muted); font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
                #question-word { font-size: 2.2rem; font-weight: 800; color: var(--primary-color); line-height: 1.2; }

                .options-grid { display: grid; grid-template-columns: 1fr; gap: 10px; flex-shrink: 0; }
                .option-btn { padding: 15px 20px; font-size: 1.05rem; background-color: var(--bg-card); border: 2px solid #cbd5e1; border-bottom-width: 4px; border-radius: 16px; cursor: pointer; transition: all 0.1s ease; font-weight: 700; color: var(--text-color); display: flex; justify-content: space-between; align-items: center; text-align: left; }
                .option-btn:active:not(:disabled) { transform: translateY(2px); border-bottom-width: 2px; }
                .option-btn.correct { background: #ecfdf5; border-color: #10b981; color: #047857; }
                .option-btn.wrong { background: #fef2f2; border-color: #ef4444; color: #b91c1c; }

                /* Thẻ kết quả bóp gọn padding để không trồi thanh cuộn */
                #quiz-feedback { margin-top: 15px; animation: fadeIn 0.3s ease; width: 100%; flex-shrink: 0; }
                .feedback-card { background: var(--bg-card); padding: 20px; border-radius: 20px; border: 2px solid var(--card-border); text-align: left; box-shadow: var(--card-shadow); width: 100%; }
                
                #next-question-btn { width: 100%; margin-top: 15px; height: 55px; font-size: 1.1rem; border-radius: 16px; transition: all 0.3s; flex-shrink: 0; }
                #next-question-btn:disabled { background: #e2e8f0; color: #64748b; cursor: not-allowed; box-shadow: none; border: none; }

                /* RESPONSIVE PC: Thu nhỏ margin/padding để chống scroll */
                @media (min-width: 768px) {
                    .review-menu { grid-template-columns: 1fr 1fr; gap: 20px; }
                    .review-card { padding: 25px; flex-direction: column; text-align: center; }
                    .quiz-question-card { padding: 30px 20px; margin-bottom: 20px; }
                    #question-word { font-size: 2.8rem; }
                    .options-grid { grid-template-columns: 1fr 1fr; gap: 15px; }
                    .option-btn { font-size: 1.1rem; padding: 15px 20px; min-height: 70px; }
                    .feedback-card { padding: 20px 25px; }
                }
            </style>

            <div class="game-container">
                <div id="game-menu" class="fade-in" style="width: 100%; max-width: 800px;">
                    <h2 style="font-size: 1.5rem; color: var(--text-color); margin-bottom: 20px; text-align: center;">Chọn chế độ ôn tập</h2>
                    <div class="review-menu">
                        <div class="review-card" onclick="window.startQuiz('vocab')">
                            <div class="review-icon bg-vocab"><i class="fa-solid fa-layer-group"></i></div>
                            <div class="review-info">
                                <h3>Ôn Từ Vựng</h3>
                                <p>Đoán nghĩa và cách phát âm</p>
                            </div>
                        </div>
                        <div class="review-card" onclick="window.startQuiz('sentence')">
                            <div class="review-icon bg-sentence"><i class="fa-solid fa-comments"></i></div>
                            <div class="review-info">
                                <h3>Dịch Mẫu Câu</h3>
                                <p>Luyện phản xạ giao tiếp</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="quiz-area" class="hidden fade-in">
                    <div class="quiz-header">
                        <button class="icon-action-btn" onclick="window.backToGameMenu()"><i class="fa-solid fa-arrow-left"></i></button>
                        <div class="game-score"><i class="fa-solid fa-star" style="color:#fbbf24;"></i> <span id="score-display">0</span></div>
                    </div>

                    <div class="quiz-question-card">
                        <div id="quiz-subtitle">Câu hỏi</div>
                        <div id="question-word">...</div>
                    </div>

                    <div id="answer-options" class="options-grid"></div>
                    <div id="quiz-feedback" class="hidden"></div>
                    <button id="next-question-btn" class="action-btn hidden" onclick="window.loadNextQuestion()">Tiếp tục <i class="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>
        `;
    },

    init: () => {
        let currentMode = 'vocab';
        let currentItem = null;
        let currentScore = 0;
        let countdownTimer = null;

        window.backToGameMenu = () => {
            clearInterval(countdownTimer);
            document.getElementById('quiz-area').classList.add('hidden');
            document.getElementById('game-menu').classList.remove('hidden');
            currentScore = 0;
            document.getElementById('score-display').textContent = currentScore;
        };

        window.startQuiz = (mode) => {
            currentMode = mode;
            document.getElementById('game-menu').classList.add('hidden');
            document.getElementById('quiz-area').classList.remove('hidden');
            window.loadNextQuestion();
        };

        window.loadNextQuestion = () => {
            clearInterval(countdownTimer); 
            const data = currentMode === 'vocab' ? DataManager.getVocabList() : DataManager.getSentenceList();
            if (data.length < 4) {
                alert("Cần ít nhất 4 mục dữ liệu để chơi!");
                window.backToGameMenu();
                return;
            }

            document.getElementById('answer-options').classList.remove('hidden');
            document.getElementById('quiz-feedback').classList.add('hidden');
            document.getElementById('quiz-feedback').innerHTML = '';
            document.getElementById('next-question-btn').classList.add('hidden');
            document.getElementById('quiz-subtitle').textContent = currentMode === 'vocab' ? 'TỪ VỰNG' : 'MẪU CÂU';

            const randomIndex = Math.floor(Math.random() * data.length);
            currentItem = data[randomIndex];
            
            const questionWordEl = document.getElementById('question-word');
            questionWordEl.textContent = currentMode === 'vocab' ? currentItem.word : currentItem.vi;
            if(currentMode === 'sentence') {
                questionWordEl.style.fontSize = '1.4rem';
            } else {
                questionWordEl.style.fontSize = ''; 
            }

            const correctAnswer = currentMode === 'vocab' ? currentItem.meaning : currentItem.en;
            let options = [correctAnswer];

            while (options.length < 4) {
                const randomOpt = data[Math.floor(Math.random() * data.length)];
                const optText = currentMode === 'vocab' ? randomOpt.meaning : randomOpt.en;
                if (!options.includes(optText)) options.push(optText);
            }
            options.sort(() => Math.random() - 0.5);

            const optionsContainer = document.getElementById('answer-options');
            optionsContainer.innerHTML = '';

            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.innerHTML = `<span class="option-text">${opt}</span><span class="option-icon"></span>`;
                btn.onclick = function() { handleAnswer(this, opt, correctAnswer); };
                optionsContainer.appendChild(btn);
            });

            if(currentMode === 'vocab' && localStorage.getItem('smartVocab_autoSpeak') !== 'false') {
                window.playGameAudio(currentItem.word);
            }
        };

        function handleAnswer(selectedBtn, selectedText, correctAnswer) {
            const allBtns = document.getElementById('answer-options').querySelectorAll('.option-btn');
            allBtns.forEach(btn => { btn.disabled = true; btn.style.pointerEvents = 'none'; });

            const isCorrect = selectedText === correctAnswer;
            let feedbackTitle = '';

            if (isCorrect) {
                selectedBtn.classList.add('correct');
                selectedBtn.querySelector('.option-icon').innerHTML = '<i class="fa-solid fa-check"></i>';
                feedbackTitle = `<div style="color: #10b981; font-weight: 800; font-size: 1.3rem; margin-bottom: 12px; text-align: center;"><i class="fa-solid fa-circle-check"></i> Chính xác!</div>`;
                currentScore += 10;
                document.getElementById('score-display').textContent = currentScore;
                
                if (window.confetti) {
                    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#10b981', '#3b82f6', '#fbbf24'] });
                }
            } else {
                selectedBtn.classList.add('wrong');
                selectedBtn.querySelector('.option-icon').innerHTML = '<i class="fa-solid fa-xmark"></i>';
                feedbackTitle = `<div style="color: #ef4444; font-weight: 800; font-size: 1.3rem; margin-bottom: 12px; text-align: center;"><i class="fa-solid fa-circle-xmark"></i> Sai rồi, xem kỹ lại nhé!</div>`;
                
                allBtns.forEach(btn => {
                    if (btn.querySelector('.option-text').textContent === correctAnswer) {
                        btn.classList.add('correct');
                        btn.querySelector('.option-icon').innerHTML = '<i class="fa-solid fa-check"></i>';
                    }
                });
            }

            const textToPlay = currentMode === 'vocab' ? currentItem.word : currentItem.en;
            window.playGameAudio(textToPlay);

            if (currentMode === 'vocab') DataManager.updateVocabLevel(currentItem.word, isCorrect);

            let fullDataHtml = '';
            if (currentMode === 'vocab') {
                const safeWord = currentItem.word.replace(/'/g, "\\'");
                fullDataHtml = `
                    <div class="feedback-card">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <div>
                                <span style="font-size: 1.4rem; font-weight: 800; color: var(--text-color);">${currentItem.word}</span>
                                <span style="font-size: 0.85rem; color: #3b82f6; background: rgba(59,130,246,0.1); padding: 3px 8px; border-radius: 6px; margin-left: 8px; font-weight: 700;">${currentItem.type}</span>
                            </div>
                            <button onclick="window.playGameAudio('${safeWord}')" style="margin:0; width: 38px; height: 38px; border-radius: 10px; background: rgba(14, 165, 233, 0.1); color: var(--primary-color); border: none; cursor: pointer; transition: 0.2s;">
                                <i class="fa-solid fa-volume-high" style="font-size: 1rem;"></i>
                            </button>
                        </div>
                        <div style="color: var(--text-muted); font-family: monospace; font-size: 1rem; margin-bottom: 10px;">${currentItem.phonetic}</div>
                        <div style="font-weight: 800; color: var(--text-color); font-size: 1.15rem; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed var(--card-border);">${currentItem.meaning}</div>
                        <div style="background: rgba(0,0,0,0.03); padding: 12px; border-radius: 10px; border-left: 4px solid var(--primary-color);">
                            <div style="font-style: italic; color: var(--text-color); font-size: 0.95rem; margin-bottom: 4px;">"${currentItem.example}"</div>
                            <div style="font-size: 0.85rem; color: var(--text-muted);">${currentItem.example_vi}</div>
                        </div>
                    </div>
                `;
            } else {
                const safeSentence = currentItem.en.replace(/'/g, "\\'");
                fullDataHtml = `
                    <div class="feedback-card">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div style="font-size: 1.1rem; font-weight: 800; color: var(--text-color); margin-bottom: 12px; padding-right: 15px; line-height: 1.4;">${currentItem.en}</div>
                            <button onclick="window.playGameAudio('${safeSentence}')" style="margin:0; flex-shrink: 0; width: 38px; height: 38px; border-radius: 10px; background: rgba(14, 165, 233, 0.1); color: var(--primary-color); border: none; cursor: pointer;">
                                <i class="fa-solid fa-volume-high" style="font-size: 1rem;"></i>
                            </button>
                        </div>
                        <div style="font-size: 1rem; color: var(--text-muted); padding-top: 12px; border-top: 1px dashed var(--card-border); line-height: 1.4;">${currentItem.vi}</div>
                    </div>
                `;
            }

            document.getElementById('answer-options').classList.add('hidden');
            const feedbackEl = document.getElementById('quiz-feedback');
            feedbackEl.innerHTML = feedbackTitle + fullDataHtml;
            feedbackEl.classList.remove('hidden');
            
            const nextBtn = document.getElementById('next-question-btn');
            nextBtn.classList.remove('hidden');

            if (!isCorrect) {
                nextBtn.disabled = true;
                let timeLeft = 3; 
                nextBtn.innerHTML = `Vui lòng xem lại đáp án (${timeLeft}s)...`;
                
                countdownTimer = setInterval(() => {
                    timeLeft--;
                    if (timeLeft > 0) {
                        nextBtn.innerHTML = `Vui lòng xem lại đáp án (${timeLeft}s)...`;
                    } else {
                        clearInterval(countdownTimer);
                        nextBtn.disabled = false;
                        nextBtn.innerHTML = `Đã hiểu, Tiếp tục <i class="fa-solid fa-arrow-right"></i>`;
                    }
                }, 1000);
            } else {
                nextBtn.disabled = false;
                nextBtn.innerHTML = `Tiếp tục <i class="fa-solid fa-arrow-right"></i>`;
            }
        }

        window.playGameAudio = (text) => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'en-US';
                utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);
            }
        };
    }
};