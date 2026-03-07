import { DataManager } from '../../core/services/storage.js';

export const RankingTab = {
    render: () => {
        return `
            <style>
                .ranking-container { max-width: 650px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 20px; }
                .ranking-header { background: var(--gradient-action); border-radius: 24px; text-align: center; padding: 35px 20px; color: white; box-shadow: 0 10px 25px rgba(14, 165, 233, 0.3); }
                .ranking-header h2 { font-size: 1.8rem; margin-bottom: 5px; font-weight: 800; }
                .ranking-header p { font-size: 1rem; opacity: 0.9; }
                .ranking-board { background: var(--bg-card); border-radius: 24px; padding: 15px 25px; border: 1px solid var(--card-border); box-shadow: var(--card-shadow); }
                .ranking-item { display: flex; align-items: center; padding: 18px 0; border-bottom: 1px solid var(--card-border); transition: background 0.2s; }
                .ranking-item:last-child { border-bottom: none; }
                .rank-badge { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; margin-right: 18px; flex-shrink: 0; }
                .rank-badge.gold { background: #fef08a; color: #ca8a04; font-size: 1.3rem; box-shadow: 0 4px 15px rgba(202, 138, 4, 0.2); }
                .rank-badge.silver { background: #e2e8f0; color: #64748b; }
                .rank-badge.bronze { background: #ffedd5; color: #c2410c; }
                .rank-badge.normal { color: var(--text-muted); background: transparent; font-size: 1.1rem; }
                .avatar-circle { width: 50px; height: 50px; border-radius: 50%; background: var(--gradient-vocab); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.3rem; margin-right: 18px; flex-shrink: 0; box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2); }
                .user-info { flex: 1; }
                .user-info .name { font-weight: 800; color: var(--text-color); font-size: 1.15rem; }
                .score { font-weight: 800; color: var(--primary-color); font-size: 1.3rem; }
            </style>
            <div class="ranking-container fade-in">
                <div class="ranking-header">
                    <h2>Bảng Xếp Hạng</h2>
                    <p>Thi đua học tập tuần này 🏆</p>
                </div>
                <div class="ranking-board" id="leaderboard-list">
                    <p style="text-align: center; padding: 20px; color: var(--text-muted);">Đang tải dữ liệu...</p>
                </div>
            </div>
        `;
    },
    init: () => {
        const stats = DataManager.getStats();
        const userScore = stats.learnedVocab * 10;
        const leaderboardData = [
            { name: "Nguyễn Văn A", score: 1520, avatar: "A" },
            { name: "Trần Thị B", score: 1250, avatar: "B" },
            { name: "Tiến (Bạn)", score: userScore, avatar: "T", isUser: true },
            { name: "Lê Văn C", score: 840, avatar: "C" },
            { name: "Phạm Thị D", score: 620, avatar: "D" }
        ];
        leaderboardData.sort((a, b) => b.score - a.score);

        const listContainer = document.getElementById('leaderboard-list');
        let htmlContent = '';

        leaderboardData.forEach((user, index) => {
            let rankBadge = '';
            let cardStyle = user.isUser ? 'background: rgba(59,130,246,0.05); border-radius: 12px; padding-left: 10px; padding-right: 10px; margin-left: -10px; margin-right: -10px;' : '';
            
            if (index === 0) rankBadge = '<div class="rank-badge gold"><i class="fa-solid fa-crown"></i></div>';
            else if (index === 1) rankBadge = '<div class="rank-badge silver">2</div>';
            else if (index === 2) rankBadge = '<div class="rank-badge bronze">3</div>';
            else rankBadge = `<div class="rank-badge normal">${index + 1}</div>`;

            htmlContent += `
                <div class="ranking-item" style="${cardStyle}">
                    ${rankBadge}
                    <div class="avatar-circle">${user.avatar}</div>
                    <div class="user-info"><div class="name">${user.name}</div></div>
                    <div class="score">${user.score} <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: normal;">điểm</span></div>
                </div>
            `;
        });
        listContainer.innerHTML = htmlContent;
    }
};