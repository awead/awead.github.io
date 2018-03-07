window.onload = function() {

  // Individual charts

  $.get("/projects/fedora-tests/data/postgres_nested_collections_10000.csv", function(data) {
    render_individual_chart("postgres_nested_collections_10000", data)
  });

  $.get("/projects/fedora-tests/data/fedora_nested_collections_10000.csv", function(data) {
    render_individual_chart("fedora_nested_collections_10000", data)
  });

  $.get("/projects/fedora-tests/data/fedora_collections_10000.csv", function(data) {
    render_individual_chart("fedora_collections_10000", data)
  });

  // Request charts

  $.get("/projects/fedora-tests/data/local_active_fedora_collections_25000_fedora_post.csv", function(data) {
    render_request_chart("local_active_fedora_collections_25000_fedora_post", data)
  });

  $.get("/projects/fedora-tests/data/local_active_fedora_collections_25000_fedora_get.csv", function(data) {
    render_request_chart("local_active_fedora_collections_25000_fedora_get", data)
  });

  // Comparison Charts

  $.when(
    $.get("/projects/fedora-tests/data/postgres_collections_100000.csv"),
    $.get("/projects/fedora-tests/data/fedora_collections_100000.csv"),
    $.get("/projects/fedora-tests/data/active_fedora_collections_100000.csv"),
    $.get("/projects/fedora-tests/data/cho_collections_100000.csv")
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
    $.get("/projects/fedora-tests/data/postgres_nested_collections_1000.csv"),
    $.get("/projects/fedora-tests/data/fedora_nested_collections_1000.csv"),
    $.get("/projects/fedora-tests/data/active_fedora_nested_collections_1000.csv"),
    $.get("/projects/fedora-tests/data/cho_nested_collections_1000.csv")
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
    $.get("/projects/fedora-tests/data/postgres_files_1000.csv"),
    $.get("/projects/fedora-tests/data/fedora_files_1000.csv"),
    $.get("/projects/fedora-tests/data/active_fedora_files_1000.csv"),
    $.get("/projects/fedora-tests/data/cho_files_1000.csv")
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
    $.get("/projects/fedora-tests/data/local_active_fedora_collections_25000_solr_update.csv"),
    $.get("/projects/fedora-tests/data/local_active_fedora_collections_25000_solr_hyrax_update.csv"),
    $.get("/projects/fedora-tests/data/local_active_fedora_collections_25000_solr_hyrax_ns_update.csv")
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
    $.get("/projects/fedora-tests/data/local_active_fedora_collections_25000.csv"),
    $.get("/projects/fedora-tests/data/active_fedora_collections_25000.csv")
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
    $.get("/projects/fedora-tests/data/local_active_fedora_collections_25000.csv"),
    $.get("/projects/fedora-tests/data/local_active_fedora_collections_25000_solr_hyrax_nc.csv"),
    $.get("/projects/fedora-tests/data/local_active_fedora_collections_25000_solr_hyrax_ns.csv")
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
    $.get("/projects/fedora-tests/data/postgres_collections_solr_hyrax_ns_100000.csv"),
    $.get("/projects/fedora-tests/data/fedora_collections_solr_hyrax_ns_100000.csv"),
    $.get("/projects/fedora-tests/data/active_fedora_collections_solr_hyrax_ns_100000.csv"),
    $.get("/projects/fedora-tests/data/cho_collections_solr_hyrax_ns_100000.csv")
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
