var fs = require('fs');
var path = require('path');
var logger = require('./logger');

module.exports = watcher;

function watcher(paths, extensions, callback) {
  var dirsToIgnore = /^(\.(git|hg|svn)|node_modules)$/;

  paths.forEach(function(path) {
    watchPath(path, true);
  });

  function watchPath(path_, includeIgnore) {
    fs.stat(path_, function(err, stats) {
      if (err) {
        logger.warn('Ignoring ' + path_);
      } else {
        if (stats.isDirectory()) {
          if (!dirsToIgnore.test(path.basename(path_))) {
            scanDir(path_);
          } else if (includeIgnore) {
            scanDir(path_);
          } else {
            logger.warn('Ignoring ' + path_);
          }
        } else {
          if (extensions.test(path.extname(path_))) {
            logger.info('Watching ' + path_ + ' for changes');
            fs.watch(path_, function(event) {
              if (event === 'change') {
                callback(path_);
              }
            });
          }
        }
      }
    });
  }

  function scanDir(path_) {
    fs.readdir(path_, function(err, files) {
      if (err) {
        logger.warn('Ignoring ' + path_);
      } else {
        files.forEach(function(filename) {
          watchPath(path_ + path.sep + filename, false);
        });
      }
    });
  }
}
