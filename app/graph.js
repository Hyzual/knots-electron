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
    .selectAll('line')
    .data(dependencies.edges)
    .enter()
    .append('line')
    .attr('class', 'edge')
    .attr('x1', function(edge) { return dependencies.vertices[edge.e.source].x; })
    .attr('y1', function(edge) { return dependencies.vertices[edge.e.source].y; })
    .attr('x2', function(edge) { return dependencies.vertices[edge.e.target].x; })
    .attr('y2', function(edge) { return dependencies.vertices[edge.e.target].y; });

  var vertices_array = _.values(dependencies.vertices);

  var vertex = svg
    .selectAll('circle')
    .data(vertices_array)
    .enter()
    .append('g')
    .attr('class', 'vertex')
    .attr('transform', function(vertex) { return 'translate(' + vertex.x + ',' + vertex.y + ')'; });

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

  vertex
    .append('circle')
    .attr('r', 7)
    .style('fill', function(vertex) {
      return color(vertex.p.sum_transitive_dependencies + vertex.p.sum_transitive_dependents);
    });
}
