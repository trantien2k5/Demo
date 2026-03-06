import { DataManager } from '../../core/services/storage.js';

export const ProfileTab = {
    render: () => {
        return `
            <style>
                .profile-container { max-width: 650px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 20px; padding-bottom: 30px; }
                .profile-header { text-align: center; margin-bottom: 10px; }
                .avatar-large { width: 110px; height: 110px; border-radius: 50%; background: var(--gradient-action); margin: 0 auto 15px auto; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(14, 165, 233, 0.3); }
                .avatar-large i { font-size: 3.5rem; color: white; }
                .profile-name { color: var(--text-color); font-size: 1.8rem; font-weight: 800; }
                .profile-title { color: var(--text-muted); font-size: 1.05rem; margin-top: 5px; font-weight: 600; }
                
                .settings-card { background: var(--bg-card); border-radius: 24px; padding: 30px; border: 1px solid var(--card-border); box-shadow: var(--card-shadow); }
                .settings-card h3 { font-size: 1.3rem; margin-bottom: 20px; border-bottom: 1px solid var(--card-border); padding-bottom: 12px; color: var(--text-color); font-weight: 800; }
                
                .stat-row { display: flex; justify-content: space-between; margin-bottom: 18px; font-size: 1.1rem; font-weight: 600; }
                .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; color: var(--text-color); font-weight: 700; font-size: 1.1rem; }
                
                /* Switch Toggle */
                .switch { position: relative; display: inline-block; width: 54px; height: 30px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .3s; border-radius: 34px; }
                .slider:before { position: absolute; content: ""; height: 22px; width: 22px; left: 4px; bottom: 4px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
                input:checked + .slider { background: #10b981; }
                input:checked + .slider:before { transform: translateX(24px); }
                
                .logout-btn { background: transparent; color: #ef4444; border: 2px solid #ef4444; padding: 18px; border-radius: 18px; font-weight: 800; font-size: 1.15rem; cursor: pointer; transition: all 0.2s; width: 100%; margin-top: 10px; }
                .logout-btn:hover { background: #fef2f2; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(239, 68, 68, 0.1); }

                /* ================= MODAL PHÍM TẮT ================= */
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); z-index: 1000; display: flex; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: all 0.3s ease; backdrop-filter: blur(3px); }
                .modal-overlay.active { opacity: 1; pointer-events: all; }
                .modal-content { background: var(--bg-card); width: 90%; max-width: 500px; border-radius: 24px; padding: 30px; box-shadow: 0 25px 50px rgba(0,0,0,0.2); transform: translateY(30px); transition: all 0.3s ease; max-height: 85vh; overflow-y: auto; border: 1px solid var(--card-border); }
                .modal-overlay.active .modal-content { transform: translateY(0); }
                .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--card-border); padding-bottom: 15px; }
                .modal-header h3 { font-size: 1.4rem; color: var(--text-color); font-weight: 800; margin: 0; }
                .close-modal-btn { background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer; transition: 0.2s; }
                .close-modal-btn:hover { color: #ef4444; transform: scale(1.1); }
                
                .shortcut-list { display: flex; flex-direction: column; gap: 12px; margin-top: 15px; }
                .shortcut-item { display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.02); padding: 15px; border-radius: 16px; border: 1px solid var(--card-border); }
                .shortcut-label { color: var(--text-color); font-weight: 700; font-size: 1.05rem; }
                .shortcut-btn { background: white; border: 2px solid #cbd5e1; border-radius: 10px; padding: 8px 18px; font-family: monospace; font-size: 1.1rem; font-weight: bold; color: var(--primary-color); cursor: pointer; transition: all 0.2s; min-width: 80px; text-align: center; box-shadow: 0 2px 0 #cbd5e1; }
                .shortcut-btn:hover { border-color: var(--primary-color); transform: translateY(-2px); box-shadow: 0 4px 0 var(--primary-color); }
                .shortcut-btn.listening { background: var(--primary-color); color: white; border-color: var(--primary-color); box-shadow: 0 0 15px rgba(14, 165, 233, 0.4); animation: pulse 1s infinite; }
                @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
                
                .open-modal-trigger { background: rgba(59, 130, 246, 0.1); color: var(--primary-color); border: none; padding: 12px 20px; border-radius: 12px; font-weight: 800; font-size: 1.05rem; cursor: pointer; transition: 0.2s; width: 100%; display: flex; justify-content: center; align-items: center; gap: 10px; }
                .open-modal-trigger:hover { background: var(--primary-color); color: white; }
            </style>

            <div class="profile-container fade-in">
                <div class="profile-header">
                    <div class="avatar-large"><i class="fa-solid fa-user"></i></div>
                    <div class="profile-name">Trần Tiến</div>
                    <div class="profile-title">Học viên xuất sắc 🌟</div>
                </div>

                <div class="settings-card">
                    <h3>Thống kê tổng quan</h3>
                    <div class="stat-row">
                        <span style="color: var(--text-muted);">Số ngày học liên tiếp</span>
                        <strong style="color: var(--primary-color);">5 ngày 🔥</strong>
                    </div>
                    <div class="stat-row">
                        <span style="color: var(--text-muted);">Từ vựng Master (Cấp 5)</span>
                        <strong style="color: #10b981;" id="profile-mastered">0 từ</strong>
                    </div>
                </div>

                <div class="settings-card">
                    <h3>Cài đặt hệ thống</h3>
                    <div class="setting-item">
                        <span><i class="fa-solid fa-volume-high" style="width: 30px; color: #3b82f6;"></i> Phát âm tự động</span>
                        <label class="switch">
                            <input type="checkbox" id="auto-speak-toggle" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <span><i class="fa-solid fa-moon" style="width: 30px; color: #64748b;"></i> Giao diện tối</span>
                        <label class="switch">
                            <input type="checkbox" id="dark-mode-toggle">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <hr style="border: none; border-top: 1px dashed var(--card-border); margin: 20px 0;">
                    <button class="open-modal-trigger" id="btn-open-shortcuts">
                        <i class="fa-solid fa-keyboard"></i> Cấu hình Phím tắt
                    </button>
                </div>
                
                <button class="logout-btn" onclick="alert('Tính năng đang phát triển!')">
                    <i class="fa-solid fa-right-from-bracket"></i> Đăng xuất
                </button>
            </div>

            <div class="modal-overlay" id="shortcuts-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Cấu hình Phím tắt</h3>
                        <button class="close-modal-btn" id="btn-close-shortcuts"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <p style="font-size: 0.95rem; color: var(--text-muted);">Nhấp vào phím bên dưới và gõ phím mới để thay đổi.</p>
                    
                    <div class="shortcut-list" id="shortcut-list"></div>
                    
                    <button id="reset-shortcuts" style="width: 100%; margin-top: 20px; padding: 15px; border-radius: 12px; background: rgba(239, 68, 68, 0.1); color: #ef4444; font-weight: bold; border: none; cursor: pointer; transition: 0.2s;">
                        <i class="fa-solid fa-rotate-right"></i> Khôi phục Mặc định
                    </button>
                </div>
            </div>
        `;
    },
    init: () => {
        const stats = DataManager.getStats();
        const masterCount = stats.levelCounts ? stats.levelCounts[5] : 0;
        document.getElementById('profile-mastered').textContent = `${masterCount} từ`;

        // Setting toggles
        const autoSpeakToggle = document.getElementById('auto-speak-toggle');
        if(localStorage.getItem('smartVocab_autoSpeak') === 'false') autoSpeakToggle.checked = false;
        autoSpeakToggle.addEventListener('change', (e) => localStorage.setItem('smartVocab_autoSpeak', e.target.checked));

        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (localStorage.getItem('smartVocab_darkMode') === 'true') darkModeToggle.checked = true;
        darkModeToggle.addEventListener('change', (e) => {
            if (e.target.checked) { document.documentElement.setAttribute('data-theme', 'dark'); localStorage.setItem('smartVocab_darkMode', 'true'); } 
            else { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('smartVocab_darkMode', 'false'); }
        });

        // Xử lý bật tắt Modal
        const modal = document.getElementById('shortcuts-modal');
        document.getElementById('btn-open-shortcuts').addEventListener('click', () => modal.classList.add('active'));
        document.getElementById('btn-close-shortcuts').addEventListener('click', () => modal.classList.remove('active'));
        modal.addEventListener('click', (e) => { if(e.target === modal) modal.classList.remove('active'); }); // Click ngoài để đóng

        // Logic Custom Shortcuts
        const defaultShortcuts = { opt1: '1', opt2: '2', opt3: '3', opt4: '4', next: 'enter', audio: 's' };
        const shortcutNames = { opt1: 'Chọn Đáp án 1', opt2: 'Chọn Đáp án 2', opt3: 'Chọn Đáp án 3', opt4: 'Chọn Đáp án 4', next: 'Tiếp tục / Bỏ qua', audio: 'Phát âm (Audio)' };
        
        let currentShortcuts = JSON.parse(localStorage.getItem('smartVocab_shortcuts')) || defaultShortcuts;
        let isListening = false;

        const renderShortcuts = () => {
            const listEl = document.getElementById('shortcut-list');
            listEl.innerHTML = '';
            for (const key in currentShortcuts) {
                listEl.innerHTML += `
                    <div class="shortcut-item">
                        <span class="shortcut-label">${shortcutNames[key]}</span>
                        <button class="shortcut-btn" data-key="${key}">${currentShortcuts[key].toUpperCase()}</button>
                    </div>
                `;
            }

            document.querySelectorAll('.shortcut-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    if (isListening) return;
                    isListening = true;
                    this.classList.add('listening');
                    this.textContent = '...';

                    const actionKey = this.getAttribute('data-key');
                    const keydownHandler = (eEvent) => {
                        eEvent.preventDefault();
                        let newKey = eEvent.key.toLowerCase();
                        if (eEvent.code === 'Space') newKey = 'space';
                        
                        currentShortcuts[actionKey] = newKey;
                        localStorage.setItem('smartVocab_shortcuts', JSON.stringify(currentShortcuts));
                        
                        document.removeEventListener('keydown', keydownHandler);
                        isListening = false;
                        renderShortcuts();
                    };
                    document.addEventListener('keydown', keydownHandler);
                });
            });
        };

        renderShortcuts();

        document.getElementById('reset-shortcuts').addEventListener('click', () => {
            currentShortcuts = {...defaultShortcuts};
            localStorage.setItem('smartVocab_shortcuts', JSON.stringify(currentShortcuts));
            renderShortcuts();
        });
    }
};