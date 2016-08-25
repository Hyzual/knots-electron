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
  var zoom_behavior = d3
    .zoom()
    .scaleExtent([ 1/2, 8])
    .on('zoom', zoomed);
  //TODO: limit panning around with translateExtent, I should not be able to pan the entire graph out of view

  var svg = d3
    .select('#graph')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .call(zoom_behavior);

  function layoutTransform(transform, obj) {
    return transform.translate(obj.x, obj.y);
  }

  var levels = svg
    .selectAll('.level')
    .data(dependencies.levels)
    .enter()
    .append('rect')
    .classed('level', true)
    .classed('white', function (datum, index) { return index % 2 == 0; })
    .classed('grey', function (datum, index) { return index % 2 == 1; })
    .attr('width', function(level) { return level.width; })
    .attr('height', function(level) { return level.height; })
    .attr('transform', function(level) {
      return layoutTransform(d3.zoomIdentity, level);
    });

  function layoutEdge(transform, edge) {
    var start_point = 'M ' + transform.applyX(dependencies.vertices[edge.e.source].x) + ' '
      + transform.applyY(dependencies.vertices[edge.e.source].y);
    var end_point = transform.applyX(dependencies.vertices[edge.e.target].x) + ' '
      + transform.applyY(dependencies.vertices[edge.e.target].y);

    if (edge.p.type === 'reverse') {
      var control_point = transform.applyX(dependencies.vertices[edge.e.target].x) + ' '
        + transform.applyY(dependencies.vertices[edge.e.source].y);
      var curve = 'Q ' + control_point + ',' + end_point;
      return start_point + ' ' + curve;
    }

    return start_point + ' ' +  'L ' + end_point;
  }

  var edges = svg
    .selectAll('.edge')
    .data(dependencies.edges)
    .enter()
    .append('path')
    .classed('edge', true)
    .attr('d', function (edge) {
      return layoutEdge(d3.zoomIdentity, edge);
    });

  var vertices_array = _.values(dependencies.vertices);

  var vertices = svg
    .selectAll('.vertex')
    .data(vertices_array)
    .enter()
    .append('g')
    .classed('vertex', true)
    .attr('transform', function(vertex) {
      return layoutTransform(d3.zoomIdentity, vertex);
    });

  vertices
    .append('text')
    .attr('dx', 12)
    .attr('dy', '.35em')
    .text(function(vertex) { return vertex.name; });

  vertices
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
    .scaleLinear()
    .domain([0, max_transitive_dependencies_and_dependents])
    .range(["white", "red"]);

  vertices
    .append('circle')
    .attr('r', 7)
    .style('fill', function(vertex) {
      return color(vertex.p.sum_transitive_dependencies + vertex.p.sum_transitive_dependents);
    });

  function zoomed() {
    levels.attr('transform', function(level) {
      return layoutTransform(d3.event.transform, level);
    });
    vertices.attr('transform', function(vertex) {
      return 'translate(' + d3.event.transform.applyX(vertex.x) + ',' + d3.event.transform.applyY(vertex.y) +')';
    });
    edges.attr('d', function(edge) {
      return layoutEdge(d3.event.transform, edge);
    });
  }
}
