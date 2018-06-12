let webpack = require('webpack'); // eslint-disable-line no-unused-vars
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
          presets: [
            [
              'env',
              {
                'targets': {
                  'node': 'current',
                },
              },
            ],
            'react'],
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true, // true outputs JSX tags
            },
          },
        ],
      },
    ],
  },
};
module.exports = config;
