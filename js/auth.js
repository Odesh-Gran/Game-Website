// website/js/auth.js
import { apiRequest, showMessage } from './utils.js';
import { showAchievements } from './dashboard.js';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegisterLink');
    const showLoginLink = document.getElementById('showLoginLink');
    const navLoginBtn = document.getElementById('navLoginBtn');
    const authModal = document.getElementById('authModal');
    const modalClose = document.getElementById('modalClose');

    // Открыть модалку по кнопке "Войти" в навбаре
    navLoginBtn.addEventListener('click', function() {
        authModal.classList.add('active');
    });

    // Закрыть модалку
    modalClose.addEventListener('click', function() {
        authModal.classList.remove('active');
    });

    // Закрыть по клику вне модалки
    authModal.addEventListener('click', function(e) {
        if (e.target === authModal) {
            authModal.classList.remove('active');
        }
    });

    // Переключение: показать регистрацию
    showRegisterLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    // Переключение: показать вход
    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
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
                setTimeout(() => {
                    authModal.classList.remove('active');
                    document.getElementById('dashboard').style.display = 'block';
                    showAchievements();
                }, 600);
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
            registerForm.reset();
        } catch (err) {
            showMessage('❌ ' + err.message, 'error');
        }
    });
});