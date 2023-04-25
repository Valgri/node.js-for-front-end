const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const createTables = () => {
    db.serialize(() => {
        db.run(
            'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE)'
        );
        db.run(
            'CREATE TABLE IF NOT EXISTS exercises (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, description TEXT NOT NULL, duration INTEGER NOT NULL, date DATE NOT NULL)'
        );
    });
};

module.exports = { db, createTables };