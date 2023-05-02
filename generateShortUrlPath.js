const { randomBytes } = require('crypto');

// TODO: add collision handling
function generateShortUrlPath() {
  const randomBytesCount = 4;
  const buffer = randomBytes(randomBytesCount);
  return buffer.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

module.exports = generateShortUrlPath;