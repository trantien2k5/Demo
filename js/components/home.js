import { DataManager } from '../services/storage.js';

export const HomeTab = {
    render: () => {
        return `
            <div class="progress-track" style="height: 8px; border-radius: 4px; overflow: hidden;">
                <h2 id="greeting-text">Chào Tiến! 👋</h2>
                <p style="opacity: 0.9; font-size: 0.9rem; margin-top: 5px;">Hôm nay bạn muốn học gì nào?</p>
                
                <div style="margin-top: 20px; background: rgba(255,255,255,0.2); padding: 15px; border-radius: 12px;">
                    <p style="font-size: 0.85rem; margin-bottom: 8px;">Tiến độ nắm vững từ vựng</p>
                    <div style="height: 8px; background: rgba(255,255,255,0.3); border-radius: 4px; overflow: hidden;">
                        <div id="progress-bar" style="width: 0%; height: 100%; background: var(--success-color); border-radius: 4px; transition: width 1s ease-in-out;"></div>
                    </div>
                    <p style="text-align: right; font-size: 0.8rem; margin-top: 5px; font-weight: bold;"><span id="progress-text">0</span>%</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div class="card" style="margin-bottom: 0; text-align: center; padding: 15px;">
                    <i class="fa-solid fa-book-open" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 10px;"></i>
                    <h3 id="stat-total" style="font-size: 1.5rem; color: var(--text-color);">0</h3>
                    <p style="color: #666; font-size: 0.8rem;">Tổng từ vựng</p>
                </div>
                <div class="card" style="margin-bottom: 0; text-align: center; padding: 15px;">
                    <i class="fa-solid fa-check-circle" style="font-size: 2rem; color: var(--success-color); margin-bottom: 10px;"></i>
                    <h3 id="stat-learned" style="font-size: 1.5rem; color: var(--text-color);">0</h3>
                    <p style="color: #666; font-size: 0.8rem;">Đã thuộc</p>
                </div>
            </div>

            <div class="card">
                <h2 style="font-size: 1.1rem; margin-bottom: 15px;">Truy cập nhanh</h2>
                <button id="btn-quick-learn" class="action-btn" style="position: relative; bottom: auto; left: auto; right: auto; width: 100%; margin-top: 0; display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <i class="fa-solid fa-play"></i> Luyện tập ngay
                </button>
            </div>
        `;
    },

    init: () => {
        const hour = new Date().getHours();
        const greetingEl = document.getElementById('greeting-text');
        if (hour >= 5 && hour < 12) {
            greetingEl.innerHTML = 'Chào buổi sáng, Tiến! 🌅';
        } else if (hour >= 12 && hour < 18) {
            greetingEl.innerHTML = 'Chào buổi chiều, Tiến! ☀️';
        } else {
            greetingEl.innerHTML = 'Chào buổi tối, Tiến! 🌙';
        }

        // Lấy dữ liệu qua DataManager thay vì đọc file thô
        const stats = DataManager.getStats();

        document.getElementById('stat-total').textContent = stats.totalVocab;
        document.getElementById('stat-learned').textContent = stats.learnedVocab;
        
        setTimeout(() => {
            const progressBar = document.getElementById('progress-bar');
            const progressText = document.getElementById('progress-text');
            if(progressBar && progressText) {
                progressBar.style.width = stats.progressPercent + '%';
                progressText.textContent = stats.progressPercent;
            }
        }, 100);

        const quickLearnBtn = document.getElementById('btn-quick-learn');
        if (quickLearnBtn) {
            quickLearnBtn.addEventListener('click', () => {
                const gameTabBtn = document.querySelector('.nav-item[data-tab="game"]');
                if (gameTabBtn) {
                    gameTabBtn.click();
                }
            });
        }
    }
};