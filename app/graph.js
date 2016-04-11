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

  var link = svg
    .selectAll('line')
    .data(dependencies.links)
    .enter()
    .append('line')
    .attr('class', 'link')
    .attr('x1', function(link) { return dependencies.nodes[link.e.source].x; })
    .attr('y1', function(link) { return dependencies.nodes[link.e.source].y; })
    .attr('x2', function(link) { return dependencies.nodes[link.e.target].x; })
    .attr('y2', function(link) { return dependencies.nodes[link.e.target].y; });

  var nodes_array = _.values(dependencies.nodes);

  var node = svg
    .selectAll('circle')
    .data(nodes_array)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', function(node) { return 'translate(' + node.x + ',' + node.y + ')'; });

  var max_transitive_dependencies_and_dependents = _(nodes_array)
    .map(function (node) {
      return node.p.sum_transitive_dependencies + node.p.sum_transitive_dependents;
    })
    .max();

  var color = d3
    .scale
    .linear()
    .domain([0, max_transitive_dependencies_and_dependents])
    .range(["white", "red"]);

  node
    .append('text')
    .attr('dx', 12)
    .attr('dy', '.35em')
    .text(function(node) { return node.name; });

  node
    .append('circle')
    .attr('r', 7)
    .style('fill', function(node) {
      return color(node.p.sum_transitive_dependencies + node.p.sum_transitive_dependents);
    });
}
