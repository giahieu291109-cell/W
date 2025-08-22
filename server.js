// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const filePath = path.join(__dirname, 'users.json');

app.use(cors()); // Cho phép tất cả các nguồn gốc truy cập
app.use(express.json()); // Cho phép server đọc dữ liệu JSON từ request

function readUsers(callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err && err.code === 'ENOENT') {
            return callback(null, []);
        }
        if (err) {
            return callback(err);
        }
        try {
            const users = JSON.parse(data);
            callback(null, users);
        } catch (e) {
            callback(e);
        }
    });
}

function writeUsers(users, callback) {
    fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8', (err) => {
        callback(err);
    });
}

app.get('/users', (req, res) => {
    readUsers((err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read users data' });
        }
        res.status(200).json(users);
    });
});

app.post('/update-user', (req, res) => {
    const updatedUser = req.body;
    readUsers((err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read users data' });
        }

        const userIndex = users.findIndex(u => u.name === updatedUser.name);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
        } else {
            users.push(updatedUser);
        }

        writeUsers(users, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to write users data' });
            }
            res.status(200).json({ message: 'User updated successfully' });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});