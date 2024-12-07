async function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.text(); // Получаем сырой текст
        console.log(data); // Логируем ответ

        if (response.ok) {
            alert("Вы успешно вошли!");
            location.href = "index.html"; // Переход на главную страницу после успешного входа
        } else {
            alert(data.error || 'Ошибка при входе');
        }
    } catch (error) {
        console.error('Ошибка при входе:', error);
        alert('Произошла ошибка при входе');
    }
}

async function register() {
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const wishlist = document.getElementById('wishlist').value.trim();
    const giftLink = document.getElementById('gift-link').value.trim();

    if (!username || !password || !wishlist) {
        alert('Пожалуйста, заполните все обязательные поля.');
        return;
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, wishlist, giftLink }),
        });

        const data = await response.text(); // Получаем сырой текст
        console.log(data); // Логируем ответ

        if (response.ok) {
            alert("Регистрация успешна!");
            location.href = "login.html"; // Переход на страницу входа после успешной регистрации
        } else {
            alert(data.error || 'Произошла ошибка при регистрации');
        }
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        alert('Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.');
    }
}

function showParticipants() {
    document.getElementById("participants-section").classList.remove("hidden");
    document.getElementById("rules-section").classList.add("hidden");
}

function showRules() {
    document.getElementById("participants-section").classList.add("hidden");
    document.getElementById("rules-section").classList.remove("hidden");
}

function logout() {
    alert("Вы вышли из системы."); // Уведомление о выходе
    location.href = "login.html"; // Переход на страницу входа после выхода
}
