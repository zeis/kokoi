# kokoi [![NPM version](https://badge.fury.io/js/kokoi.png)](http://badge.fury.io/js/kokoi)

_kokoi_ watches for changes on the markup files (Markdown, Textile, reStructuredText...) in the directory _kokoi_ is started, and if they change, automatically reprocesses and previews them directly in the browser. You will work on your files without having to leave your favorite text editor!

The rendered HTML is optionally saved. _kokoi_ is the perfect tool for those who like to keep notes in markup-formatted files and who are always editing them.

You can also pass, as arguments, multiple markup files, or directories, which will be scanned recursively.

Additional features are, configurable command to process markup files, support for math formulas (rendered with MathJax), and support for custom HTML templates.

## Installation

* Install [Node.js](http://www.nodejs.org/).

* Install a markup processing engine such as [Pandoc](http://johnmacfarlane.net/pandoc/). By default _kokoi_ is configured to watch for changes on Markdown files, and uses _pandoc_ to convert them, if _pandoc_ is not installed _kokoi_ will try to use the fallback command `markdown`. If you want to use a different engine, the appropriate command to convert markup files to HTML must be specified (see Usage).

* Then, run `npm install kokoi -g` in a terminal.

__On Linux__, make sure that also _npm_ is installed, and note that the preceding command must be run as root.
Moreover, if you installed Node.js from a package manager, the Node.js binary may be called _nodejs_ instead of _node_, run this command as root `ln -s /usr/bin/nodejs /usr/bin/node` to create a symlink.

## Usage

```
USAGE

  kokoi [options] [files or dirs]

  Examples:

    kokoi -c "redcarpet --smarty" -s "My Notes" Dir2 test/Foo.md
    kokoi -e rst -c "pandoc -f rst -t html5" foo.rst

  If no file or directory is specified, the current directory (.)
  is assumed. Directories are scanned recursively.
  Subdirectories whose name is "node_modules" or "AppData" or starts
  with a dot (.git, .hg...) are ignored.


OPTIONS

  -p, --port
      TCP port at which the HTML files will be served.
      Default is 8333.

  -c, --command
      Command to convert markup files to HTML.
      Default is "pandoc -f markdown -t -html5".

  -s, --save
      Save the rendered HTML. The output directory for each HTML
      file is the same of the corresponding markup file.

  -m, --mathjax
      Insert a link to the MathJax CDN to render math formulas.
      If the processing engine does not support math formulas
      do not use this option.

  -e, --extensions
      Comma-delimited list of extensions of the files to watch
      for changes, excluding the dots and without spaces.
      Default is "md,markdown".

  -t, --template
      Path to your custom HTML template file. See README.md for
      more information.

  -v, --version
      Show version.

  -h, --help
      Show this help message.
```

## Templates

Templates are custom HTML files to use as a container for the processed HTML.

A template file must not contain links to external resources such as images, style sheets or scripts, they must be embedded in the template itself, or alternatively hosted online.

A template must contain the following special variables used by _kokoi_: `$title$`, `$scripts$` and `$body$`. As an example, the default template looks like this:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>$title$</title>
    $scripts$
    <style>
      /* your css here */
    </style>
  </head>
  <body>
    $body$
  </body>
</html>
```

## License

_kokoi_ is available under the MIT License.
