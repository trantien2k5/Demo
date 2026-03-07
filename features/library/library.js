import { DataManager } from '../../core/services/storage.js';

export const LibraryTab = {
    render: () => {
        return `
            <style>
                .library-container { max-width: 1000px; margin: 0 auto; width: 100%; padding-bottom: 30px; display: flex; flex-direction: column; min-height: 100%; }
                
                /* THANH TÌM KIẾM CỐ ĐỊNH TRÊN CÙNG */
                .library-topbar { position: sticky; top: -20px; z-index: 10; background: var(--bg-app); padding: 15px 0; margin-bottom: 10px; }
                .search-input { width: 100%; padding: 16px 20px; border-radius: 16px; border: 2px solid var(--card-border); font-size: 1.05rem; background: var(--bg-card); color: var(--text-color); box-shadow: var(--card-shadow); outline: none; font-weight: 600; transition: border 0.2s; }
                .search-input:focus { border-color: var(--primary-color); }

                /* GIAO DIỆN 1: MÀN HÌNH DANH MỤC (THƯ MỤC) */
                #category-view { display: flex; flex-direction: column; gap: 25px; animation: fadeIn 0.3s ease; }
                .category-section h2 { font-size: 1.3rem; font-weight: 800; color: var(--text-color); margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
                
                .folder-grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
                .folder-card { background: var(--bg-card); border: 1px solid var(--card-border); padding: 20px; border-radius: 20px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; box-shadow: var(--card-shadow); transition: all 0.2s ease; }
                .folder-card:hover { transform: translateY(-4px); border-color: var(--primary-color); box-shadow: 0 10px 25px rgba(14, 165, 233, 0.15); }
                .folder-info { display: flex; align-items: center; gap: 15px; }
                .folder-icon { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
                .folder-title { font-size: 1.15rem; font-weight: 800; color: var(--text-color); margin-bottom: 4px; }
                .folder-count { font-size: 0.9rem; color: var(--text-muted); font-weight: 600; background: var(--bg-app); padding: 4px 10px; border-radius: 10px; display: inline-block; }
                .folder-arrow { color: #cbd5e1; font-size: 1.2rem; transition: 0.2s; }
                .folder-card:hover .folder-arrow { color: var(--primary-color); transform: translateX(5px); }

                /* Màu sắc icon cấp độ */
                .ic-lv1 { background: #fee2e2; color: #ef4444; }
                .ic-lv2 { background: #ffedd5; color: #f97316; }
                .ic-lv3 { background: #fef08a; color: #ca8a04; }
                .ic-lv4 { background: #e0e7ff; color: #3b82f6; }
                .ic-lv5 { background: #ecfdf5; color: #10b981; }
                .ic-topic { background: rgba(59,130,246,0.1); color: #3b82f6; }

                /* GIAO DIỆN 2: MÀN HÌNH DANH SÁCH TỪ VỰNG CHI TIẾT */
                #detail-view { display: none; flex-direction: column; gap: 15px; animation: fadeIn 0.3s ease; }
                .detail-header { display: flex; flex-direction: column; gap: 15px; background: var(--bg-card); padding: 20px; border-radius: 20px; border: 1px solid var(--card-border); box-shadow: var(--card-shadow); margin-bottom: 10px; }
                .detail-header-top { display: flex; align-items: center; gap: 15px; }
                .btn-back { background: var(--bg-app); border: none; width: 40px; height: 40px; border-radius: 12px; font-size: 1.1rem; color: var(--text-color); cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
                .btn-back:hover { background: #e2e8f0; color: var(--primary-color); transform: translateX(-3px); }
                .detail-title { font-size: 1.3rem; font-weight: 800; color: var(--primary-color); flex: 1; }
                .detail-count-badge { background: rgba(14,165,233,0.1); color: var(--primary-color); padding: 5px 12px; border-radius: 12px; font-weight: 800; font-size: 0.9rem; }
                
                /* Công tắc đổi chế độ học trong chi tiết */
                .display-mode-select { width: 100%; padding: 12px 15px; border-radius: 12px; background: var(--bg-app); border: 1px solid var(--card-border); color: var(--text-color); font-weight: 700; outline: none; cursor: pointer; font-size: 0.95rem; }
                .display-mode-select:focus { border-color: var(--primary-color); }

                /* LƯỚI THẺ TỪ VỰNG (GIỐNG CŨ) */
                #vocab-list { display: grid; grid-template-columns: 1fr; gap: 15px; }
                .vocab-card { background: var(--bg-card); padding: 20px; border-radius: 20px; border: 1px solid var(--card-border); box-shadow: var(--card-shadow); display: flex; flex-direction: column; transition: transform 0.2s; animation: fadeInDown 0.3s ease; }
                .vocab-card:hover { transform: translateY(-3px); border-color: var(--primary-color); }
                .vocab-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;}
                .vocab-word { font-size: 1.5rem; font-weight: 800; color: var(--primary-color); }
                .vocab-type { font-size: 0.8rem; color: #3b82f6; background: rgba(59,130,246,0.1); padding: 3px 8px; border-radius: 8px; margin-left: 8px; font-weight: 700; vertical-align: middle; }
                .vocab-phonetic { color: var(--text-muted); font-family: monospace; font-size: 1rem; margin-bottom: 10px; }
                
                .secret-box { position: relative; transition: all 0.3s ease; border-radius: 12px; }
                .secret-box.active-secret { cursor: pointer; user-select: none; background: rgba(0,0,0,0.03); padding: 10px; margin: -10px; }
                .secret-box.active-secret > * { filter: blur(8px); opacity: 0.2; pointer-events: none; transition: 0.3s; }
                .secret-box.active-secret:hover > * { filter: blur(5px); opacity: 0.4; }
                .secret-box.active-secret::after { content: "👆 Chạm để xem"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: 800; color: var(--primary-color); font-size: 1rem; background: var(--bg-card); padding: 8px 18px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); z-index: 2; border: 1px solid var(--primary-color); }

                .vocab-meaning { font-weight: 800; color: var(--text-color); font-size: 1.15rem; border-bottom: 1px dashed var(--card-border); padding-bottom: 10px; margin-bottom: 8px; }
                .vocab-example { font-style: italic; color: var(--text-color); font-size: 0.95rem; line-height: 1.4; }
                .vocab-example-vi { color: var(--text-muted); font-size: 0.85rem; }

                .card-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 12px; border-top: 1px solid var(--card-border); }
                .level-badge { font-size: 0.8rem; font-weight: 800; padding: 5px 12px; border-radius: 12px; display: flex; align-items: center; gap: 6px; }
                .btn-play { width: 38px; height: 38px; border-radius: 12px; background: rgba(14, 165, 233, 0.1); color: var(--primary-color); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                .btn-play:hover { background: var(--primary-color); color: white; transform: scale(1.1); }

                #scroll-sentinel { height: 40px; margin-top: 10px; display: flex; justify-content: center; align-items: center; color: var(--text-muted); font-size: 0.9rem; font-weight: bold; }

                @media (min-width: 768px) {
                    .folder-grid { grid-template-columns: 1fr 1fr; gap: 20px; }
                    .detail-header { flex-direction: row; justify-content: space-between; align-items: center; }
                    .display-mode-select { width: 250px; margin-left: auto; }
                    #vocab-list { grid-template-columns: 1fr 1fr; gap: 20px; }
                }
            </style>

            <div class="library-container fade-in">
                <div class="library-topbar">
                    <input type="text" id="search-vocab" class="search-input" placeholder="🔍 Tìm kiếm từ vựng (Gõ để tìm)...">
                </div>

                <div id="category-view">
                    <div class="category-section">
                        <h2><i class="fa-solid fa-layer-group" style="color: var(--primary-color);"></i> Theo Cấp Độ (Levels)</h2>
                        <div class="folder-grid" id="level-folders"></div>
                    </div>
                    <div class="category-section">
                        <h2><i class="fa-solid fa-book-bookmark" style="color: var(--primary-color);"></i> Theo Chủ Đề (Topics)</h2>
                        <div class="folder-grid" id="topic-folders"></div>
                    </div>
                </div>

                <div id="detail-view">
                    <div class="detail-header">
                        <div class="detail-header-top">
                            <button class="btn-back" id="btn-back" title="Quay lại"><i class="fa-solid fa-arrow-left"></i></button>
                            <h2 class="detail-title" id="detail-title">Tiêu đề</h2>
                            <span class="detail-count-badge" id="detail-count">0 từ</span>
                        </div>
                        <select id="filter-display" class="display-mode-select">
                            <option value="hide_vi" selected>🙈 Chế độ: Che Nghĩa Việt</option>
                            <option value="hide_en">🙈 Chế độ: Che Từ Tiếng Anh</option>
                            <option value="show_all">👁️ Chế độ: Hiện Tất Cả</option>
                        </select>
                    </div>
                    <div id="vocab-list"></div>
                    <div id="scroll-sentinel"><i class="fa-solid fa-circle-notch fa-spin" style="margin-right: 8px;"></i> Đang tải...</div>
                </div>
            </div>
        `;
    },
    init: () => {
        const fullVocabList = DataManager.getVocabList();
        
        // Element Refs
        const searchInput = document.getElementById('search-vocab');
        const categoryView = document.getElementById('category-view');
        const detailView = document.getElementById('detail-view');
        const levelFoldersContainer = document.getElementById('level-folders');
        const topicFoldersContainer = document.getElementById('topic-folders');
        
        const vocabListContainer = document.getElementById('vocab-list');
        const displaySelect = document.getElementById('filter-display');
        const sentinel = document.getElementById('scroll-sentinel');
        const btnBack = document.getElementById('btn-back');
        const detailTitle = document.getElementById('detail-title');
        const detailCount = document.getElementById('detail-count');

        // Phân loại Logic
        const getLevel = (item) => {
            if (item.level !== undefined) return item.level;
            if (item.status === 'mastered') return 5;
            return 1;
        };

        const levelsData = { 1: [], 2: [], 3: [], 4: [], 5: [] };
        const topicsData = {};

        fullVocabList.forEach(item => {
            // Chia vào túi Cấp độ
            const lv = getLevel(item);
            if (levelsData[lv]) levelsData[lv].push(item);
            
            // Chia vào túi Chủ đề
            const topic = item.topic || 'General';
            if (!topicsData[topic]) topicsData[topic] = [];
            topicsData[topic].push(item);
        });

        // 1. RENDER MÀN HÌNH THƯ MỤC
        const renderFolders = () => {
            const levelNames = {
                1: { title: "Cấp 1 (Mới học / Sai nhiều)", icon: "fa-seedling", class: "ic-lv1" },
                2: { title: "Cấp 2 (Đang nhớ)", icon: "fa-leaf", class: "ic-lv2" },
                3: { title: "Cấp 3 (Khá tốt)", icon: "fa-fire", class: "ic-lv3" },
                4: { title: "Cấp 4 (Thành thạo)", icon: "fa-gem", class: "ic-lv4" },
                5: { title: "Cấp 5 (Master)", icon: "fa-crown", class: "ic-lv5" }
            };

            levelFoldersContainer.innerHTML = [1, 2, 3, 4, 5].map(lv => `
                <div class="folder-card" data-type="level" data-val="${lv}">
                    <div class="folder-info">
                        <div class="folder-icon ${levelNames[lv].class}"><i class="fa-solid ${levelNames[lv].icon}"></i></div>
                        <div>
                            <div class="folder-title">${levelNames[lv].title}</div>
                            <div class="folder-count">${levelsData[lv].length} từ vựng</div>
                        </div>
                    </div>
                    <i class="fa-solid fa-chevron-right folder-arrow"></i>
                </div>
            `).join('');

            topicFoldersContainer.innerHTML = Object.keys(topicsData).sort().map(topic => `
                <div class="folder-card" data-type="topic" data-val="${topic}">
                    <div class="folder-info">
                        <div class="folder-icon ic-topic"><i class="fa-solid fa-hashtag"></i></div>
                        <div>
                            <div class="folder-title">${topic}</div>
                            <div class="folder-count">${topicsData[topic].length} từ vựng</div>
                        </div>
                    </div>
                    <i class="fa-solid fa-chevron-right folder-arrow"></i>
                </div>
            `).join('');
        };
        renderFolders();

        // 2. LOGIC RENDER DANH SÁCH TỪ VỰNG CHI TIẾT (Infinite Scroll)
        let currentListData = [];
        let loadedCount = 0;
        const CHUNK_SIZE = 50;

        const renderChunk = () => {
            const chunk = currentListData.slice(loadedCount, loadedCount + CHUNK_SIZE);
            if (chunk.length === 0) return;

            const displayMode = displaySelect.value;
            const html = chunk.map(item => {
                const safeWord = item.word.replace(/'/g, "\\'");
                const wordClass = displayMode === 'hide_en' ? 'active-secret' : '';
                const meaningClass = displayMode === 'hide_vi' ? 'active-secret' : '';
                
                const level = getLevel(item);
                let badgeClass = ''; let badgeIcon = '';
                if(level===1) { badgeClass = 'lvl-1'; badgeIcon = '<i class="fa-solid fa-seedling"></i> Cấp 1';}
                if(level===2) { badgeClass = 'lvl-2'; badgeIcon = '<i class="fa-solid fa-leaf"></i> Cấp 2';}
                if(level===3) { badgeClass = 'lvl-3'; badgeIcon = '<i class="fa-solid fa-fire"></i> Cấp 3';}
                if(level===4) { badgeClass = 'lvl-4'; badgeIcon = '<i class="fa-solid fa-gem"></i> Cấp 4';}
                if(level===5) { badgeClass = 'lvl-5'; badgeIcon = '<i class="fa-solid fa-crown"></i> Master';}

                return `
                    <div class="vocab-card">
                        <div class="vocab-header">
                            <div class="secret-box ${wordClass}">
                                <span class="vocab-word">${item.word}</span>
                                <span class="vocab-type">${item.type}</span>
                            </div>
                        </div>
                        <div class="vocab-phonetic">${item.phonetic}</div>
                        
                        <div class="secret-box ${meaningClass}" style="margin-top: 10px;">
                            <div>
                                <div class="vocab-meaning">${item.meaning}</div>
                                ${item.example ? `
                                <div class="vocab-example">"${item.example}"</div>
                                <div class="vocab-example-vi">${item.example_vi}</div>
                                ` : ''}
                            </div>
                        </div>

                        <div class="card-actions">
                            <span class="level-badge ${badgeClass}">${badgeIcon}</span>
                            <button class="btn-play" data-word="${safeWord}">
                                <i class="fa-solid fa-volume-high"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            vocabListContainer.insertAdjacentHTML('beforeend', html);
            loadedCount += CHUNK_SIZE;

            sentinel.style.display = loadedCount >= currentListData.length ? 'none' : 'flex';
        };

        const openDetailView = (title, dataList) => {
            currentListData = dataList;
            loadedCount = 0;
            vocabListContainer.innerHTML = '';
            
            detailTitle.textContent = title;
            detailCount.textContent = `${dataList.length} từ`;
            
            categoryView.style.display = 'none';
            detailView.style.display = 'flex';
            
            if(dataList.length === 0) {
                vocabListContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 30px; font-weight: bold;">Không có từ vựng nào.</p>';
                sentinel.style.display = 'none';
            } else {
                renderChunk();
            }
        };

        // Bắt sự kiện Click vào các Thư mục
        document.querySelectorAll('.folder-card').forEach(card => {
            card.addEventListener('click', () => {
                const type = card.dataset.type;
                const val = card.dataset.val;
                if(type === 'level') {
                    openDetailView(`Cấp độ ${val}`, levelsData[val]);
                } else if(type === 'topic') {
                    openDetailView(`Chủ đề: ${val}`, topicsData[val]);
                }
            });
        });

        // Nút quay lại (Back)
        btnBack.addEventListener('click', () => {
            searchInput.value = ''; // Xóa input tìm kiếm
            detailView.style.display = 'none';
            categoryView.style.display = 'flex';
        });

        // Đổi chế độ che nghĩa -> Load lại danh sách
        displaySelect.addEventListener('change', () => {
            loadedCount = 0; 
            vocabListContainer.innerHTML = '';
            renderChunk();
        });

        // Click để Mở chữ bị che và Nghe phát âm
        vocabListContainer.addEventListener('click', (e) => {
            const playBtn = e.target.closest('.btn-play');
            if (playBtn) {
                const wordToSpeak = playBtn.getAttribute('data-word');
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const u = new SpeechSynthesisUtterance(wordToSpeak);
                    u.lang = 'en-US';
                    window.speechSynthesis.speak(u);
                }
                return;
            }
            const secretBox = e.target.closest('.active-secret');
            if (secretBox) secretBox.classList.remove('active-secret');
        });

        // Intersection Observer cho Cuộn vô tận
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && loadedCount < currentListData.length) {
                renderChunk();
            }
        }, { rootMargin: '200px' });
        observer.observe(sentinel);

        // 3. TÌM KIẾM TOÀN CẦU (Bung kết quả lập tức)
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            const term = e.target.value.toLowerCase().trim();
            
            if (term === '') {
                // Xóa chữ -> Trở về trang thư mục
                detailView.style.display = 'none';
                categoryView.style.display = 'flex';
                return;
            }

            debounceTimer = setTimeout(() => {
                const filtered = fullVocabList.filter(v => v.word.toLowerCase().includes(term) || v.meaning.toLowerCase().includes(term));
                openDetailView(`Kết quả cho: "${term}"`, filtered);
            }, 300);
        });
    }
};