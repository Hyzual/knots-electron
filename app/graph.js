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
    .call(zoom_behavior)
    .on('click', onSvgClick);

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
    .data(dependencies.edges, function (edge) {
      return edge.e.source + ' ' + edge.e.target;
    })
    .enter()
    .append('path')
    .classed('edge', true)
    .attr('d', function (edge) {
      return layoutEdge(d3.zoomIdentity, edge);
    });

  var vertices_array = _.values(dependencies.vertices);

  var vertices = svg
    .selectAll('.vertex')
    .data(vertices_array, function (vertex) {
      return vertex.name;
    })
    .enter()
    .append('g')
    .classed('vertex', true)
    .attr('id', function (vertex) {
      return vertex.name;
    })
    .attr('transform', function(vertex) {
      return layoutTransform(d3.zoomIdentity, vertex);
    });

  addVertexText(vertices);

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
    })
    .on('click', onVertexClick);

  function addVertexText(vertices) {
    vertices
      .append('text')
      .attr('dx', 12)
      .attr('dy', '.35em')
      .text(function(vertex) { return vertex.name; });
  }

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

  function onSvgClick() {
    resetHighlighting();
  }

  function onVertexClick(vertex) {
    d3.event.stopPropagation();
    // TODO: get transitive connected edges
    // var connected_edges = _.filter(dependencies.edges, function (edge) {
    //   return edge.e.source === vertex.name || edge.e.target === vertex.name;
    // });

    console.log('dependencies', recursiveGetAllDependencies(vertex.name));
    console.log('dependents', recursiveGetAllDependents(vertex.name));

    var all_dependencies     = recursiveGetAllDependencies(vertex.name);
    var all_dependents       = recursiveGetAllDependents(vertex.name);
    var all_transitive_edges = all_dependencies.concat(all_dependents);

    // TODO: Extract this in a different module, nothin to do with d3 stuff
    all_transitive_edges = _.map(all_transitive_edges, function (edge) {
      var transformed_edge = {
        e: {
          u     : edge.u,
          v     : edge.v,
          source: edge.u,
          target: edge.v
        },
        p: dependencies.directed_graph.getEdgeProperty(edge)
      };

      return transformed_edge;
    });

    highlightEdgesConnectedToVertex(all_transitive_edges);
    highlightVerticesConnectedToVertex(all_transitive_edges);
  }

  // TODO: Extract this in a different module, nothin to do with d3 stuff
  function recursiveGetAllDependencies(vertex_id) {
    if (dependencies.directed_graph.outDegree(vertex_id) === 0) {
      return [];
    }

    var direct_edges  = dependencies.directed_graph.outEdges(vertex_id);
    var all_sub_edges = [];

    _.forEach(direct_edges, function (edge) {
      all_sub_edges = all_sub_edges.concat(recursiveGetAllDependencies(edge.v));
    });

    return direct_edges.concat(all_sub_edges);
  }

  // TODO: Extract this in a different module, nothin to do with d3 stuff
  function recursiveGetAllDependents(vertex_id) {
    if (dependencies.directed_graph.inDegree(vertex_id) === 0) {
      return [];
    }

    var direct_edges  = dependencies.directed_graph.inEdges(vertex_id);
    var all_sub_edges = [];
    console.log('direct_edges', direct_edges);

    _.forEach(direct_edges, function (edge) {
      all_sub_edges = all_sub_edges.concat(recursiveGetAllDependents(edge.u));
    });

    return direct_edges.concat(all_sub_edges);
  }

  function resetHighlighting() {
    svg
      .selectAll('.edge.highlighted')
      .classed('highlighted', false);
    svg
      .selectAll('.vertex.highlighted')
      .classed('highlighted', false);

    var faded_vertices = svg
      .selectAll('.vertex.faded')
      .classed('faded', false);
    addVertexText(faded_vertices);
  }

  function highlightEdgesConnectedToVertex(connected_edges) {
    var highlighted_edges = svg
      .selectAll('.edge')
      .data(connected_edges, function (edge) {
        return edge.e.source + ' ' + edge.e.target;
      })
      .classed('highlighted', true)
      .exit()
      .classed('highlighted', false);
  }

  function highlightVerticesConnectedToVertex(connected_edges) {
    var target_vertices_names = _.map(connected_edges, 'e.target');
    var source_vertices_names = _.map(connected_edges, 'e.source');

    var connected_vertices_names = _.union(target_vertices_names, source_vertices_names);

    var connected_vertices = _.filter(dependencies.vertices, function (vertex) {
      return _.includes(connected_vertices_names, vertex.name);
    });

    var vertices = svg
      .selectAll('.vertex')
      .data(connected_vertices, function(vertex) {
        return vertex.name;
      })
      .classed('faded', false)
      .classed('highlighted', true);

    vertices
      .select('text').remove();
    addVertexText(vertices);

    vertices.exit()
      .classed('highlighted', false)
      .classed('faded', true)
      .select('text').remove();
  }
}
