const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to database
const dbPath = path.resolve(__dirname, 'community_health.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Initialize Schema
db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        phone_number TEXT PRIMARY KEY,
        name TEXT,
        age INTEGER,
        gender TEXT,
        marital_status TEXT,
        children_count INTEGER,
        pincode TEXT,
        vaccination_card TEXT,
        registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Health Logs (Symptoms/Queries)
    db.run(`CREATE TABLE IF NOT EXISTS health_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone_number TEXT,
        query TEXT,
        ai_response TEXT,
        is_severe INTEGER DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(phone_number) REFERENCES users(phone_number)
    )`);

    // Escalations (For Admin/ASHA)
    db.run(`CREATE TABLE IF NOT EXISTS escalations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone_number TEXT,
        severity_level TEXT,
        status TEXT DEFAULT 'PENDING', -- PENDING, ASSIGNED, RESOLVED
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(phone_number) REFERENCES users(phone_number)
    )`);
});

module.exports = db;
