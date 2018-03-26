window.onload = function() {

  // Comparison Charts

  $.when(
    $.get("/projects/fedora-tests/data/postgres_collections_solr_hyrax_ns_100000.csv"),
    $.get("/projects/fedora-tests/data/fedora_collections_solr_hyrax_ns_100000.csv"),
    $.get("/projects/fedora-tests/data/active_fedora_collections_solr_hyrax_ns_100000.csv"),
    $.get("/projects/fedora-tests/data/active_fedora_collections_superior_100000.csv")
  ).done(function(postgres, fedora, af, lake) {
    var chart = new CanvasJS.Chart(
      "lakeSuperiorComparison",
      combined_results([
        { label: "Postgres", data: postgres[0] },
        { label: "Fedora", data: fedora[0] },
        { label: "ActiveFedora", data: af[0] },
        { label: "Lake Superior", data: lake[0] }
      ])
    );
    chart.render();
  });

}
