import { DataManager } from '../services/storage.js';

export const LibraryTab = {
    render: () => {
        return `
            <div id="notebook-cover">
                <h2 style="color: var(--text-color); margin-bottom: 5px;">Sổ Tay Của Tôi 📓</h2>
                <p style="color: #888; font-size: 0.9rem; margin-bottom: 20px;">Quản lý dữ liệu học tập</p>

                <div class="notebook-grid">
                    <div class="notebook-folder" id="btn-open-vocab-topics">
                        <div class="folder-icon"><i class="fa-solid fa-spell-check"></i></div>
                        <div class="folder-info">
                            <h3>Từ vựng cốt lõi</h3>
                            <p id="summary-vocab">Đang tải...</p>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="margin-left:auto; color:#ccc;"></i>
                    </div>

                    <div class="notebook-folder" id="btn-open-sentences">
                        <div class="folder-icon" style="color: var(--success-color); background: #e8f8f5;"><i class="fa-solid fa-comments"></i></div>
                        <div class="folder-info">
                            <h3>Mẫu câu giao tiếp</h3>
                            <p id="summary-sentence">Đang tải...</p>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="margin-left:auto; color:#ccc;"></i>
                    </div>
                </div>

                <h3 style="margin-top: 25px; margin-bottom: 15px; font-size: 1.1rem; color: var(--text-color);">Phân bố Cấp độ (Spaced Repetition)</h3>
                <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 20px;">
                    <div style="text-align: center; background: #f8f9fa; padding: 10px 5px; border-radius: 8px; border-bottom: 3px solid #ccc;">
                        <div style="font-size: 0.75rem; color: #888; font-weight: bold;">Cấp 1</div>
                        <strong id="stat-lvl-1" style="font-size: 1.1rem; color: var(--text-color);">0</strong>
                    </div>
                    <div style="text-align: center; background: #f8f9fa; padding: 10px 5px; border-radius: 8px; border-bottom: 3px solid #ffc107;">
                        <div style="font-size: 0.75rem; color: #888; font-weight: bold;">Cấp 2</div>
                        <strong id="stat-lvl-2" style="font-size: 1.1rem; color: var(--text-color);">0</strong>
                    </div>
                    <div style="text-align: center; background: #f8f9fa; padding: 10px 5px; border-radius: 8px; border-bottom: 3px solid #fd7e14;">
                        <div style="font-size: 0.75rem; color: #888; font-weight: bold;">Cấp 3</div>
                        <strong id="stat-lvl-3" style="font-size: 1.1rem; color: var(--text-color);">0</strong>
                    </div>
                    <div style="text-align: center; background: #f8f9fa; padding: 10px 5px; border-radius: 8px; border-bottom: 3px solid var(--primary-color);">
                        <div style="font-size: 0.75rem; color: #888; font-weight: bold;">Cấp 4</div>
                        <strong id="stat-lvl-4" style="font-size: 1.1rem; color: var(--text-color);">0</strong>
                    </div>
                    <div style="text-align: center; background: #f8f9fa; padding: 10px 5px; border-radius: 8px; border-bottom: 3px solid var(--success-color);">
                        <div style="font-size: 0.75rem; color: #888; font-weight: bold;">Cấp 5</div>
                        <strong id="stat-lvl-5" style="font-size: 1.1rem; color: var(--success-color);">0</strong>
                    </div>
                </div>
            </div>

            <div id="notebook-topics" class="hidden">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                    <button id="btn-back-to-cover" class="back-btn" style="margin:0;"><i class="fa-solid fa-arrow-left"></i></button>
                    <h2 style="margin:0; font-size: 1.2rem;">Chủ đề Từ vựng</h2>
                </div>
                <div class="notebook-grid" id="topic-list-container"></div>
            </div>

            <div id="notebook-detail" class="hidden">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                    <button id="btn-back-to-previous" class="back-btn" style="margin:0;"><i class="fa-solid fa-arrow-left"></i></button>
                    <h2 id="detail-title" style="margin:0; font-size: 1.2rem;">Chi tiết</h2>
                </div>

                <div class="search-container">
                    <i class="fa-solid fa-magnifying-glass search-icon"></i>
                    <input type="text" id="search-library" class="search-input" placeholder="Tìm kiếm...">
                </div>

                <div class="filter-container" id="library-filters" style="margin-bottom: 15px;">
                    <button class="filter-chip active" data-filter="all">Tất cả</button>
                    <button class="filter-chip" data-filter="learning">Đang học</button>
                    <button class="filter-chip" data-filter="learned">Đã thuộc</button>
                </div>

                <div id="library-list-container" style="padding-bottom: 80px;"></div>
            </div>
        `;
    },

    init: () => {
        const coverArea = document.getElementById('notebook-cover');
        const topicsArea = document.getElementById('notebook-topics');
        const detailArea = document.getElementById('notebook-detail');
        
        const btnOpenVocab = document.getElementById('btn-open-vocab-topics');
        const btnOpenSentence = document.getElementById('btn-open-sentences');
        const btnBackToCover = document.getElementById('btn-back-to-cover');
        const btnBackToPrev = document.getElementById('btn-back-to-previous');
        
        const searchInput = document.getElementById('search-library');
        const statusChips = document.querySelectorAll('#library-filters .filter-chip');
        const listContainer = document.getElementById('library-list-container');
        const detailTitle = document.getElementById('detail-title');
        const libraryFilters = document.getElementById('library-filters');

        let currentDataType = 'vocab'; 
        let currentTopic = 'all'; 
        let currentSearchTerm = '';
        let currentStatusFilter = 'all';

        function updateStats() {
            const stats = DataManager.getStats();
            document.getElementById('summary-vocab').textContent = `${stats.totalVocab} từ (${stats.learnedVocab} đã thuộc)`;
            document.getElementById('summary-sentence').textContent = `${stats.totalSentence} câu`;
            
            for (let i = 1; i <= 5; i++) {
                const el = document.getElementById(`stat-lvl-${i}`);
                if (el) el.textContent = stats.levelCounts[i];
            }
        }

        updateStats();

        function renderTopics() {
            const stats = DataManager.getStats();
            const vocabList = DataManager.getVocabList();
            const uniqueTopics = [...new Set(vocabList.map(v => v.topic).filter(Boolean))];
            let html = `
                <div class="notebook-folder topic-item" data-topic="all">
                    <div class="folder-icon" style="background: #e0f7fa; color: #00acc1;"><i class="fa-solid fa-book-open"></i></div>
                    <div class="folder-info">
                        <h3>Tất cả từ vựng</h3>
                        <p>${stats.totalVocab} từ</p>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="margin-left:auto; color:#ccc;"></i>
                </div>
            `;
            
            uniqueTopics.forEach(topic => {
                const count = vocabList.filter(v => v.topic === topic).length;
                html += `
                    <div class="notebook-folder topic-item" data-topic="${topic}">
                        <div class="folder-icon"><i class="fa-solid fa-folder"></i></div>
                        <div class="folder-info">
                            <h3>${topic}</h3>
                            <p>${count} từ</p>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="margin-left:auto; color:#ccc;"></i>
                    </div>
                `;
            });
            
            document.getElementById('topic-list-container').innerHTML = html;

            document.querySelectorAll('.topic-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    currentTopic = e.currentTarget.getAttribute('data-topic');
                    openDetailView('vocab', currentTopic);
                });
            });
        }

        btnOpenVocab.addEventListener('click', () => {
            renderTopics();
            coverArea.classList.add('hidden');
            topicsArea.classList.remove('hidden');
        });

        btnOpenSentence.addEventListener('click', () => {
            openDetailView('sentence', 'all');
        });

        btnBackToCover.addEventListener('click', () => {
            topicsArea.classList.add('hidden');
            coverArea.classList.remove('hidden');
        });

        btnBackToPrev.addEventListener('click', () => {
            detailArea.classList.add('hidden');
            listContainer.innerHTML = ''; 
            if (currentDataType === 'vocab') {
                topicsArea.classList.remove('hidden'); 
            } else {
                coverArea.classList.remove('hidden');  
            }
        });

        function openDetailView(type, topic) {
            currentDataType = type;
            currentTopic = topic;
            
            currentSearchTerm = '';
            currentStatusFilter = 'all';
            searchInput.value = '';
            statusChips.forEach(c => c.classList.remove('active'));
            statusChips[0].classList.add('active');

            if (type === 'vocab') {
                detailTitle.textContent = topic === 'all' ? 'Tất cả từ vựng' : `Chủ đề: ${topic}`;
                libraryFilters.classList.remove('hidden');
            } else {
                detailTitle.textContent = 'Mẫu câu giao tiếp';
                libraryFilters.classList.add('hidden');
            }

            coverArea.classList.add('hidden');
            topicsArea.classList.add('hidden');
            detailArea.classList.remove('hidden');

            renderList();
        }

        function speakText(text) {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'en-US'; 
                utterance.rate = 0.9;     
                window.speechSynthesis.speak(utterance);
            }
        }

        function renderList() {
            let dataSource = currentDataType === 'vocab' ? DataManager.getVocabList() : DataManager.getSentenceList();
            
            let filteredList = dataSource.filter(item => {
                const keyword1 = currentDataType === 'vocab' ? item.word.toLowerCase() : item.en.toLowerCase();
                const keyword2 = currentDataType === 'vocab' ? item.meaning.toLowerCase() : item.vi.toLowerCase();
                
                const matchSearch = keyword1.includes(currentSearchTerm) || keyword2.includes(currentSearchTerm);
                const matchStatus = currentDataType !== 'vocab' || currentStatusFilter === 'all' || item.status === currentStatusFilter;
                const matchTopic = currentDataType !== 'vocab' || currentTopic === 'all' || item.topic === currentTopic;
                
                return matchSearch && matchStatus && matchTopic;
            });

            const isLimited = filteredList.length > 50;
            if (isLimited && currentSearchTerm === '') {
                filteredList = filteredList.slice(0, 50); 
            }

            if (filteredList.length === 0) {
                listContainer.innerHTML = `<p style="text-align: center; color: #888; padding: 40px 0;">Không có dữ liệu.</p>`;
                return;
            }

            let htmlContent = filteredList.map(item => {
                const title = currentDataType === 'vocab' ? item.word : item.en;
                const sub = currentDataType === 'vocab' ? item.meaning : item.vi;
                const statusClass = item.status ? item.status : '';
                
                const toggleBtnHtml = currentDataType === 'vocab' ? `
                    <button class="icon-action-btn toggle-status-btn" data-word="${title}" style="color: ${item.status === 'learned' ? 'var(--success-color)' : '#888'};">
                        <i class="fa-solid fa-circle-check"></i>
                    </button>
                ` : '';

                const typeHtml = (currentDataType === 'vocab' && item.type) ? `<span class="vocab-type">${item.type}</span>` : '';
                const phoneticHtml = (currentDataType === 'vocab' && item.phonetic) ? `<span class="vocab-phonetic">${item.phonetic}</span>` : '';
                
                let levelHtml = '';
                if (currentDataType === 'vocab') {
                    const lvl = item.level || 1;
                    const color = lvl === 5 ? 'var(--success-color)' : 'var(--primary-color)';
                    levelHtml = `
                        <div style="display: flex; gap: 3px; margin-top: 8px; align-items: center;">
                            <span style="font-size: 0.75rem; color: #888; margin-right: 5px;">Cấp ${lvl}</span>
                            <div style="width: 15px; height: 5px; border-radius: 3px; background: ${lvl >= 1 ? color : '#eee'};"></div>
                            <div style="width: 15px; height: 5px; border-radius: 3px; background: ${lvl >= 2 ? color : '#eee'};"></div>
                            <div style="width: 15px; height: 5px; border-radius: 3px; background: ${lvl >= 3 ? color : '#eee'};"></div>
                            <div style="width: 15px; height: 5px; border-radius: 3px; background: ${lvl >= 4 ? color : '#eee'};"></div>
                            <div style="width: 15px; height: 5px; border-radius: 3px; background: ${lvl >= 5 ? 'var(--success-color)' : '#eee'};"></div>
                        </div>
                    `;
                }

                let detailsHtml = '';
                let expandIndicator = '';
                
                if (currentDataType === 'vocab' && item.example) {
                    expandIndicator = `<div class="expand-indicator"><i class="fa-solid fa-chevron-down"></i></div>`;
                    detailsHtml = `
                        <div class="vocab-details">
                            <div class="vocab-example">"${item.example}"</div>
                            <div class="vocab-example-vi">${item.example_vi || ''}</div>
                        </div>
                    `;
                }

                return `
                <div class="vocab-card ${statusClass}" style="padding: 12px 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
                        <div class="vocab-info" style="padding-right: 10px; flex: 1;">
                            <div class="vocab-header-info">
                                <span class="vocab-word">${title}</span>
                                ${typeHtml}
                                ${phoneticHtml}
                            </div>
                            <p style="font-size: 0.95rem; color: #444;">${sub}</p>
                            ${levelHtml}
                        </div>
                        <div class="vocab-actions" style="display: flex; gap: 8px; align-items: center; flex-shrink: 0;">
                            ${toggleBtnHtml}
                            <button class="icon-action-btn speak-btn" data-text="${title}">
                                <i class="fa-solid fa-volume-high"></i>
                            </button>
                        </div>
                    </div>
                    ${detailsHtml}
                    ${expandIndicator}
                </div>
                `;
            }).join('');

            if (isLimited && currentSearchTerm === '') {
                htmlContent += `<p style="text-align: center; color: #888; padding: 15px; font-size: 0.85rem;">Đang hiển thị 50 dòng đầu tiên.</p>`;
            }

            listContainer.innerHTML = htmlContent;

            listContainer.querySelectorAll('.vocab-card').forEach(card => {
                card.addEventListener('click', function(e) {
                    if (e.target.closest('.vocab-actions')) return; 
                    const details = this.querySelector('.vocab-details');
                    if (details) {
                        details.classList.toggle('expanded');
                        this.classList.toggle('expanded');
                    }
                });
            });

            listContainer.querySelectorAll('.speak-btn').forEach(btn => {
                btn.addEventListener('click', (e) => speakText(e.currentTarget.getAttribute('data-text')));
            });

            listContainer.querySelectorAll('.toggle-status-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const word = e.currentTarget.getAttribute('data-word');
                    DataManager.toggleVocabStatus(word); 
                    updateStats();
                    renderList(); 
                });
            });
        }

        let timeoutId;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                currentSearchTerm = e.target.value.toLowerCase().trim();
                renderList();
            }, 300);
        });

        statusChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                statusChips.forEach(c => c.classList.remove('active'));
                e.currentTarget.classList.add('active');
                currentStatusFilter = e.currentTarget.getAttribute('data-filter');
                renderList();
            });
        });
    }
};