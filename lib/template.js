var fs = require('fs');
var logger = require('./logger');

var template = exports;

template.load = function(path) {
  try {
    path = fs.realpathSync(path);
    var template = fs.readFileSync(path, 'utf-8');
    return template;
  } catch (err) {
    logger.error('Template file not found or not readable: ' + path);
  }
};

template.render = function(template, contents) {
  Object.keys(contents).forEach(function(key) {
    var tag = new RegExp('\\$' + key + '\\$');

    function replacer() {
      return contents[key];
    }

    // In order to ignore special replacement patterns, the second
    // parameter of the replace() method is specified as a function.
    template = template.replace(tag, replacer);
  });

  return template;
};
