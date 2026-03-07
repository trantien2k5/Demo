import { HomeTab } from './features/home/home.js';
import { LibraryTab } from './features/library/library.js';
import { GameTab } from './features/game/game.js';
import { RankingTab } from './features/ranking/ranking.js';
import { ProfileTab } from './features/profile/profile.js';

// Nhập các Services chạy ngầm
import { initShortcuts } from './core/services/shortcut.js';
import { initNotifications } from './core/services/notification.js';
import { initErrorHandler } from './core/services/errorHandler.js';

// Khởi chạy Lưới an toàn ngay lập tức
initErrorHandler();

// Khôi phục giao diện Dark Mode 
if (localStorage.getItem('smartVocab_darkMode') === 'true') {
    document.documentElement.setAttribute('data-theme', 'dark');
}

// CẤU HÌNH ROUTER (ĐỊNH TUYẾN)
const appContent = document.getElementById('app-content');
const navItems = document.querySelectorAll('.nav-item');
const headerTitle = document.getElementById('header-title');

const routes = {
    home: { component: HomeTab, title: 'Smart Vocab Pro' },
    library: { component: LibraryTab, title: 'Thư Viện Của Tôi' },
    game: { component: GameTab, title: 'Ôn Tập Của Tôi' },
    ranking: { component: RankingTab, title: 'Bảng Xếp Hạng' },
    profile: { component: ProfileTab, title: 'Hồ Sơ' }
};

function navigateTo(tabId) {
    const route = routes[tabId];
    if (!route) return;

    try {
        appContent.innerHTML = route.component.render();
        headerTitle.textContent = route.title;

        if (typeof route.component.init === 'function') {
            route.component.init();
        }
    } catch (error) {
        console.error(`🚨 Lỗi nghiêm trọng tại tab [${tabId}]:`, error);
        appContent.innerHTML = `
            <div class="card" style="text-align: center; padding: 50px 20px; margin-top: 20px;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 4rem; color: var(--danger-color); margin-bottom: 20px;"></i>
                <h3 style="color: var(--danger-color); margin-bottom: 10px;">Tính năng này đang gặp sự cố</h3>
                <p style="color: #666; font-size: 0.95rem;">Lỗi đã được cách ly. Các tab khác của bạn vẫn hoạt động bình thường.</p>
            </div>
        `;
        headerTitle.textContent = "Bảo trì tính năng";
    }

    appContent.classList.remove('fade-in');
    void appContent.offsetWidth; 
    appContent.classList.add('fade-in');

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.tab === tabId) {
            item.classList.add('active');
        }
    });
}

// KHỞI CHẠY TOÀN BỘ ỨNG DỤNG
document.addEventListener('DOMContentLoaded', () => {
    // Gắn sự kiện click chuyển tab
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (!item.classList.contains('active')) navigateTo(item.dataset.tab);
        });
    });

    // Kích hoạt các tiện ích (Services)
    initShortcuts();
    initNotifications();

    // Load tab mặc định
    navigateTo('home');
});