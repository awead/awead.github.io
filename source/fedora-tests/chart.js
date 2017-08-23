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

  function render_individual_chart(selector, data) {
    var chart = new CanvasJS.Chart(selector, individual_results(data));
    chart.render();
  }

  function combined_results(data) {
    var result = {
      axisX: { title: "Works", labelFontSize: 14, titleFontSize: 20 },
      axisY: { title: "Time (sec)", labelFontSize: 14, titleFontSize: 20 },
      zoomEnabled: true,
      data: []
    };

    for (var key in data) {
      result.data.push(
        {
          type: "line",
          showInLegend: true,
          name: data[key].label,
          dataPoints: getDataPointsFromCSV(data[key].data, 3)
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
}
