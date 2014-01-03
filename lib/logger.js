var util = require('util');

var logger = exports;

var colors = {
  red: 31,
  green: 32,
  yellow: 33,
};

logger.error = function(message) {
  util.error(encode('red', 'Error') + message);
  process.exit(1);
};

logger.warn = function(message) {
  util.puts(encode('yellow', 'Warn') + message);
};

logger.info = function(message) {
  util.puts(encode('green', 'Info') + message);
};

function encode(color, string) {
  var prefix = '\x1B[';
  return prefix + colors[color] + 'm' + string + prefix + '0m' + ' - ';
}
