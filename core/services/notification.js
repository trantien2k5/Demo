export function initNotifications() {
    const bellBtn = document.querySelector('.app-header .icon-btn');
    if (!bellBtn) return;

    let notifications = JSON.parse(localStorage.getItem('smartVocab_notifications')) || [
        { id: 1, type: 'success', icon: 'fa-trophy', color: '#fbbf24', title: 'Top 3 Server!', message: 'Bạn đã lọt vào top 3 bảng xếp hạng tuần này. Cố gắng duy trì nhé!', time: '10 phút trước', read: false },
        { id: 2, type: 'info', icon: 'fa-book-sparkles', color: '#3b82f6', title: 'Cập nhật từ vựng', message: 'Hệ thống vừa được nạp hơn 1600 từ vựng chuẩn Oxford 3000.', time: '2 giờ trước', read: false },
        { id: 3, type: 'warning', icon: 'fa-clock', color: '#ef4444', title: 'Đến giờ học rồi!', message: 'Hôm nay bạn chưa làm bài trắc nghiệm nào, vào ôn tập ngay kẻo quên!', time: '1 ngày trước', read: false }
    ];

    const unreadCount = notifications.filter(n => !n.read).length;
    if (unreadCount > 0) {
        bellBtn.style.position = 'relative';
        bellBtn.innerHTML += `<span id="noti-badge" style="position:absolute; top:-2px; right:-2px; background:#ef4444; color:white; font-size:0.65rem; font-weight:bold; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow: 0 2px 5px rgba(239, 68, 68, 0.4);">${unreadCount}</span>`;
    }

    const modalHTML = `
        <style>
            .noti-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); z-index: 9999; display: flex; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: all 0.3s ease; backdrop-filter: blur(3px); }
            .noti-overlay.active { opacity: 1; pointer-events: all; }
            .noti-content { background: var(--bg-card, #fff); width: 90%; max-width: 480px; border-radius: 24px; padding: 25px; box-shadow: 0 25px 50px rgba(0,0,0,0.2); transform: translateY(30px) scale(0.95); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); max-height: 80vh; display: flex; flex-direction: column; border: 1px solid var(--card-border, #e2e8f0); }
            .noti-overlay.active .noti-content { transform: translateY(0) scale(1); }
            .noti-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--card-border, #e2e8f0); }
            .noti-header h3 { font-size: 1.4rem; color: var(--text-color, #1e293b); font-weight: 800; display: flex; align-items: center; gap: 10px; margin: 0; }
            .noti-close-btn { background: rgba(0,0,0,0.05); width: 35px; height: 35px; border-radius: 50%; border: none; font-size: 1.2rem; color: var(--text-muted, #64748b); cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
            .noti-close-btn:hover { background: #fee2e2; color: #ef4444; transform: rotate(90deg); }
            .noti-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-right: 5px; }
            .noti-list::-webkit-scrollbar { width: 6px; }
            .noti-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            .noti-item { display: flex; gap: 15px; padding: 16px; border-radius: 16px; background: rgba(0,0,0,0.02); border: 1px solid var(--card-border, #e2e8f0); transition: all 0.2s; cursor: pointer; }
            .noti-item.unread { background: rgba(14, 165, 233, 0.05); border-color: rgba(14, 165, 233, 0.3); }
            .noti-item:hover { transform: translateX(5px); box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
            .noti-icon { width: 45px; height: 45px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; background: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            .noti-text { flex: 1; }
            .noti-title { font-weight: 800; font-size: 1.05rem; color: var(--text-color, #1e293b); margin-bottom: 6px; display: flex; justify-content: space-between; align-items: flex-start; }
            .noti-time { font-size: 0.75rem; color: var(--text-muted, #64748b); font-weight: 700; white-space: nowrap; margin-left: 10px; background: var(--bg-app); padding: 2px 8px; border-radius: 10px; }
            .noti-message { font-size: 0.95rem; color: var(--text-muted, #64748b); line-height: 1.4; }
            .noti-footer { margin-top: 20px; text-align: center; padding-top: 15px; }
            .mark-read-btn { background: rgba(16, 185, 129, 0.1); color: #10b981; border: none; padding: 12px 20px; border-radius: 12px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: 0.2s; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; }
            .mark-read-btn:hover { background: #10b981; color: white; }
        </style>
        <div class="noti-overlay" id="noti-modal">
            <div class="noti-content">
                <div class="noti-header">
                    <h3><i class="fa-solid fa-bell" style="color: var(--primary-color);"></i> Thông báo</h3>
                    <button class="noti-close-btn" id="close-noti"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="noti-list" id="noti-list"></div>
                <div class="noti-footer">
                    <button class="mark-read-btn" id="mark-all-read">
                        <i class="fa-solid fa-check-double"></i> Đánh dấu tất cả đã đọc
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById('noti-modal');
    const listEl = document.getElementById('noti-list');

    const renderNoti = () => {
        listEl.innerHTML = '';
        if (notifications.length === 0) {
            listEl.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted); font-weight: bold;"><i class="fa-regular fa-bell-slash" style="font-size: 3rem; margin-bottom: 15px; display: block; opacity: 0.5;"></i>Không có thông báo nào!</div>';
            return;
        }
        
        notifications.forEach(n => {
            listEl.innerHTML += `
                <div class="noti-item ${n.read ? '' : 'unread'}">
                    <div class="noti-icon" style="color: ${n.color};"><i class="fa-solid ${n.icon}"></i></div>
                    <div class="noti-text">
                        <div class="noti-title">${n.title} <span class="noti-time">${n.time}</span></div>
                        <div class="noti-message">${n.message}</div>
                    </div>
                </div>
            `;
        });
    };

    bellBtn.addEventListener('click', () => {
        renderNoti();
        modal.classList.add('active');
    });

    document.getElementById('close-noti').addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => { if(e.target === modal) modal.classList.remove('active'); });

    document.getElementById('mark-all-read').addEventListener('click', () => {
        notifications.forEach(n => n.read = true);
        localStorage.setItem('smartVocab_notifications', JSON.stringify(notifications));
        renderNoti();
        const badge = document.getElementById('noti-badge');
        if (badge) badge.remove();
    });
}