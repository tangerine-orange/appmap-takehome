// "https://appmap-takehome.herokuapp.com/"

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
      "/api",
      createProxyMiddleware({
        target: "https://appmap-takehome.herokuapp.com/",
        changeOrigin: true,
      })
    );
  };