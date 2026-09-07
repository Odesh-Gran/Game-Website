// website/js/auth.js
import { apiRequest, showMessage } from './utils.js';
import { showAchievements } from './dashboard.js';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showLink = document.getElementById('showRegisterLink');

    // Переключение между формами
    showLink.addEventListener('click', function(e) {
        e.preventDefault();
        const isHidden = registerForm.style.display === 'none';
        registerForm.style.display = isHidden ? 'block' : 'none';
        loginForm.style.display = isHidden ? 'none' : 'block';
        showLink.textContent = isHidden ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться';
        document.getElementById('messageBox').textContent = '';
    });

    // Логин
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            showMessage('⏳ Вход...', 'success');
            const data = await apiRequest('/login', 'POST', { username, password });
            if (data.access_token) {
                localStorage.setItem('access_token', data.access_token);
                showMessage('✅ Добро пожаловать!', 'success');
                // Вместо просто сообщения — показываем достижения!
                await showAchievements();
            }
        } catch (err) {
            showMessage('❌ ' + err.message, 'error');
        }
    });

    // Регистрация
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        try {
            showMessage('⏳ Создание...', 'success');
            await apiRequest('/register', 'POST', { username, email, password });
            showMessage('✅ Аккаунт создан! Войдите.', 'success');
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            showLink.textContent = 'Нет аккаунта? Зарегистрироваться';
            registerForm.reset();
        } catch (err) {
            showMessage('❌ ' + err.message, 'error');
        }
    });
});