import { DataManager } from '../../core/services/storage.js';

export const RankingTab = {
    render: () => {
        return `
            <div class="card" style="background: var(--gradient-action); border: none; text-align: center; padding: 30px 20px;">
                <h2 style="color: white; font-size: 1.5rem; margin-bottom: 5px;">Bảng Xếp Hạng</h2>
                <p style="color: rgba(255,255,255,0.9); font-size: 0.95rem;">Thi đua học tập tuần này 🏆</p>
            </div>

            <div class="card" style="padding: 10px 20px;">
                <div id="leaderboard-list">
                    <p style="text-align: center; padding: 20px; color: var(--text-muted);">Đang tải dữ liệu...</p>
                </div>
            </div>
        `;
    },

    init: () => {
        // Lấy số từ vựng đã học của user hiện tại để đưa vào bảng xếp hạng
        const stats = DataManager.getStats();
        const userScore = stats.learnedVocab * 10; // Giả sử mỗi từ thuộc được 10 điểm

        // Tạo dữ liệu giả lập (Mock data) cho bảng xếp hạng
        const leaderboardData = [
            { name: "Nguyễn Văn A", score: 1520, avatar: "A" },
            { name: "Trần Thị B", score: 1250, avatar: "B" },
            { name: "Tiến (Bạn)", score: userScore, avatar: "T", isUser: true },
            { name: "Lê Văn C", score: 840, avatar: "C" },
            { name: "Phạm Thị D", score: 620, avatar: "D" }
        ];

        // Sắp xếp điểm từ cao xuống thấp
        leaderboardData.sort((a, b) => b.score - a.score);

        const listContainer = document.getElementById('leaderboard-list');
        let htmlContent = '';

        leaderboardData.forEach((user, index) => {
            let rankBadge = '';
            let cardStyle = user.isUser ? 'background: #eff6ff; border-left: 4px solid var(--primary-color);' : '';
            
            // Huy chương cho top 3
            if (index === 0) rankBadge = '<div class="rank-badge gold"><i class="fa-solid fa-crown"></i></div>';
            else if (index === 1) rankBadge = '<div class="rank-badge silver">2</div>';
            else if (index === 2) rankBadge = '<div class="rank-badge bronze">3</div>';
            else rankBadge = `<div class="rank-badge normal">${index + 1}</div>`;

            htmlContent += `
                <div class="ranking-item" style="${cardStyle}">
                    ${rankBadge}
                    <div class="avatar-circle">${user.avatar}</div>
                    <div class="user-info">
                        <div class="name">${user.name}</div>
                    </div>
                    <div class="score">${user.score} <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">điểm</span></div>
                </div>
            `;
        });

        listContainer.innerHTML = htmlContent;
    }
};