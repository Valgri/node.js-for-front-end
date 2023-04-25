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

        // Add date filters to the query if provided
        if (from) {
            query += ' AND date >= ?';
            queryParams.push(from);
        }
        if (to) {
            query += ' AND date <= ?';
            queryParams.push(to);
        }

        // Count total exercises
        db.get(`SELECT COUNT(*) as count FROM (${query})`, queryParams, (error, countRow) => {
            const totalExercises = countRow.count;

            // Add limit to the query if provided
            if (limit) {
                query += ' LIMIT ?';
                queryParams.push(parseInt(limit));
            }

            // Execute the query to fetch exercises
            db.all(query, queryParams, (error, exercises) => {
                if (error) {
                    return res.status(500).json({ error: 'Internal server error' });
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
                    count: totalExercises,
                };
                return res.status(200).json(response);
            });
        });
    });
});

module.exports = router;
