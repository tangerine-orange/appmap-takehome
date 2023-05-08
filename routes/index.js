const db = require('../db');
const router = require('express').Router();

require('./api.js')(router, db);

module.exports = router;