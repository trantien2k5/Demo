import { DataManager } from '../../core/services/storage.js';

export const LibraryTab = {
    render: () => {
        return `
            <style>
                .library-container { max-width: 1200px; margin: 0 auto; width: 100%; padding-bottom: 20px; display: flex; flex-direction: column; min-height: 100%; }
                .search-container { position: sticky; top: -20px; z-index: 10; background: var(--bg-app); padding: 15px 0 25px 0; }
                .search-input { width: 100%; padding: 18px 25px; border-radius: 20px; border: 1px solid var(--card-border); font-size: 1.05rem; background: var(--bg-card); color: var(--text-color); box-shadow: var(--card-shadow); outline: none; transition: border 0.2s; font-weight: 600; }
                .search-input:focus { border-color: var(--primary-color); }
                #vocab-list { display: grid; grid-template-columns: 1fr; gap: 15px; flex: 1;}
                .vocab-card { background: var(--bg-card); padding: 25px; border-radius: 20px; border: 1px solid var(--card-border); box-shadow: var(--card-shadow); display: flex; flex-direction: column; gap: 12px; transition: transform 0.2s; animation: fadeInDown 0.3s ease; }
                .vocab-card:hover { transform: translateY(-4px); border-color: var(--primary-color); }
                .vocab-header { display: flex; justify-content: space-between; align-items: flex-start; }
                .vocab-word { font-size: 1.5rem; font-weight: 800; color: var(--primary-color); }
                .vocab-type { font-size: 0.85rem; color: #3b82f6; background: rgba(59,130,246,0.1); padding: 4px 10px; border-radius: 8px; margin-left: 10px; font-weight: 700; }
                .vocab-phonetic { color: var(--text-muted); font-family: monospace; font-size: 1rem; }
                .vocab-meaning { font-weight: 800; color: var(--text-color); font-size: 1.15rem; border-bottom: 1px dashed var(--card-border); padding-bottom: 12px; margin-bottom: 5px; }
                .vocab-example { font-style: italic; color: var(--text-color); font-size: 1rem; line-height: 1.4; }
                .vocab-example-vi { color: var(--text-muted); font-size: 0.9rem; }
                
                /* Điểm neo (Sentinel) để kích hoạt tải thêm */
                #scroll-sentinel { height: 40px; margin-top: 20px; display: flex; justify-content: center; align-items: center; color: var(--text-muted); font-size: 0.9rem; font-weight: bold; }

                @media (min-width: 768px) {
                    .search-container { max-width: 700px; margin: 0 auto; }
                    #vocab-list { grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 25px; }
                }
            </style>
            <div class="library-container fade-in">
                <div class="search-container">
                    <input type="text" id="search-vocab" class="search-input" placeholder="Tìm kiếm từ vựng (Anh/Việt)...">
                </div>
                <div id="vocab-list"></div>
                <div id="scroll-sentinel"><i class="fa-solid fa-circle-notch fa-spin" style="margin-right: 8px;"></i> Đang tải thêm...</div>
            </div>
        `;
    },
    init: () => {
        const vocabList = DataManager.getVocabList();
        const listContainer = document.getElementById('vocab-list');
        const searchInput = document.getElementById('search-vocab');
        const sentinel = document.getElementById('scroll-sentinel');

        let currentData = vocabList;
        let loadedCount = 0;
        const CHUNK_SIZE = 50; // Kéo thả mỗi lần 50 từ để chống Lag

        // Hàm render từng mảng nhỏ
        const renderChunk = () => {
            const chunk = currentData.slice(loadedCount, loadedCount + CHUNK_SIZE);
            if (chunk.length === 0) return;

            const html = chunk.map(item => {
                const safeWord = item.word.replace(/'/g, "\\'");
                return `
                    <div class="vocab-card">
                        <div class="vocab-header">
                            <div>
                                <span class="vocab-word">${item.word}</span>
                                <span class="vocab-type">${item.type}</span>
                            </div>
                            <button onclick="if('speechSynthesis' in window){window.speechSynthesis.cancel();let u=new SpeechSynthesisUtterance('${safeWord}');u.lang='en-US';window.speechSynthesis.speak(u);}" style="margin:0; width: 40px; height: 40px; border-radius: 12px; background: rgba(14, 165, 233, 0.1); color: var(--primary-color); border: none; cursor: pointer; transition: 0.2s;">
                                <i class="fa-solid fa-volume-high" style="font-size: 1.1rem;"></i>
                            </button>
                        </div>
                        <div class="vocab-phonetic">${item.phonetic}</div>
                        <div class="vocab-meaning">${item.meaning}</div>
                        ${item.example ? `
                        <div class="vocab-example">"${item.example}"</div>
                        <div class="vocab-example-vi">${item.example_vi}</div>
                        ` : ''}
                    </div>
                `;
            }).join('');

            listContainer.insertAdjacentHTML('beforeend', html);
            loadedCount += CHUNK_SIZE;

            // Ẩn điểm tải thêm nếu đã hết danh sách
            if (loadedCount >= currentData.length) {
                sentinel.style.display = 'none';
            } else {
                sentinel.style.display = 'flex';
            }
        };

        // Khởi tạo mới khi có lệnh Tìm kiếm
        const applyFilter = (data) => {
            currentData = data;
            loadedCount = 0;
            listContainer.innerHTML = '';
            
            if (data.length === 0) {
                listContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 20px; width: 100%; grid-column: 1 / -1;">Không tìm thấy từ vựng nào.</p>';
                sentinel.style.display = 'none';
                return;
            }
            renderChunk();
        };

        // Kỹ thuật Intersection Observer (Theo dõi khi cuộn đến đáy thì gọi renderChunk)
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && loadedCount < currentData.length) {
                renderChunk();
            }
        }, { rootMargin: '200px' }); // Load trước khi chạm đáy 200px

        observer.observe(sentinel);

        // Kỹ thuật Debounce (Đợi người dùng gõ xong mới tìm kiếm để tránh giật máy)
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const term = e.target.value.toLowerCase();
                const filtered = vocabList.filter(v => v.word.toLowerCase().includes(term) || v.meaning.toLowerCase().includes(term));
                applyFilter(filtered);
            }, 300); // Trì hoãn 300 mili-giây
        });

        // Lần tải đầu tiên
        applyFilter(vocabList);
    }
};