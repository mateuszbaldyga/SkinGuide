var webpack = require('webpack');

module.exports = {
  entry: [
    './public/javascripts/main.js',
  ],
  output: {
    path: '/',
    filename: 'main-es6.js',
    publicPath: 'http://localhost:3000/scripts/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      comments: false,
    }),
  ],
};
