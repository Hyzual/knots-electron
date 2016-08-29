/*
 * Copyright (C) 2016  Joris "Hyzual" MASSON
 *
 * This file is part of knots-electron.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
