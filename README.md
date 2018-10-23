# angular-gdeic

Run webpack:

    $ webpack

Run webpack and minimize files and create sourcemap:

    $ webpack -p -d

From v1.0.1, stylesheets are packed into relevant js file (need style-loader).
If it's necessary to use external css files, run webpack with the other config.

    $ webpack --config webpack.config.extract-style.js