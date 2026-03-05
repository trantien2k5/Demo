export const ProfileTab = {
    render: () => {
        return `
            <div style="text-align: center; padding: 20px 0;">
                <div style="width: 80px; height: 80px; background: var(--primary-color); border-radius: 50%; margin: 0 auto 10px auto; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                    <i class="fa-solid fa-user"></i>
                </div>
                <h2 style="color: var(--text-color);">Trần Tiến</h2>
                <p style="color: #888; font-size: 0.9rem; margin-top: 5px;">trantien2k5@gmail.com</p>
                <p style="color: var(--primary-color); font-weight: 500; margin-top: 5px;">Học viên ưu tú</p>
            </div>
            <div class="card">
                <div style="padding: 15px 0; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 15px; cursor: pointer;">
                    <i class="fa-solid fa-gear" style="color: #888;"></i>
                    <span>Cài đặt tài khoản</span>
                </div>
                <div style="padding: 15px 0; display: flex; align-items: center; gap: 15px; cursor: pointer; color: var(--danger-color);">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    <span>Đăng xuất</span>
                </div>
            </div>
        `;
    },
    init: () => {
        
    }
};
