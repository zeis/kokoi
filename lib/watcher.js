var fs = require('fs');
var path = require('path');
var logger = require('./logger');

module.exports = watcher;

var dirsToIgnore = /^(\.(git|hg|svn)|node_modules|AppData)$/;

function watcher(paths, extensions, callback) {

  paths.forEach(function(path) {
    walk(path, true);
  });

  function watch(path_, includeIgnore) {
    fs.stat(path_, function(err, stats) {
      if (err) {
        logger.warn('Ignoring ' + path_);
      } else {
        if (stats.isDirectory()) {
          if (!dirsToIgnore.test(path.basename(path_))) {
            walk(path_);
          } else if (includeIgnore) {
            walk(path_);
          } else {
            logger.warn('Ignoring ' + path_);
          }
        } else {
          if (extensions.test(path.extname(path_))) {
            logger.info('Watching ' + path_);
            try {
              fs.watch(path_, function(event) {
                if (event === 'change') {
                  callback(path_);
                }
              });
            } catch (e) {
              logger.error(e.message);
            }
          }
        }
      }
    });
  }

  function walk(path_) {
    fs.readdir(path_, function(err, files) {
      if (err) {
        logger.warn('Ignoring ' + path_);
      } else {
        files.forEach(function(filename) {
          watch(path_ + path.sep + filename, false);
        });
      }
    });
  }
}
