# kokoi

_kokoi_ is a command line utility that watches markup files for changes (Markdown, Textile, reStructuredText...), and automatically recompiles and previews them directly in the browser each time you save them with your text editor. Rendered HTML is optionally saved.

You can pass multiple markup files as arguments or directories (which will be scanned recursively) containing markup files. If no file or directory is specified, _kokoi_ watches for changes on all the markup files within the current directory.

Additional features are, support for math formulas (rendered with MathJax), and support for custom templates.

## Installation

* First, install a markup converter such as [pandoc](http://johnmacfarlane.net/pandoc/). By default _kokoi_ is configured to watch for changes on Markdown files, and uses _pandoc_ to convert them. If you want to use a different converter, the appropriate command to convert markup files to HTML must be specified (see Usage).

* Then, `npm install kokoi -g` to install _kokoi_ via [npm](http://npmjs.org/).

## Usage

```
USAGE

  kokoi [options] [files or dirs]

  Examples:

    kokoi -c "redcarpet --smarty" -s "My Notes" test/Foo.md
    kokoi -e rst -c "pandoc -f rst -t html5" foo.rst

  If no file or directory is specified, the current directory (.)
  is assumed. Directories are scanned recursively.

OPTIONS

  -p, --port
      TCP port at which the HTML files will be served.
      Default is 8333.

  -c, --command
      Command to convert markup files to HTML.
      Default is "pandoc -f markdown -t -html5".

  -s, --save
      Save rendered HTML. The output directory for each HTML file
      is the same of the corresponding markup file.

  -m, --mathjax
      Insert a link to the MathJax CDN to render math formulas.

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

Templates are custom HTML files to use as a container for the compiled HTML.

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
