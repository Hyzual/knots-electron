// require('./style.css');
var knots  = require('knotsjs');
var remote = require('remote');
var dialog = remote.require('dialog');
var layout = require('./app/layout.js');
var graph  = require('./app/graph.js');

function openFile() {
  dialog.showOpenDialog({
    filters: [
      { name: 'js', extensions: ['js'] }
    ]
  }, parseFiles);
}

function parseFiles(filenames) {
  console.log('filenames', filenames);

  knots.parseFiles(filenames, function(err, dependencies) {
    var width  = 960;
    var height = 500;

    layout.layoutNodes(dependencies.orderedNodes, width, height);

    graph.erase();
    graph.show(dependencies, width, height);
  });
}
