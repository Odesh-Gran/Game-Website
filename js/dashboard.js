// website/js/dashboard.js
import { API_BASE_URL } from './config.js';
import { showMessage } from './utils.js';

const authModal = document.getElementById('authModal');
const dashboard = document.getElementById('dashboard');
const achievementsList = document.getElementById('achievementsList');

// При загрузке — проверить токен
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('access_token');
    if (token) {
        dashboard.style.display = 'block';
        showAchievements();
    }
});

async function loadAchievements(token) {
    const response = await fetch(`${API_BASE_URL}/achievements`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Не удалось загрузить достижения');
    return await response.json();
}

export async function showAchievements() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        dashboard.style.display = 'none';
        return;
    }

    dashboard.style.display = 'block';

    try {
        const achievements = await loadAchievements(token);

        if (!achievements || achievements.length === 0) {
            achievementsList.innerHTML = `
                <div style="text-align: center; color: #888; padding: 20px;">
                    😕 Пока нет достижений. Иди играй!
                </div>`;
            return;
        }

        let html = '';
        achievements.forEach(ach => {
            const date = new Date(ach.earned_at).toLocaleDateString('ru-RU');
            html += `
                <div class="achievement-item">
                    <strong>⭐ ${ach.name}</strong>
                    <span style="color: #888; font-size: 14px;">получено ${date}</span>
                    ${ach.description ? `<p style="font-size: 14px; color: #aaa; margin: 5px 0 0 0;">${ach.description}</p>` : ''}
                </div>`;
        });

        achievementsList.innerHTML = html;

    } catch (error) {
        console.error('Ошибка:', error);
        showMessage('❌ ' + error.message, 'error');
        localStorage.removeItem('access_token');
        dashboard.style.display = 'none';
    }
}

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('access_token');
    dashboard.style.display = 'none';
    document.getElementById('messageBox').textContent = '';
    document.getElementById('messageBox').className = '';
});