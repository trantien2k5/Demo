import { vocabList as defaultVocab } from '../data/vocab.js';
import { sentenceList as defaultSentences } from '../data/sentences.js';

const STORAGE_KEY = 'smartVocabData';

export const DataManager = {
    getVocabList: () => {
        let savedData = [];
        try {
            const rawData = localStorage.getItem(STORAGE_KEY);
            if (rawData) {
                savedData = JSON.parse(rawData);
            }
        } catch (error) {
            console.error("Dữ liệu lỗi, khôi phục mặc định.", error);
            savedData = []; 
        }

        return defaultVocab.map(defaultItem => {
            const savedItem = savedData.find(item => item.word === defaultItem.word);
            if (savedItem) {
                return { ...defaultItem, status: savedItem.status, level: savedItem.level || 1 };
            }
            return { ...defaultItem, level: 1 };
        });
    },

    getSentenceList: () => {
        return defaultSentences; 
    },

    toggleVocabStatus: (word) => {
        let currentList = DataManager.getVocabList();
        const target = currentList.find(v => v.word === word);
        
        if (target) {
            target.status = target.status === 'learned' ? 'learning' : 'learned';
            target.level = target.status === 'learned' ? 5 : 1; 
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));
        }
    },

    updateVocabLevel: (word, isCorrect) => {
        let currentList = DataManager.getVocabList();
        const target = currentList.find(v => v.word === word);
        
        if (target) {
            if (!target.level) target.level = 1;

            if (isCorrect) {
                target.level = Math.min(5, target.level + 1);
            } else {
                target.level = 1;
            }

            target.status = target.level === 5 ? 'learned' : 'learning';
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));
        }
    },

    getStats: () => {
        const list = DataManager.getVocabList();
        const totalVocab = list.length;
        const learnedVocab = list.filter(v => v.status === 'learned' || v.level === 5).length;
        const totalSentence = defaultSentences.length;
        const progressPercent = totalVocab === 0 ? 0 : Math.round((learnedVocab / totalVocab) * 100);

        const levelCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        list.forEach(v => {
            const lvl = v.level || 1;
            if (lvl >= 1 && lvl <= 5) {
                levelCounts[lvl]++;
            }
        });

        return { totalVocab, learnedVocab, totalSentence, progressPercent, levelCounts };
    }
};