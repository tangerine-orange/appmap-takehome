const https = require('https')
const app = require('express')();
const fs = require('fs');
const initializeDb = require('./scripts/initializeDb.js');
var bodyParser = require('body-parser')

initializeDb();

let PORT;
if (process.env.NODE_ENV === 'test') {
    PORT = 8081;
} else {
    PORT = 8080;
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const routing = require('./routes/index.js')
app.use('/', routing)

// https
//   .createServer(
//     {
//       key: fs.readFileSync("./.cert/key.pem"),
//       cert: fs.readFileSync("./.cert/cert.pem"),
//     },
//     app
// ).listen(PORT, () => console.log(`Running at https://localhost:${PORT}`));

app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));

module.exports = app;