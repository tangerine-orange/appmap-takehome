const app = require('express')();


let PORT;
if (process.env.NODE_ENV === 'test') {
    PORT = 8081;
} else {
    PORT = 8080;
}

const routing = require('./routes/index.js')
app.use('/', routing)

app.listen(
    PORT,
    () => console.log(`Running at http://localhost:${PORT}`)
);

module.exports = app;