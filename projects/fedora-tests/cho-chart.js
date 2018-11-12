window.onload = function() {

  // Comparison Charts

  $.get("/projects/fedora-tests/data/cho_metrics_collection_1000000_mvp4.csv", function(data) {
    render_individual_chart("collectionComparison", data)
  });

  $.when(
    $.get("/projects/fedora-tests/data/cho_metrics_work_100_mvp1.csv"),
    $.get("/projects/fedora-tests/data/cho_metrics_work_100_mvp2.csv"),
    $.get("/projects/fedora-tests/data/cho_metrics_work_100_mvp3.csv"),
    $.get("/projects/fedora-tests/data/cho_metrics_work_100_mvp4.csv")
  ).done(function(mvp1, mvp2, mvp3, mvp4) {
    var chart = new CanvasJS.Chart(
      "workComparison",
      combined_results([
        { label: "CHO 0.1", data: mvp1[0] },
        { label: "CHO 0.2", data: mvp2[0] },
        { label: "CHO 0.3", data: mvp3[0] },
        { label: "CHO 0.4", data: mvp4[0] }
      ])
    );
    chart.render();
  });

  $.when(
    $.get("/projects/fedora-tests/data/postgres_collections_solr_hyrax_ns_100000.csv"),
    $.get("/projects/fedora-tests/data/cho_metrics_collection_100000_mvp1.csv"),
    $.get("/projects/fedora-tests/data/cho_metrics_collection_100000_mvp2.csv"),
    $.get("/projects/fedora-tests/data/cho_metrics_collection_100000_mvp3.csv"),
    $.get("/projects/fedora-tests/data/cho_metrics_collection_100000_mvp4.csv")
  ).done(function(valkyrie, mvp1, mvp2, mvp3, mvp4) {
    var mvpChart = new CanvasJS.Chart(
      "choMVPComparison",
      combined_results([
        { label: "CHO 0.1", data: mvp1[0] },
        { label: "CHO 0.2", data: mvp2[0] },
        { label: "CHO 0.3", data: mvp3[0] },
        { label: "CHO 0.4", data: mvp4[0] },
      ])
    );
    mvpChart.render();

    var currentChart = new CanvasJS.Chart(
      "choCurrentComparison",
      combined_results([
        { label: "Valkyrie", data: valkyrie[0] },
        { label: "CHO 0.4", data: mvp4[0] },
      ])
    );
    currentChart.render();
  });

}
