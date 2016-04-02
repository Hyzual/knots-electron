var path = require('path');
var webpack_target_electron_renderer = require('webpack-target-electron-renderer');

var config = {
  context: __dirname,
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
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.css$/,
        loaders: [
          'style',
          'css'
        ]
      }
    ]
  },
  // resolve: {
  //   extensions: [
  //     '',
  //     '.webpack.js',
  //     '.web.js',
  //     '.js',
  //     '.json'
  //   ]
  // }
  // Hack to keep working. I don't know why, it's impossible to do require('../package.json'); webpack throws an
  // error like "could not resolve module json-loader"
  externals: {
    'escope': true
  }
};

config.target = webpack_target_electron_renderer(config);

module.exports = config;