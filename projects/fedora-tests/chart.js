// Shared functions for rendering charts

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
