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

}
