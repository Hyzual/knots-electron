var _ = require('lodash');

module.exports = {
  layoutNodes: layoutNodes
};

function layoutNodes(ordered_nodes, total_width, total_height) {
  var nb_levels     = _.size(ordered_nodes);
  var current_level = 1;
  _.forOwn(ordered_nodes, function(nodes) {
    _.map(nodes, function(node, index) {
      node.y = layoutVertically(current_level, nb_levels + 1, total_height);
      node.x = layoutHorizontally(index + 1, nodes.length + 1, total_width);
    });

    current_level++;
  });
}

function layoutVertically(index, nb_levels, total_height) {
  return index * total_height / nb_levels;
}

function layoutHorizontally(index, nb_nodes, total_width) {
  return index * total_width / nb_nodes;
}
