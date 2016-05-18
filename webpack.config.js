var PROD = process.argv.indexOf('-p') >= 0;
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        'angular-gdeic': __dirname + '/index.js',
        '/extension/angular-gdeic-sys': __dirname + '/extension/index-sys.js',
        '/extension/angular-gdeic-controls': __dirname + '/extension/index-controls.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: PROD ? '[name].min.js' : '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'raw-loader'
            }, {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css-loader!sass-loader')
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('./css/' + (PROD ? '[name].min.css' : '[name].css'))
    ]
};