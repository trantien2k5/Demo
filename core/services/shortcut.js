export function initShortcuts() {
    const defaultShortcuts = {
        opt1: '1', opt2: '2', opt3: '3', opt4: '4',
        next: 'enter', audio: 's'
    };

    if (!localStorage.getItem('smartVocab_shortcuts')) {
        localStorage.setItem('smartVocab_shortcuts', JSON.stringify(defaultShortcuts));
    }

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const shortcuts = JSON.parse(localStorage.getItem('smartVocab_shortcuts')) || defaultShortcuts;
        let pressedKey = e.key.toLowerCase();
        if (e.code === 'Space') pressedKey = 'space';

        const quizArea = document.getElementById('quiz-area');
        if (quizArea && !quizArea.classList.contains('hidden')) {
            if (pressedKey === shortcuts.opt1.toLowerCase()) document.getElementById('opt-btn-0')?.click();
            if (pressedKey === shortcuts.opt2.toLowerCase()) document.getElementById('opt-btn-1')?.click();
            if (pressedKey === shortcuts.opt3.toLowerCase()) document.getElementById('opt-btn-2')?.click();
            if (pressedKey === shortcuts.opt4.toLowerCase()) document.getElementById('opt-btn-3')?.click();
            
            if (pressedKey === shortcuts.next.toLowerCase()) {
                const nextBtn = document.getElementById('next-question-btn');
                if (nextBtn && !nextBtn.classList.contains('hidden') && !nextBtn.disabled) {
                    nextBtn.click();
                }
            }
            
            if (pressedKey === shortcuts.audio.toLowerCase()) {
                const audioBtn = document.querySelector('.feedback-card button');
                if(audioBtn) audioBtn.click();
                else {
                    const text = document.getElementById('question-word')?.textContent;
                    if(window.playGameAudio && text) window.playGameAudio(text);
                }
            }
        }
    });
}