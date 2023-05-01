const express = require('express');
const { db } = require('../models');
const router = express.Router({ mergeParams: true });

// Get user exercise logs
router.get('/', (req, res) => {
    const { _id } = req.params;
    const { from, to, limit } = req.query;

    db.get('SELECT * FROM users WHERE id = ?', _id, (error, row) => {
        if (!row) {
            return res.status(404).json({error: 'User not found'});
        }

        let query = 'SELECT * FROM exercises WHERE userId = ?';
        let queryParams = [_id];

        // Set default from and to values if not provided
        if (!from) {
            db.get('SELECT MIN(date) as minDate FROM exercises WHERE userId = ?', _id, (error, row) => {
                if (!error && row && row.minDate) {
                    query += ' AND date >= ?';
                    queryParams.push(row.minDate);
                }
            });
        }
        if (!to) {
            db.get('SELECT MAX(date) as maxDate FROM exercises WHERE userId = ?', _id, (error, row) => {
                if (!error && row && row.maxDate) {
                    query += ' AND date <= ?';
                    queryParams.push(row.maxDate);
                }
            });
        }

        // Add date filters to the query if provided
        if (from) {
            query += ' AND date >= ?';
            queryParams.push(from);
        }
        if (to) {
            query += ' AND date <= ?';
            queryParams.push(to);
        }

        // Add order by date in descending order
        query += ' ORDER BY date ASC';

        // Execute the query to fetch exercises
        db.all(query, queryParams, (error, exercises) => {
            if (error) {
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Add limit to the query if provided
            if (limit) {
                exercises = exercises.slice(0, parseInt(limit));
            }

            // Build the response object
            const exerciseLogs = exercises.map(exercise => ({
                id: exercise.id,
                description: exercise.description,
                duration: exercise.duration,
                date: exercise.date,
            }));
            const response = {
                ...row,
                logs: exerciseLogs,
                count: exerciseLogs.length,
            };
            return res.status(200).json(response);
        });
    });
});

module.exports = router;
