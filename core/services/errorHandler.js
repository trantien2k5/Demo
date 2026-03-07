export function initErrorHandler() {
    window.addEventListener('error', function(event) {
        console.error("🚨 Lưới an toàn đã bắt được một lỗi ngầm:", event.error);
        event.preventDefault(); 
        showToastError("Có một trục trặc nhỏ vừa xảy ra, nhưng ứng dụng vẫn hoạt động bình thường!");
    });

    window.addEventListener('unhandledrejection', function(event) {
        console.error("🚨 Lưới an toàn đã bắt được lỗi Dữ liệu:", event.reason);
        event.preventDefault();
    });

    function showToastError(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: var(--danger-color, #ef4444); color: white;
            padding: 12px 20px; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 99999; font-size: 0.9rem;
            animation: slideInUp 0.3s ease forwards;
        `;
        toast.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${message}`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutDown 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideInUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideOutDown { from { transform: translateY(0); opacity: 1; } to { transform: translateY(100px); opacity: 0; } }
    `;
    document.head.appendChild(style);
}