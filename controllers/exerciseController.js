const express = require('express');
const { db } = require('../models');
const router = express.Router({ mergeParams: true });

// Add an exercise
router.post('/', (req, res) => {
    const { description, duration, date } = req.body;
    const userId = parseInt(req.params.userId);
    if (!description || !duration) {
        return res.status(400).json({ error: 'Description and duration are required' });
    }
    const parsedDuration = parseInt(duration);
    if (isNaN(parsedDuration)) {
        return res.status(400).json({ error: 'Duration should be a number' });
    }
    const parsedDate = date ? new Date(date) : new Date();
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Date format is invalid. Please use YYYY-MM-DD' });
    }
    db.get(
        "SELECT * FROM users WHERE id = ?",
        userId,
        function (err, row) {
            if (err) {
                return res.status(500).json({ error: "Error checking for user" });
            }
            if (!row) {
                return res.status(400).json({ error: "User not found" });
            }
            db.run(
                "INSERT INTO exercises (userId, description, duration, date) VALUES (?, ?, ?, ?)",
                userId,
                description,
                parsedDuration,
                parsedDate.toISOString().split("T")[0],
                function (err) {
                    if (err) {
                        return res.status(400).json({ error: "Error adding exercise" });
                    }
                    return res.json({
                        userId,
                        exerciseId: this.lastID,
                        description,
                        duration: parsedDuration,
                        date: parsedDate.toISOString().split("T")[0],
                    });
                }
            );
        }
    );
});

module.exports = router;
