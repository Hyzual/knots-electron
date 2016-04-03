// require('./style.css');
var d3     = require('d3');
var knots  = require('knotsjs');
var _      = require('lodash');
var layout = require('./app/layout.js');

knots.parse(function(err, dependencies) {
  var width  = 960;
  var height = 500;

  layout.layoutNodes(dependencies.orderedNodes, width, height);

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
    .attr('x1', function(d) { return d.source.x; })
    .attr('y1', function(d) { return d.source.y; })
    .attr('x2', function(d) { return d.target.x; })
    .attr('y2', function(d) { return d.target.y; });

  var node = svg
    .selectAll('circle')
    .data(dependencies.nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

  var max_transitive_dependencies_and_dependents = _(dependencies.nodes)
    .map(function (node) {
      return node.nb_transitive_dependencies + node.nb_transitive_dependents;
    })
    .max();

  console.log('max', max_transitive_dependencies_and_dependents);

  var color = d3
    .scale
    .linear()
    .domain([0, max_transitive_dependencies_and_dependents])
    .range(["white", "red"]);

  node
    .append('text')
    .attr('dx', 12)
    .attr('dy', '.35em')
    .text(function(d) { return d.name; });

  node
    .append('circle')
    .attr('r', 7)
    .style('fill', function(d) {
      return color(d.nb_transitive_dependencies + d.nb_transitive_dependents);
    });
});
