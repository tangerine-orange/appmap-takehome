const https = require('https')
const app = require('express')();
const fs = require('fs');
const initializeDb = require('./scripts/initializeDb.js');

initializeDb();

let PORT;
if (process.env.NODE_ENV === 'test') {
    PORT = 8081;
} else {
    PORT = 8080;
}

const routing = require('./routes/index.js')
app.use('/', routing)


https
  .createServer(
    {
      key: fs.readFileSync("./.cert/key.pem"),
      cert: fs.readFileSync("./.cert/cert.pem"),
    },
    app
).listen(PORT, () => console.log(`Running at https://localhost:${PORT}`));

module.exports = app;