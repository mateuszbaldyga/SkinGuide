var webpack = require('webpack');

module.exports = {
  entry: [
    './public/javascripts/script.js',
  ],
  output: {
    path: '/',
    filename: 'script-es6.js',
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
  //     {
  //       test: /\.css$/,
  //       use: [ 'style-loader', 'css-loader' ]
  //     },
  //     {
  //     test: /\.scss$/,
  //     use: [ 'style-loader', 'css-loader', 'sass-loader' ]
  //     },
  //     {
  //     test: /\.(png|jpg|gif)$/,
  //     use: [
  //         {
  //           loader: 'url-loader',
  //           options: {
  //             limit: 8192
  //           }
  //         }
  //       ]
  //     }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      // beautify: true,
      minimize: true,
      comments: false,
    }),
  ],
};
