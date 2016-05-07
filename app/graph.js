var d3 = require('d3');
var _  = require('lodash');

module.exports = {
  erase: erase,
  show : show
};

function erase() {
  d3
    .select('#graph')
    .selectAll('*')
    .remove();
}

function show(dependencies, width, height) {
  var x = d3
    .scale
    .linear()
    .domain([0, width])
    .range([0, width]);

  var y = d3
    .scale
    .linear()
    .domain([0, height])
    .range([0, height]);

  var zoom_behavior = d3
    .behavior
    .zoom()
    .x(x)
    .y(y)
    .on('zoom', zoom);

  var svg = d3
    .select('#graph')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .call(zoom_behavior);

  var isEven = false;
  function alternateBackgroundColor() {
    isEven = ! isEven;
    return isEven;
  }

  function layoutTransform(obj) {
    return 'translate('
      + x(obj.x) + ','
      + y(obj.y)
      + ')';
  }

  var level = svg
    .selectAll('.level')
    .data(dependencies.levels)
    .enter()
    .append('rect')
    .attr('class', function(level) {
      var backgroundColor = (alternateBackgroundColor()) ? 'white' : 'grey';
      return 'level ' + backgroundColor; })
    .attr('width', function(level) { return level.width; })
    .attr('height', function(level) { return level.height; })
    .attr('transform', layoutTransform);

  function layoutEdge(edge) {
    var start_point = 'M ' + x(dependencies.vertices[edge.e.source].x) + ' '
      + y(dependencies.vertices[edge.e.source].y);
    var end_point = x(dependencies.vertices[edge.e.target].x) + ' '
      + y(dependencies.vertices[edge.e.target].y);

    if (edge.p.type === 'reverse') {
      var control_point = x(dependencies.vertices[edge.e.target].x) + ' '
        + y(dependencies.vertices[edge.e.source].y);
      var curve = 'Q ' + control_point + ',' + end_point;
      return start_point + ' ' + curve;
    }

    return start_point + ' ' +  'L ' + end_point;
  }

  var edge = svg
    .selectAll('.edge')
    .data(dependencies.edges)
    .enter()
    .append('path')
    .attr('class', 'edge')
    .attr('d', layoutEdge);

  var vertices_array = _.values(dependencies.vertices);

  var vertex = svg
    .selectAll('.vertex')
    .data(vertices_array)
    .enter()
    .append('g')
    .attr('class', 'vertex')
    .attr('transform', layoutTransform);

  vertex
    .append('text')
    .attr('dx', 12)
    .attr('dy', '.35em')
    .text(function(vertex) { return vertex.name; });

  vertex
    .append('title')
    .text(function(vertex) {
      return 'name: ' + vertex.name
        + '\n' + 'sum_transitive_dependencies: ' + vertex.p.sum_transitive_dependencies
        + '\n' + 'sum_transitive_dependents: ' + vertex.p.sum_transitive_dependents;
    });

  var max_transitive_dependencies_and_dependents = _(vertices_array)
    .map(function (vertex) {
      return vertex.p.sum_transitive_dependencies + vertex.p.sum_transitive_dependents;
    })
    .max();

  var color = d3
    .scale
    .linear()
    .domain([0, max_transitive_dependencies_and_dependents])
    .range(["white", "red"]);

  vertex
    .append('circle')
    .attr('r', 7)
    .style('fill', function(vertex) {
      return color(vertex.p.sum_transitive_dependencies + vertex.p.sum_transitive_dependents);
    });

  //TODO: limit panning around, I should not be able to pan the entire graph out of view
  function zoom() {
    edge.attr('d', layoutEdge);
    vertex.attr('transform', layoutTransform);
    level.attr('transform', function(level) {
      return layoutTransform(level) + 'scale(' + d3.event.scale + ')';
    });
  }
}
