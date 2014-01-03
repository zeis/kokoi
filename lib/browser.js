var exec = require('child_process').exec;
var logger = require('./logger');

exports.open = open;

function open(address, port) {
  var platform = process.platform;
  var command;

  if (platform === 'win32') {
    command = 'cmd /c start';
  } else if (platform === 'darwin') {
    command = 'open -g';
  } else if (platform === 'linux' || platform === 'freebsd') {
    command = 'xdg-open';
  } else {
    logger.error('OS not supported');
  }

  exec(command + ' http://' + address + ':' + port, function(err) {
    if (err) {
      logger.error(err.message);
    }
  });
}
