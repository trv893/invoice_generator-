var path = require('path');

module.exports = (function () {
  return path.dirname(require.main.filename || process.mainModule.filename);
})();

// Example of usage:
var root = require('root'); // In root will be absolute path to your application