const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const path = require('path');


module.exports = {
  entry: [
    path.join(__dirname, 'src/index')
  ],
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'lib'),
    library: 'ReactReduxUUID',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
    ]
  },
  externals: [nodeExternals()]
};
