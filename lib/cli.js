var util = require('util');
var version = require('../package.json').version;

exports.parse = parse;

function parse(args) {
  args = args.slice(2);

  var conf = {
    paths : []
  };

  while ((arg = args.shift())) {
    if (/^(?:-h|--help)$/.test(arg)) {
      help();
      process.exit();
    } else if (/^(?:-v|--version)$/.test(arg)) {
      print('kokoi ' + version);
      process.exit();
    } else if (/^(?:-p|--port)$/.test(arg)) {
      conf.port = args.shift();
    } else if (/^(?:-c|--command)$/.test(arg)) {
      conf.command = args.shift();
    } else if (/^(?:-s|--save)$/.test(arg)) {
      conf.save = true;
    } else if (/^(?:-m|--mathjax)$/.test(arg)) {
      conf.mathjax = true;
    } else if (/^(?:-e|--extensions)$/.test(arg)) {
      conf.extensions = args.shift();
    } else if (/^(?:-t|--template)$/.test(arg)) {
      conf.template = args.shift();
    } else {
      conf.paths.push(arg);
    }
  }

  return conf;
}

function help() {
  print
    ('')
    ('USAGE')
    ('')
    ('    kokoi [options] [files or dirs]')
    ('')
    ('  Examples:')
    ('    kokoi -c "redcarpet --smarty" -s "My Notes" Dir2 test/Foo.md')
    ('    kokoi -e rst -c "pandoc -f rst -t html5" foo.rst')
    ('')
    ('  If no file or directory is specified, the current directory (.)')
    ('  is assumed. Directories are scanned recursively.')
    ('  Subdirectories whose name is "node_modules" or "AppData" or starts')
    ('  with a dot (.git, .hg...) are ignored.')
    ('')
    ('OPTIONS')
    ('')
    ('  -p, --port')
    ('      TCP port at which the HTML files will be served.')
    ('      Default is 8333.')
    ('')
    ('  -c, --command')
    ('      Command to convert markup files to HTML.')
    ('      Default is "pandoc -f markdown -t -html5".')
    ('')
    ('  -s, --save')
    ('      Save the rendered HTML. The output directory for each HTML')
    ('      file is the same of the corresponding markup file.')
    ('')
    ('  -m, --mathjax')
    ('      Insert a link to the MathJax CDN to render math formulas.')
    ('      If the processing engine does not support math formulas')
    ('      do not use this option.')
    ('')
    ('  -e, --extensions')
    ('      Comma-delimited list of extensions of the files to watch')
    ('      for changes, excluding the dots and without spaces.')
    ('      Default is "md,markdown".')
    ('')
    ('  -t, --template')
    ('      Path to your custom HTML template file. See README.md for')
    ('      more information.')
    ('')
    ('  -v, --version')
    ('      Show version.')
    ('')
    ('  -h, --help')
    ('      Show this help message.')
    ('');
}

function print(line) {
  util.puts(line);
  return print;
}
