window.onload = function() {

  // Individual charts

  $.get("/projects/fedora-tests/data/cho_collections_1000000.csv", function(data) {
    render_individual_chart("cho_collections_1000000", data)
  });

}
