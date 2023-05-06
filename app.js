const https = require('https')
const app = require('express')();
const fs = require('fs');


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
		// Provide the private and public key to the server by reading each
		// file's content with the readFileSync() method.
    {
      key: fs.readFileSync("./.cert/key.pem"),
      cert: fs.readFileSync("./.cert/cert.pem"),
    },
    app
).listen(PORT, () => console.log(`Running at https://localhost:${PORT}`));

module.exports = app;