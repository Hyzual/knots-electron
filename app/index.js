// require('./style.css');
var d3    = require('d3');
var knots = require('knotsjs');

knots.parse(function(err, dependencies) {
  console.log('yolo', dependencies);

  var width = 960;
  var height = 500;

  var force = d3
    .layout
    .force()
    .nodes(dependencies.nodes)
    .links(dependencies.links)
    .size([width, height])
    .gravity(0.05)
    .linkDistance(60)
    .charge(-300)
    .on('tick', tick)
    .start();

  var svg = d3
              .select('#graph')
              .attr('width', width)
              .attr('height', height);

  var node = svg
              .selectAll('circle')
              .data(force.nodes())
              .enter()
              .append('g')
              .attr('class', 'node')
              .call(force.drag);

  node
    .append('text')
    .attr('dx', 12)
    .attr('dy', '.35em')
    .text(function(d) { return d.name; });

  node
    .append('circle')
    .attr('r', 10);

  var link = svg
              .selectAll()
              .data(force.links())
              .enter()
              .append('line')
              .attr('class', 'link');

  function tick() {
    link
      .attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });

    node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
  }
});
