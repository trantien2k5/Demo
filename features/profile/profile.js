import { DataManager } from '../../core/services/storage.js';

export const ProfileTab = {
    render: () => {
        return `
            <div style="text-align: center; margin-bottom: 25px;">
                <div style="width: 90px; height: 90px; border-radius: 50%; background: var(--gradient-action); margin: 0 auto 15px auto; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px var(--primary-glow);">
                    <i class="fa-solid fa-user" style="font-size: 2.5rem; color: white;"></i>
                </div>
                <h2 style="color: var(--text-color); font-size: 1.4rem;">Trần Tiến</h2>
                <p style="color: var(--text-muted); font-size: 0.95rem;">Học viên xuất sắc 🌟</p>
            </div>

            <div class="card">
                <h3 style="font-size: 1.1rem; margin-bottom: 15px; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; color: var(--text-color);">Thống kê tổng quan</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: var(--text-muted);">Số ngày học liên tiếp</span>
                    <strong style="color: var(--primary-color);">5 ngày 🔥</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: var(--text-muted);">Từ vựng Master (Cấp 5)</span>
                    <strong style="color: var(--success-color);" id="profile-mastered">0 từ</strong>
                </div>
            </div>

            <div class="card">
                <h3 style="font-size: 1.1rem; margin-bottom: 15px; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; color: var(--text-color);">Cài đặt</h3>
                <div class="setting-item">
                    <span><i class="fa-solid fa-volume-high" style="width: 25px; color: #64748b;"></i> Phát âm tự động</span>
                    <label class="switch"><input type="checkbox" checked id="auto-speak-toggle"><span class="slider round"></span></label>
                </div>
                <div class="setting-item">
                    <span><i class="fa-solid fa-moon" style="width: 25px; color: #64748b;"></i> Giao diện tối (Dark Mode)</span>
                    <label class="switch"><input type="checkbox" id="dark-mode-toggle"><span class="slider round"></span></label>
                </div>
            </div>
            
            <button class="action-btn" style="background: transparent; color: var(--danger-color); border: 2px solid var(--danger-color); box-shadow: none; width: 100%;" onclick="alert('Tính năng đang phát triển!')">
                Đăng xuất
            </button>
        `;
    },

    init: () => {
        const stats = DataManager.getStats();
        const masterCount = stats.levelCounts ? stats.levelCounts[5] : 0;
        document.getElementById('profile-mastered').textContent = `${masterCount} từ`;

        // LÔ-GIC XỬ LÝ DARK MODE
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        // Kiểm tra xem trước đó user có đang dùng Dark mode không
        const isDarkMode = localStorage.getItem('smartVocab_darkMode') === 'true';
        
        if (isDarkMode) {
            darkModeToggle.checked = true;
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        darkModeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('smartVocab_darkMode', 'true');
            } else {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('smartVocab_darkMode', 'false');
            }
        });
    }
};