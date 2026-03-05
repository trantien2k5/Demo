export const RankingTab = {
    render: () => {
        return `
            <div class="card">
                <h2>Bảng vàng Tuần này 🏆</h2>
                <ul style="list-style: none; margin-top: 15px;">
                    <li style="padding: 12px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                        <span><span style="font-size: 1.2rem; margin-right: 10px;">🥇</span> Pro Coder</span> 
                        <span style="font-weight: bold;">1500 pts</span>
                    </li>
                    <li style="padding: 12px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background-color: #f8f9fa; border-radius: 8px;">
                        <span><span style="font-size: 1.2rem; margin-right: 10px;">🥈</span> Bạn</span> 
                        <span style="color: var(--primary-color); font-weight: bold;">1200 pts</span>
                    </li>
                    <li style="padding: 12px 0; display: flex; justify-content: space-between; align-items: center;">
                        <span><span style="font-size: 1.2rem; margin-right: 10px;">🥉</span> Chăm chỉ học</span> 
                        <span style="font-weight: bold;">950 pts</span>
                    </li>
                </ul>
            </div>
        `;
    },
    init: () => {
        
    }
};
