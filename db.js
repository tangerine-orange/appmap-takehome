const sqlite = require('better-sqlite3');

let dbPath;
if (process.env.NODE_ENV === 'test') {
    // Use an in-memory database for testing
    dbPath = ':memory:';
} else {
    // Use the production database
    dbPath = './url_shortener.db';
}

const db = sqlite(dbPath, { verbose: console.log });
db.pragma('journal_mode = WAL');

module.exports = db;