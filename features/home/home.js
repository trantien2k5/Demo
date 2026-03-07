import { DataManager } from '../../core/services/storage.js';

export const HomeTab = {
    render: () => {
        return `
            <style>
                .home-wrapper { display: flex; flex-direction: column; gap: 25px; max-width: 1000px; margin: 0 auto; width: 100%; }
                .home-banner { background: var(--gradient-action); border-radius: 24px; padding: 25px; color: white; box-shadow: 0 10px 25px rgba(14, 165, 233, 0.3); display: flex; flex-direction: column; gap: 20px; }
                .banner-content h2 { font-size: 1.8rem; margin-bottom: 5px; font-weight: 800; }
                .banner-content p { font-size: 1rem; opacity: 0.9; }
                .banner-progress { background: rgba(0, 0, 0, 0.15); padding: 18px; border-radius: 16px; }
                .progress-info { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.95rem; font-weight: 700; }
                .progress-track { height: 10px; background: rgba(255, 255, 255, 0.3); border-radius: 5px; overflow: hidden; }
                .progress-fill { height: 100%; width: 0%; background: #10b981; border-radius: 5px; transition: width 1s ease-in-out; }
                .section-title { font-size: 1.3rem; color: var(--text-color); margin-top: 5px; font-weight: 800; }
                .home-stats-grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
                .stat-card { background: var(--bg-card); border: 1px solid var(--card-border); border-radius: 20px; padding: 20px; display: flex; align-items: center; gap: 15px; box-shadow: var(--card-shadow); transition: all 0.2s ease; }
                .stat-card.action-card { cursor: pointer; border: 2px solid transparent; }
                .stat-card.action-card:hover { transform: translateY(-4px); border-color: var(--primary-color); box-shadow: 0 10px 25px rgba(14, 165, 233, 0.15); }
                .icon-wrapper { width: 60px; height: 60px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0; }
                .vocab-icon { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
                .learned-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                .play-icon { background: var(--primary-color); color: white; }
                .stat-details h3 { font-size: 1.5rem; color: var(--text-color); margin-bottom: 2px; font-weight: 800; }
                .stat-details p { font-size: 0.9rem; color: var(--text-muted); font-weight: 700; }
                @media (min-width: 768px) {
                    .home-banner { flex-direction: row; align-items: center; justify-content: space-between; padding: 40px; }
                    .banner-content { flex: 1; }
                    .banner-progress { width: 350px; margin-left: 40px; }
                    .home-stats-grid { grid-template-columns: repeat(3, 1fr); gap: 25px; }
                    .stat-card { flex-direction: column; text-align: center; padding: 35px 20px; }
                }
            </style>
            <div class="home-wrapper fade-in">
                <div class="home-banner">
                    <div class="banner-content">
                        <h2 id="greeting-text">Chào Tiến! 👋</h2>
                        <p>Sẵn sàng để chinh phục thêm từ vựng hôm nay chưa?</p>
                    </div>
                    <div class="banner-progress">
                        <div class="progress-info">
                            <span>Tiến độ Master (Đã thuộc)</span>
                            <strong><span id="progress-text">0</span>%</strong>
                        </div>
                        <div class="progress-track">
                            <div id="progress-bar" class="progress-fill"></div>
                        </div>
                    </div>
                </div>
                <h3 class="section-title">Tổng quan học tập</h3>
                <div class="home-stats-grid">
                    <div class="stat-card">
                        <div class="icon-wrapper vocab-icon"><i class="fa-solid fa-book-open"></i></div>
                        <div class="stat-details">
                            <h3><span id="stat-total">0</span></h3>
                            <p>Tổng từ vựng</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="icon-wrapper learned-icon"><i class="fa-solid fa-check-circle"></i></div>
                        <div class="stat-details">
                            <h3><span id="stat-learned">0</span></h3>
                            <p>Từ đã thuộc</p>
                        </div>
                    </div>
                    <div class="stat-card action-card" id="btn-quick-learn">
                        <div class="icon-wrapper play-icon"><i class="fa-solid fa-play"></i></div>
                        <div class="stat-details">
                            <h3>Ôn tập</h3>
                            <p>Bắt đầu ngay</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    init: () => {
        const hour = new Date().getHours();
        const greetingEl = document.getElementById('greeting-text');
        if (hour >= 5 && hour < 12) greetingEl.innerHTML = 'Chào buổi sáng, Tiến! 🌅';
        else if (hour >= 12 && hour < 18) greetingEl.innerHTML = 'Chào buổi chiều, Tiến! ☀️';
        else greetingEl.innerHTML = 'Chào buổi tối, Tiến! 🌙';

        const stats = DataManager.getStats();
        document.getElementById('stat-total').textContent = stats.totalVocab;
        document.getElementById('stat-learned').textContent = stats.learnedVocab;
        
        setTimeout(() => {
            const pb = document.getElementById('progress-bar');
            const pt = document.getElementById('progress-text');
            if(pb && pt) { pb.style.width = stats.progressPercent + '%'; pt.textContent = stats.progressPercent; }
        }, 100);

        const btn = document.getElementById('btn-quick-learn');
        if (btn) btn.addEventListener('click', () => { document.querySelector('.nav-item[data-tab="game"]')?.click(); });
    }
};