var http = require('http');
var fs = require('fs');
var util = require("util");
var exec = require('child_process').exec;
var path = require('path');
var socketio = require('socket.io');
var send = require('send');
var watcher = require('./watcher');
var template = require('./template');
var browser = require('./browser');
var logger = require('./logger');

module.exports = kokoi;

function kokoi(conf) {
  var queue = [];
  var index;
  var layout;
  var socket;
  var resdir = __dirname + '/../res';
  var filedir = resdir;
  var address = 'localhost';
  conf.port = conf.port || 8333;
  conf.mathjax = conf.mathjax || false;
  conf.save = conf.save || false;
  conf.extensions = conf.extensions || 'md,markdown';
  conf.template = conf.template || resdir + '/template.html';

  if (!conf.command) {
    exec('pandoc -v', function(err) {
      if (!err) {
        conf.command = 'pandoc -f markdown -t html5' + (conf.mathjax ? ' --mathjax' : '');
        return;
      } else {
        exec('markdown -v', function(err) {
          if (!err) {
            conf.command = 'markdown';
            return;
          }
          logger.error('Install Pandoc, or provide a command to process markup files.');
        });
      }
    });
  }

  if (!conf.paths[0]) {
    conf.paths= [process.cwd()];
  } else {
    conf.paths.forEach(function(path, i) {
      try {
        conf.paths[i] = fs.realpathSync(path);
      } catch (err) {
        logger.error('File or directory not found: ' + path);
      }
    });
  }

  if (/^(?:[A-Za-z0-9]+(?:\,[A-Za-z0-9]+){0,})?$/.test(conf.extensions)) {
    conf.extensions = conf.extensions.replace(/,/g, '|');
    conf.extensions = new RegExp('\\.(' + conf.extensions + ')$', 'i');
  } else {
    logger.error('Bad extension list');
  }

  renderTemplate();
  serve();
  browser.open(address, conf.port);
  next();

  function renderTemplate() {
    var scripts = [];
    if (conf.mathjax) {
      scripts.push(fs.readFileSync(resdir + '/mathjax.html', 'utf-8'));
    }

    var templateContent = {
      scripts: scripts.join(''),
    };

    scripts.push(fs.readFileSync(resdir + '/socket.io.html', 'utf-8'));
    var indexContent = {
      title: 'kokoi',
      scripts: scripts.join(''),
      body: '<h1>kokoi</h1><p>Ready!</p>'
    };

    layout = template.load(conf.template);

    index = template.render(layout, indexContent);
    layout = template.render(layout, templateContent);
  }

  function serve() {
    var server = http.createServer(handler);
    var io = socketio.listen(server, { log: false });
    server.listen(conf.port);

    logger.info('Serving at ' + 'http://' + address + ':' + conf.port);

    io.enable('browser client minification');
    io.enable('browser client etag');
    io.enable('browser client gzip');
    io.sockets.on('connection', watch);

    process.on('SIGINT', function() {
      if (socket) {
        socket.disconnect();
      }
      server.close();
      process.exit();
    });
  }

  function handler(req, res) {
    if (req.url !== '/') {
      send(req, req.url)
       .root(filedir)
       .pipe(res);

      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(index, 'utf-8');
  }

  function watch(socket_) {
    socket = socket_;

    watcher(conf.paths, conf.extensions, function(filename) {
      if (queue.indexOf(filename) == -1) {
        queue.push(filename);
      }
    });
  }

  function next() {
    var filename = queue.shift();
    if (filename) {
      convert(filename);
    } else {
      setTimeout(function() {
        next();
      }, 50);
    }
  }

  function convert(filename) {
    logger.info('Processing ' + filename);

    exec(conf.command + ' "' + filename + '"', function(err, html, stderr) {
      if (err) {
        logger.error(err.message);
      } else if (stderr) {
        logger.warn(stderr);
      }

      filedir = path.dirname(filename);
      socket.emit('content', html);

      if (conf.save) {
        save(filename, html);
      }

      socket.on('next', function() {
        next();
      });
    });
  }

  function save(filename, html) {
    filename = filename.substr(0, filename.lastIndexOf('.'));

    var content = {
      title: path.basename(filename),
      body: html
    };
    var file = template.render(layout, content);

    fs.writeFile(filename + '.html', file, function(err) {
      if (err) {
        logger.error(err.message);
      }
    });
  }
}
