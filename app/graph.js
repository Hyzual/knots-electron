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
  var svg = d3
    .select('#graph')
    .attr('width', width)
    .attr('height', height);

  var edge = svg
    .selectAll('path')
    .data(dependencies.edges)
    .enter()
    .append('path')
    .attr('class', 'edge')
    .attr('d', function(edge) {
      var start_point = 'M ' + dependencies.vertices[edge.e.source].x + ' ' + dependencies.vertices[edge.e.source].y;
      var end_point   = dependencies.vertices[edge.e.target].x + ' ' + dependencies.vertices[edge.e.target].y;

      if (edge.p.type === 'reverse') {
        var control_point = dependencies.vertices[edge.e.target].x + ' ' + dependencies.vertices[edge.e.source].y;
        var curve         = 'Q ' + control_point + ',' + end_point;
        return start_point + ' ' + curve;
      }

      return start_point + ' ' +  'L ' + end_point;
    });

  var vertices_array = _.values(dependencies.vertices);

  var vertex = svg
    .selectAll('circle')
    .data(vertices_array)
    .enter()
    .append('g')
    .attr('class', 'vertex')
    .attr('transform', function(vertex) { return 'translate(' + vertex.x + ',' + vertex.y + ')'; });

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
}
