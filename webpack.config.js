var PROD = process.argv.indexOf('-p') >= 0;

module.exports = {
    entry: {
        'angular-gdeic': __dirname + '/index.js',
    },
    output: {
        path: __dirname + '/dist',
        filename: PROD ? '[name].min.js' : '[name].js'
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: 'raw-loader' }
        ]
    }
};