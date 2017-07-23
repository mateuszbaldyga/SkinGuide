var webpack = require('webpack'),
    webpackStats = require('stats-webpack-plugin');

module.exports = {
    devtool: '#source-map',
    entry: [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        "./public/js/script.js"
    ],
    output: {
        path: '/',
        filename: 'script-es6.js',
        publicPath: 'http://localhost:3000/scripts/',
    },
    module: {
        loaders: [
        {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
              presets: ['react', 'es2015', 'stage-0'],
              plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
            }
        },
        // {
        //     test: /\.jsx?$/,
        //     exclude: /(node_modules|bower_components)/,
        //     loader: 'webpack-module-hot-accept',
        // },
        
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json'), ['main']),
        new webpackStats('webpack.json'),
        new webpack.optimize.UglifyJsPlugin({
          minimize: true
        }),
    ],
    target: 'web',
    devServer: { 
        inline: true,
        hot: true,
    },
}
