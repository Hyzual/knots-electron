var path                             = require('path');
var webpack_target_electron_renderer = require('webpack-target-electron-renderer');

var config = {
  entry: {
    bundle: './app/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'http://localhost:8080/dist/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  }
};

config.target = webpack_target_electron_renderer(config);

module.exports = config;
