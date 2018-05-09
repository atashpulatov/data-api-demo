let webpack = require('webpack');
let path = require('path');
let BUILD_DIR = path.resolve(__dirname, 'src/frontend/public');
let APP_DIR = path.resolve(__dirname, 'src/frontend/app');
let config = {
  context: APP_DIR,
  entry: './index.jsx',
  devtool: 'source-map',
  devServer: {
    contentBase: BUILD_DIR,
  },
  output: {
    path: BUILD_DIR,
    filename: 'js/bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader',
        query: {
          presets: ['react'],
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
module.exports = config;
