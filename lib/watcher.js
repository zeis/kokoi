var fs = require('fs');
var path = require('path');
var logger = require('./logger');

module.exports = watcher;

var dirsToIgnore = /^(?:(?:node_modules|AppData)$|\.)/;

function watcher(paths, extensions, callback) {

  paths.forEach(function(path) {
    walk(path, true);
  });

  function watch(path_, isParentDir) {
    fs.stat(path_, function(err, stats) {
      if (!err) {
        if (stats.isDirectory()) {
          if (!dirsToIgnore.test(path.basename(path_))) {
            walk(path_);
          } else if (isParentDir) {
            walk(path_);
          }
        } else if (extensions.test(path.extname(path_))) {
          try {
            fs.watchFile(path_, { persistent: true, interval: 100 }, function(curr, prev) {
              if (curr.nlink && (curr.mtime.getTime() != prev.mtime.getTime())) {
                callback(path_);
              }
            });
            logger.info('Watching ' + path_);
          } catch (e) {
            logger.error(e.message);
          }
        }
      }
    });
  }

  function walk(path_) {
    fs.readdir(path_, function(err, files) {
      if (!err) {
        files.forEach(function(filename) {
          watch(path_ + path.sep + filename, false);
        });
      }
    });
  }
}
