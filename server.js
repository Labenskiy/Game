const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Статические файлы

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/register', async (req, res) => {
    const { username, password, wishlist, giftLink } = req.body;

    if (!username || !password || !wishlist) {
        return res.status(400).json({ error: 'Пожалуйста, заполните все обязательные поля' });
    }

    try {
        let participants = [];
        try {
            const data = await fs.readFile('participants.json', 'utf8');
            participants = JSON.parse(data);
        } catch (error) {
            console.log('Файл participants.json не найден или пуст.');
        }

        if (participants.some(user => user.username === username)) {
            return res.status(400).json({ error: 'Пользователь с таким именем уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = { username, password: hashedPassword, wishlist, giftLink };

        participants.push(userData);
        await fs.writeFile('participants.json', JSON.stringify(participants, null, 2));

        res.status(200).json({ message: 'Регистрация успешна' });
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        res.status(500).json({ error: 'Ошибка сервера при регистрации' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const data = await fs.readFile('participants.json', 'utf8');
        const participants = JSON.parse(data);
        const user = participants.find(p => p.username === username);

        if (user && await bcrypt.compare(password, user.password)) {
            res.json({ message: 'Вход выполнен успешно' });
        } else {
            res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
        }
    } catch (error) {
        console.error('Ошибка при входе:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.get('/participants', async (req, res) => {
    try {
        const data = await fs.readFile('participants.json', 'utf8');
        const participants = JSON.parse(data);
        const safeParticipants = participants.map(({ username, wishlist }) => ({ username, wishlist }));
        res.json(safeParticipants);
    } catch (error) {
        console.error('Ошибка при чтении данных:', error);
        res.status(500).json({ error: 'Ошибка при чтении данных' });
    }
});

app.post('/generate-santa-pairs', async (req, res) => {
    try {
        const data = await fs.readFile('participants.json', 'utf8');
        const participants = JSON.parse(data);

        // Перемешивание участников
        const shuffled = [...participants].sort(() => Math.random() - 0.5);

        // Генерация пар
        const pairs = shuffled.map((santa, index) => ({
            santa: santa.username,
            recipient: shuffled[(index + 1) % shuffled.length].username
        }));

        await fs.writeFile('santa_assignments.json', JSON.stringify(pairs, null, 2));

        res.json({ message: 'Пары Тайного Санты сгенерированы' });
    } catch (error) {
        console.error('Ошибка при генерации пар:', error);
        res.status(500).json({ error: 'Ошибка при генерации пар' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
