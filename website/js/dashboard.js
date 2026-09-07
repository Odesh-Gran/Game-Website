// website/js/dashboard.js
import { API_BASE_URL } from './config.js';
import { showMessage } from './utils.js';

const authBlock = document.getElementById('authBlock');
const achievementsBlock = document.getElementById('achievementsBlock');
const achievementsList = document.getElementById('achievementsList');
const playerName = document.getElementById('playerName');

// ==========================================
// 1. Проверяем, есть ли токен при загрузке
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('access_token');
    if (token) {
        showAchievements();
    } else {
        authBlock.style.display = 'block';
        achievementsBlock.style.display = 'none';
    }
});

// ==========================================
// 2. Функция загрузки достижений
// ==========================================
async function loadAchievements(token) {
    const response = await fetch(`${API_BASE_URL}/achievements`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Не удалось загрузить достижения');
    }

    return await response.json();
}

// ==========================================
// 3. Показать достижения
// ==========================================
export async function showAchievements() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        authBlock.style.display = 'block';
        achievementsBlock.style.display = 'none';
        return;
    }

    try {
        // Скрываем форму входа, показываем блок достижений
        authBlock.style.display = 'none';
        achievementsBlock.style.display = 'block';

        // Загружаем достижения
        const achievements = await loadAchievements(token);

        // Если список пуст
        if (!achievements || achievements.length === 0) {
            achievementsList.innerHTML = `
                <div style="text-align: center; color: #888; padding: 20px;">
                    😕 Пока нет достижений. Иди играй!
                </div>
            `;
            return;
        }

        // Рисуем каждое достижение
        let html = '';
        achievements.forEach(ach => {
            const date = new Date(ach.earned_at).toLocaleDateString('ru-RU');
            html += `
                <div class="achievement-item">
                    <strong>⭐ ${ach.name}</strong>
                    <span style="color: #888; font-size: 14px;">получено ${date}</span>
                    ${ach.description ? `<p style="font-size: 14px; color: #aaa; margin: 5px 0 0 0;">${ach.description}</p>` : ''}
                </div>
            `;
        });

        achievementsList.innerHTML = html;

    } catch (error) {
        console.error('Ошибка:', error);
        showMessage('❌ ' + error.message, 'error');
        // Если ошибка — возвращаем на форму входа
        localStorage.removeItem('access_token');
        authBlock.style.display = 'block';
        achievementsBlock.style.display = 'none';
    }
}

// ==========================================
// 4. Выход из аккаунта
// ==========================================
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('access_token');
    authBlock.style.display = 'block';
    achievementsBlock.style.display = 'none';
    document.getElementById('messageBox').textContent = '';
    document.getElementById('messageBox').className = '';
});