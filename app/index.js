// require('./style.css');
var remote    = require('remote');
var dialog    = remote.require('dialog');
var Promise   = require('bluebird');
var recursive = require('recursive-readdir');
var knots     = require('knotsjs');
var path      = require('path');
var layout    = require('./app/layout.js');
var graph     = require('./app/graph.js');

function openFile() {
  dialog.showOpenDialog({
    filters: [
      { name: 'Javascript files', extensions: ['js'] }
    ]
  }, parseFile);
}

function openDirectory() {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, parseDirectory);
}

function parseFile(file_paths) {
  if (! file_paths) {
    return;
  }
  console.log('file_paths', file_paths);

  parse(file_paths);
  //TODO: Use knots.parse()
}

function parseDirectory(directory_paths) {
  if (! directory_paths) {
    return;
  }
  console.log('directory_paths', directory_paths);

  var directory_path = directory_paths[0];

  // TODO: move this code to knotsjs
  var recursiveReadDir = Promise.promisify(recursive);
  recursiveReadDir(directory_path, ['*_test.js', ignoreNonJS]).then(function (file_paths) {
    return parse(file_paths);
  });
}

function ignoreNonJS(file_path) {
  return path.extname(file_path) !== '.js';
}

function parse(file_paths) {
  return knots.parseFiles(file_paths).then(function(dependencies) {
    var width  = 960;
    var height = 500;

    layout.layoutVertices(dependencies.ordered_vertices, width, height);

    graph.erase();
    graph.show(dependencies, width, height);
  });
}
