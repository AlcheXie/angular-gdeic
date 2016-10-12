var PROD = process.argv.indexOf('-p') >= 0;

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
        loaders: [{
                test: /\.html$/,
                loader: 'raw'
            }, {
                test: /\.scss$/,
                loader: 'style!css!sass'
            }, {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'stage-0']
                }
            }
        ]
    }
};