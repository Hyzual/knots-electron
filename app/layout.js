var _ = require('lodash');

module.exports = {
  layoutVertices: layoutVertices
};

function layoutVertices(ordered_vertices, total_width, total_height) {
  var nb_levels      = _.size(ordered_vertices);
  var current_level  = 0;
  var levels         = [];
  var heightOfALevel = getHeightOfALevel(total_height, nb_levels);

  _.forOwn(ordered_vertices, function(vertices) {
    _.map(vertices, function(vertex, index) {
      // TODO: return another object containing only the id, x and y, then combine using lodash

      vertex.y = layoutVertically(current_level, heightOfALevel) + (heightOfALevel / 2);
      vertex.x = layoutHorizontally(index + 1, vertices.length + 1, total_width);
    });

    levels[current_level] = layoutLevel(
      current_level,
      heightOfALevel,
      total_width
    );

    current_level++;
  });

  return {
    laid_out_vertices: ordered_vertices,
    levels           : levels
  };
}

function layoutLevel(
  current_level,
  heightOfALevel,
  total_width
) {
  return {
    id    : current_level,
    x     : 0,
    y     : layoutVertically(current_level, heightOfALevel),
    height: heightOfALevel,
    width : total_width
  };
}

function layoutVertically(index, heightOfALevel) {
  return index * heightOfALevel;
}

function layoutHorizontally(index, nb_vertices, total_width) {
  return index * total_width / nb_vertices;
}

function getHeightOfALevel(total_height, nb_levels) {
  return total_height / nb_levels;
}
