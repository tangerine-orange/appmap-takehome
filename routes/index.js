const db = require('../db');
db.exec('CREATE TABLE IF NOT EXISTS urls (id INTEGER PRIMARY KEY AUTOINCREMENT, original TEXT, shortened TEXT)');

const router = require('express').Router();

require('./api.js')(router, db);
require('./web.js')(router, db);

module.exports = router;