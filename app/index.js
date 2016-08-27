var ipc    = require('electron').ipcRenderer;
var knots  = require('knotsjs');
var _      = require('lodash');
var layout = require('./app/layout.js');
var graph  = require('./app/graph.js');

function openFile() {
  ipc.send('open-file-dialog');
}

function openDirectory() {
  ipc.send('open-directory-dialog');
}

ipc.on('selected-file', function (event, file_path) {
  knots.parse(file_path).then(displayGraph);
});

ipc.on('selected-directory', function (event, directory_path) {
  knots.parseDirectory(directory_path).then(displayGraph);
});

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
