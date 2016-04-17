var _ = require('lodash');

module.exports = {
  layoutVertices: layoutVertices
};

function layoutVertices(ordered_vertices, total_width, total_height) {
  var nb_levels     = _.size(ordered_vertices);
  var current_level = 1;

  _.forOwn(ordered_vertices, function(vertices) {
    _.map(vertices, function(vertex, index) {
      vertex.y = layoutVertically(current_level, nb_levels + 1, total_height);
      vertex.x = layoutHorizontally(index + 1, vertices.length + 1, total_width);
    });

    current_level++;
  });
}

function layoutVertically(index, nb_levels, total_height) {
  return index * total_height / nb_levels;
}

function layoutHorizontally(index, nb_vertices, total_width) {
  return index * total_width / nb_vertices;
}
