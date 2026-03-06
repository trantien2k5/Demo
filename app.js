import { HomeTab } from './features/home/home.js';
import { LibraryTab } from './features/library/library.js';
import { GameTab } from './features/game/game.js';
import { RankingTab } from './features/ranking/ranking.js';
import { ProfileTab } from './features/profile/profile.js';

// Khôi phục giao diện Dark Mode ngay lập tức khi mở web
if (localStorage.getItem('smartVocab_darkMode') === 'true') {
    document.documentElement.setAttribute('data-theme', 'dark');
}

const appContent = document.getElementById('app-content');
const navItems = document.querySelectorAll('.nav-item');
const headerTitle = document.getElementById('header-title');

// Khai báo các tab có trong ứng dụng
const routes = {
    home: { component: HomeTab, title: 'Smart Vocab Pro' },
    library: { component: LibraryTab, title: 'Thư Viện Của Tôi' },
    game: { component: GameTab, title: 'Ôn Tập Của Tôi' }, // <-- Sửa dòng này
    ranking: { component: RankingTab, title: 'Bảng Xếp Hạng' },
    profile: { component: ProfileTab, title: 'Hồ Sơ' }
};

// Hàm chuyển trang (Đã bọc chống Crash)
function navigateTo(tabId) {
    const route = routes[tabId];
    if (!route) return;

    try {
        // Cố gắng vẽ giao diện và chạy logic
        appContent.innerHTML = route.component.render();
        headerTitle.textContent = route.title;

        if (typeof route.component.init === 'function') {
            route.component.init();
        }
    } catch (error) {
        // NẾU CÓ LỖI: Bắt gọn lỗi lại, không cho văng ra ngoài làm chết Web
        console.error(`🚨 Lỗi nghiêm trọng tại tab [${tabId}]:`, error);
        
        // Vẽ một giao diện báo lỗi lịch sự, cách ly lỗi ở đúng tab này
        appContent.innerHTML = `
            <div class="card" style="text-align: center; padding: 50px 20px; margin-top: 20px;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 4rem; color: var(--danger-color); margin-bottom: 20px;"></i>
                <h3 style="color: var(--danger-color); margin-bottom: 10px;">Tính năng này đang gặp sự cố</h3>
                <p style="color: #666; font-size: 0.95rem;">Không sao cả! Lỗi đã được cách ly. Các tab khác của bạn vẫn hoạt động bình thường.</p>
            </div>
        `;
        headerTitle.textContent = "Bảo trì tính năng";
    }

    // Hiệu ứng chuyển cảnh
    appContent.classList.remove('fade-in');
    void appContent.offsetWidth; 
    appContent.classList.add('fade-in');

    // Cập nhật trạng thái màu xanh cho thanh điều hướng
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.tab === tabId) {
            item.classList.add('active');
        }
    });
}

// Bắt sự kiện click chuyển tab
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (!item.classList.contains('active')) {
            navigateTo(item.dataset.tab);
        }
    });
});

// Chạy tab mặc định khi load web
document.addEventListener('DOMContentLoaded', () => {
    navigateTo('home');
});

// --- LƯỚI AN TOÀN TOÀN CỤC (GLOBAL ERROR HANDLER) ---
// Bắt mọi lỗi xảy ra ở bất kỳ đâu (lỗi click nút, lỗi tính toán...)
window.addEventListener('error', function(event) {
    console.error("🚨 Lưới an toàn đã bắt được một lỗi ngầm:", event.error);
    
    // Ngăn chặn trình duyệt tự động sập/đơ ứng dụng
    event.preventDefault(); 
    
    // (Tùy chọn) Hiển thị một thông báo nhỏ gọn góc màn hình cho người dùng
    showToastError("Có một trục trặc nhỏ vừa xảy ra, nhưng ứng dụng vẫn hoạt động bình thường!");
});

// Bắt các lỗi liên quan đến tải dữ liệu bất đồng bộ (Promises)
window.addEventListener('unhandledrejection', function(event) {
    console.error("🚨 Lưới an toàn đã bắt được lỗi Dữ liệu:", event.reason);
    event.preventDefault();
});

// Hàm tạo thông báo nổi (Toast) góc màn hình
function showToastError(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: var(--danger-color); color: white;
        padding: 12px 20px; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999; font-size: 0.9rem;
        animation: slideInUp 0.3s ease forwards;
    `;
    toast.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${message}`;
    document.body.appendChild(toast);
    
    // Tự động biến mất sau 3 giây
    setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Thêm CSS cho hiệu ứng Toast ngay bằng JS để khỏi phải sửa file CSS
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideInUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideOutDown { from { transform: translateY(0); opacity: 1; } to { transform: translateY(100px); opacity: 0; } }
`;
document.head.appendChild(style);

// ==========================================
// HỆ THỐNG PHÍM TẮT (SHORTCUT MANAGER)
// ==========================================
const defaultShortcuts = {
    opt1: '1',
    opt2: '2',
    opt3: '3',
    opt4: '4',
    next: 'enter',
    audio: 's'
};

// Khởi tạo phím tắt nếu chưa có
if (!localStorage.getItem('smartVocab_shortcuts')) {
    localStorage.setItem('smartVocab_shortcuts', JSON.stringify(defaultShortcuts));
}

// Lắng nghe sự kiện bàn phím toàn cầu
document.addEventListener('keydown', (e) => {
    // Bỏ qua nếu người dùng đang gõ vào ô input tìm kiếm
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const shortcuts = JSON.parse(localStorage.getItem('smartVocab_shortcuts')) || defaultShortcuts;
    let pressedKey = e.key.toLowerCase();
    if (e.code === 'Space') pressedKey = 'space';

    // Bắt sự kiện cho Tab Game
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
            // Tìm nút loa và mô phỏng click
            const audioBtn = document.querySelector('.feedback-card button');
            if(audioBtn) audioBtn.click();
            else {
                // Nếu chưa hiện feedback, đọc câu hỏi hiện tại
                const text = document.getElementById('question-word').textContent;
                if(window.playGameAudio) window.playGameAudio(text);
            }
        }
    }
});