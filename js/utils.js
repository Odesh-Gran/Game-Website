// website/js/utils.js
import { API_BASE_URL } from './config.js';

// Показывает сообщения пользователю (красное или зеленое)
export function showMessage(text, type = 'error') {
    const box = document.getElementById('messageBox');
    box.textContent = text;
    box.className = type;
    box.style.display = 'block';
}

// Универсальный запрос к API
export async function apiRequest(endpoint, method = 'GET', body = null) {
    const options = {
        method: method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка сервера');
    }
    return await response.json();
}