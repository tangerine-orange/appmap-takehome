const db = require('../db');

module.exports = () => {
    db.exec('CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY AUTOINCREMENT, original TEXT, shortened TEXT, readPassword TEXT, writePassword TEXT)');
    db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_shortened ON urls (shortened)');
};
