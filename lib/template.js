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

template.render = function(template, content) {
  Object.keys(content).forEach(function(key) {
    var tag = new RegExp('\\$' + key + '\\$');
    content[key] = content[key].replace(/\$/g, "$$$");
    template = template.replace(tag, content[key]);
  });

  return template;
};
