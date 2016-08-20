// require('./style.css');
var remote    = require('remote');
var dialog    = remote.require('dialog');
var knots     = require('knotsjs');
var _         = require('lodash');
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

  var file_path = file_paths[0];

  knots.parse(file_path).then(displayGraph);
}

function parseDirectory(directory_paths) {
  if (! directory_paths) {
    return;
  }
  console.log('directory_paths', directory_paths);

  var directory_path = directory_paths[0];

  knots.parseDirectory(directory_path).then(displayGraph);
}

function displayGraph(dependencies) {
  var width  = 960;
  var height = 500;

  var layout_obj = layout.layoutVertices(
    dependencies.ordered_vertices,
    width,
    height
  );

  var arranged_dependencies = _.extend({},
    dependencies,
    {
      ordered_vertices: layout_obj.laid_out_vertices,
      levels          : layout_obj.levels
    }
  );

  graph.erase();
  graph.show(arranged_dependencies, width, height);
}
