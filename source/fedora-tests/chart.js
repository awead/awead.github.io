window.onload = function() {
  var dataPoints = [];

  function parsePoint(value) {
    if (typeof value != 'undefined')
      return parseFloat(value.replace(/[()/w]/, ''));
  }

  function getDataPointsFromCSV(csv, column) {
    var dataPoints = csvLines = points = [];
    csvLines = csv.split(/[\r?\n|\r|\n]+/);

    // Skip first line and start at 1
    for (var i = 1; i < csvLines.length; i++)
      if (csvLines[i].length > 0) {
        points = csvLines[i].split(",");
        dataPoints.push({
          x: i,
          y: parsePoint(points[column])
        });
      }
    return dataPoints;
  }

  function individual_results(data) {
    var result = {
      axisX: { title: "Works", labelFontSize: 14, titleFontSize: 20 },
      axisY: { title: "Time (sec)", labelFontSize: 14, titleFontSize: 20 },
      zoomEnabled: true,
      data: [
        { type: "line", showInLegend: true, name: "User", dataPoints: getDataPointsFromCSV(data, 0) },
        { type: "line", showInLegend: true, name: "System", dataPoints: getDataPointsFromCSV(data, 1) },
        { type: "line", showInLegend: true, name: "Total", dataPoints: getDataPointsFromCSV(data, 2) },
        { type: "line", showInLegend: true, name: "Real", dataPoints: getDataPointsFromCSV(data, 3) }
      ]
    };
    return result;
  }

  function request_results(data) {
    var result = {
      axisX: { title: "Requests", labelFontSize: 14, titleFontSize: 20 },
      axisY: { title: "Time (ms)", labelFontSize: 14, titleFontSize: 20 },
      zoomEnabled: true,
      data: [
        { type: "line", showInLegend: false, name: "Requests", dataPoints: getDataPointsFromCSV(data, 0) }
      ]
    };
    return result;
  }

  function render_individual_chart(selector, data) {
    var chart = new CanvasJS.Chart(selector, individual_results(data));
    chart.render();
  }

  function render_request_chart(selector, data) {
    var chart = new CanvasJS.Chart(selector, request_results(data));
    chart.render();
  }

  function combined_results(data, options) {
    var default_options = {}
    default_options['axisX'] = "Works"
    default_options['axisY'] = "Time (sec)"
    default_options['column'] = 3
    options = options || default_options;
    var result = {
      axisX: { title: options['axisX'], labelFontSize: 14, titleFontSize: 20 },
      axisY: { title: options['axisY'], labelFontSize: 14, titleFontSize: 20 },
      zoomEnabled: true,
      data: []
    };

    for (var key in data) {
      result.data.push(
        {
          type: "line",
          showInLegend: true,
          name: data[key].label,
          dataPoints: getDataPointsFromCSV(data[key].data, options['column'])
        }
      )
    }
    return result;
  }

  // Individual charts

  $.get("/fedora-tests/data/postgres_nested_collections_10000.csv", function(data) {
    render_individual_chart("postgres_nested_collections_10000", data)
  });

  $.get("/fedora-tests/data/fedora_nested_collections_10000.csv", function(data) {
    render_individual_chart("fedora_nested_collections_10000", data)
  });

  $.get("/fedora-tests/data/fedora_collections_10000.csv", function(data) {
    render_individual_chart("fedora_collections_10000", data)
  });

  // Request charts

  $.get("/fedora-tests/data/local_active_fedora_collections_25000_fedora_post.csv", function(data) {
    render_request_chart("local_active_fedora_collections_25000_fedora_post", data)
  });

  $.get("/fedora-tests/data/local_active_fedora_collections_25000_fedora_get.csv", function(data) {
    render_request_chart("local_active_fedora_collections_25000_fedora_get", data)
  });

  // Comparison Charts

  $.when(
    $.get("/fedora-tests/data/postgres_collections_100000.csv"),
    $.get("/fedora-tests/data/fedora_collections_100000.csv"),
    $.get("/fedora-tests/data/active_fedora_collections_100000.csv"),
    $.get("/fedora-tests/data/cho_collections_100000.csv")
  ).done(function(postgres, fedora, af, hyrax) {
    var chart = new CanvasJS.Chart(
      "collectionComparison",
      combined_results([
        { label: "Postgres", data: postgres[0] },
        { label: "Fedora", data: fedora[0] },
        { label: "ActiveFedora", data: af[0] },
        { label: "Hyrax", data: hyrax[0] }
      ])
    );
    chart.render();

    // Render individual charts now while we have the data
    render_individual_chart("postgres_collections_100000", postgres[0])
    render_individual_chart("fedora_collections_100000", fedora[0])
    render_individual_chart("active_fedora_collections_100000", af[0])
    render_individual_chart("cho_collections_100000", hyrax[0])
  });

  $.when(
    $.get("/fedora-tests/data/postgres_nested_collections_1000.csv"),
    $.get("/fedora-tests/data/fedora_nested_collections_1000.csv"),
    $.get("/fedora-tests/data/active_fedora_nested_collections_1000.csv"),
    $.get("/fedora-tests/data/cho_nested_collections_1000.csv")
  ).done(function(postgres, fedora, af, hyrax) {
    var chart = new CanvasJS.Chart(
      "nestedComparison",
      combined_results([
        { label: "Postgres", data: postgres[0] },
        { label: "Fedora", data: fedora[0] },
        { label: "ActiveFedora", data: af[0] },
        { label: "Hyrax", data: hyrax[0] }
      ])
    );
    chart.render();

    render_individual_chart("active_fedora_nested_collections_1000", af[0])
    render_individual_chart("cho_nested_collections_1000", hyrax[0])
  });

  $.when(
    $.get("/fedora-tests/data/postgres_files_1000.csv"),
    $.get("/fedora-tests/data/fedora_files_1000.csv"),
    $.get("/fedora-tests/data/active_fedora_files_1000.csv"),
    $.get("/fedora-tests/data/cho_files_1000.csv")
  ).done(function(postgres, fedora, af, hyrax) {
    var chart = new CanvasJS.Chart(
      "fileComparison",
      combined_results([
        { label: "Postgres", data: postgres[0] },
        { label: "Fedora", data: fedora[0] },
        { label: "ActiveFedora", data: af[0] },
        { label: "Hyrax", data: hyrax[0] }
      ])
    );
    chart.render();

    // Render individual charts now while we have the data
    render_individual_chart("postgres_files_1000", postgres[0])
    render_individual_chart("fedora_files_1000", fedora[0])
    render_individual_chart("active_fedora_files_1000", af[0])
    render_individual_chart("cho_files_1000", hyrax[0])
  });

  $.when(
    $.get("/fedora-tests/data/local_active_fedora_collections_25000_solr_update.csv"),
    $.get("/fedora-tests/data/local_active_fedora_collections_25000_solr_hyrax_update.csv"),
    $.get("/fedora-tests/data/local_active_fedora_collections_25000_solr_hyrax_ns_update.csv")
  ).done(function(psu, hyrax, ns) {
    var options = {}
    options['axisX'] = "Requests"
    options['axisY'] = "Time (ms)"
    options['column'] = 0
    var chart = new CanvasJS.Chart(
      "solrComparison",
      combined_results([
        { label: "PSU Default (5.3.1)", data: psu[0] },
        { label: "Hyrax (7.1.0)", data: hyrax[0] },
        { label: "Hyrax (no suggest)", data: ns[0] }
      ], options)
    );
    chart.render();
  });

  $.when(
    $.get("/fedora-tests/data/local_active_fedora_collections_25000.csv"),
    $.get("/fedora-tests/data/active_fedora_collections_25000.csv")
  ).done(function(local, server) {
    var chart = new CanvasJS.Chart(
      "localCollectionComparison",
      combined_results([
        { label: "Laptop", data: local[0] },
        { label: "Server", data: server[0] }
      ])
    );
    chart.render();
  });

  $.when(
    $.get("/fedora-tests/data/local_active_fedora_collections_25000.csv"),
    $.get("/fedora-tests/data/local_active_fedora_collections_25000_solr_hyrax_nc.csv"),
    $.get("/fedora-tests/data/local_active_fedora_collections_25000_solr_hyrax_ns.csv")
  ).done(function(local, nc, ns) {
    var chart = new CanvasJS.Chart(
      "finalCollectionComparison",
      combined_results([
        { label: "With commits", data: local[0] },
        { label: "Without commits", data: nc[0] },
        { label: "Without suggest", data: ns[0] }
      ])
    );
    chart.render();
  });

  $.when(
    $.get("/fedora-tests/data/postgres_collections_solr_hyrax_ns_100000.csv"),
    $.get("/fedora-tests/data/fedora_collections_solr_hyrax_ns_100000.csv"),
    $.get("/fedora-tests/data/active_fedora_collections_solr_hyrax_ns_100000.csv"),
    $.get("/fedora-tests/data/cho_collections_solr_hyrax_ns_100000.csv")
  ).done(function(postgres, fedora, af, hyrax) {
    var chart = new CanvasJS.Chart(
      "updatedCollectionComparison",
      combined_results([
        { label: "Postgres", data: postgres[0] },
        { label: "Fedora", data: fedora[0] },
        { label: "ActiveFedora", data: af[0] },
        { label: "Hyrax", data: hyrax[0] }
      ])
    );
    chart.render();
  });
}
