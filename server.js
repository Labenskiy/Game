const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/register', async (req, res) => {
    console.log('Получен запрос на регистрацию:', req.body);
    const { username, password, wishlist, giftLink } = req.body;

    if (!username || !password || !wishlist) {
        return res.status(400).json({ error: 'Пожалуйста, заполните все обязательные поля' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userData = {
            username,
            password: hashedPassword,
            wishlist,
            giftLink: giftLink || ''
        };

        let participants = [];
        try {
            const data = await fs.readFile('participants.json', 'utf8');
            participants = JSON.parse(data);
        } catch (error) {
            console.log('Файл participants.json не найден или пуст, создаем новый массив');
        }

        participants.push(userData);

        await fs.writeFile('participants.json', JSON.stringify(participants, null, 2));
        console.log('Пользователь успешно зарегистрирован:', username);

        res.status(200).json({ message: 'Регистрация успешна' });
    } catch (error) {
        console.error('Подробная ошибка при регистрации:', error);
        res.status(500).json({ error: `Ошибка при регистрации: ${error.message}` });
    }
});

app.get('/participants', async (req, res) => {
    try {
        const data = await fs.readFile('participants.json', 'utf8');
        const participants = JSON.parse(data);
        const safeParticipants = participants.map(({ username, wishlist, giftLink }) => ({ username, wishlist, giftLink }));
        res.json(safeParticipants);
    } catch (error) {
        console.error('Ошибка при чтении данных:', error);
        res.status(500).json({ error: 'Ошибка при чтении данных' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});