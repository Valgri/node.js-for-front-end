const express = require('express');
const { db } = require('../models');
const router = express.Router();

// Create a new user
router.post('/', (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    db.run('INSERT INTO users (username) VALUES (?)', username, function (err) {
        if (err) {
            return res.status(400).json({ error: 'Username already taken' });
        }
        return res.status(200).json({ username, id: this.lastID });
    });
});

// Get all users
router.get('/', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            return res.status(400).json({ error: 'Error retrieving users' });
        }
        res.json(rows);
    });
});

module.exports = router;