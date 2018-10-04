window.onload = function() {

  // Comparison Charts

  $.when(
    $.get("/projects/fedora-tests/data/cho_collections_1000000_solr5.csv"),
    $.get("/projects/fedora-tests/data/cho_collections_1000000_solr7.csv")
  ).done(function(solr_5, solr_7) {
    var chart = new CanvasJS.Chart(
      "collectionComparison",
      combined_results([
        { label: "Solr 5", data: solr_5[0] },
        { label: "Solr 7", data: solr_7[0] }
      ])
    );
    chart.render();
  });

  $.when(
    $.get("/projects/fedora-tests/data/postgres_collections_solr_hyrax_ns_100000.csv"),
    $.get("/projects/fedora-tests/data/cho_metrics_collection_100000_mvp3.csv")
  ).done(function(valkyrie, cho) {
    var chart = new CanvasJS.Chart(
      "choComparison",
      combined_results([
        { label: "Valkyrie", data: valkyrie[0] },
        { label: "CHO MVP 3", data: cho[0] }
      ])
    );
    chart.render();
  });

}
