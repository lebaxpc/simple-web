const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Kết nối SQLite
const db = new sqlite3.Database('users.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to SQLite database.');
});

// Tạo bảng users với cột email
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
)`);

// Đăng ký
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }
    try {
        // TODO
        // const hashedPassword = await bcrypt.hash(password, 10);
        //
        const hashedPassword = password;
        //
        db.run(`INSERT INTO users (email, password) VALUES (?, ?)`,
            [email, hashedPassword],
            function (err) {
                if (err) {
                    return res.status(400).json({ message: 'Email already exists' });
                }
                res.status(201).json({ message: 'Registration successful' });
            });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Đăng nhập
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // TODO
        // const isMatch = await bcrypt.compare(password, user.password);
        //
        const isMatch = (password == user.password) ? true : false;
        //
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        res.status(200).json({ message: 'Login successful' });
    });
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});