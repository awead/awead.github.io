$(document).ready(function() {

  $("#ead-toggle").on("click", function(action) {

    if ($(".orig")[0]){
      flattenEad();
    }
    else {
      indentEad();
    }

  });

});

$(document).on("click", ".alt", altToggle);  
$(document).on("click", "#sample-search-button", searchResults);
$(document).on("click", "fa-inventory", showFirst);
$(document).on("click", "#show-ref1", toggleFirst);
$(document).on("click", "#hide-ref1", toggleFirst);
$(document).on("click", "#show-ref2", toggleSecond);
$(document).on("click", "#hide-ref2", toggleSecond);
$(document).on("click", "#show-ref3", toggleThird);
$(document).on("click", "#hide-ref3", toggleThird);
$(document).on("click", "#show-ref4", toggleFourth);
$(document).on("click", "#hide-ref4", toggleFourth);
$(document).on("click", "#show-ref5", toggleFifth);
$(document).on("click", "#hide-ref5", toggleFifth);



function flattenEad() {
  var flat = '<p class="alt"><span class="fade">Series I: Artist Files</span><span class="hidden code">{ :title => "Series I: Artist Files" }</span></p>'
           + '<p class="alt"><span class="bold">Aerosmith</span><span class="hidden code">{ :title => "Aerosmith", :parents => ["Series I: Artist Files"] }</span></p>'
           + '<p class="alt"><span class="bold">Dylan, Bob</span><span class="hidden code">{ :title => "Dylan, Bob", :parents => ["Series I: Artist Files"] }</span></p>'
           + '<p class="alt"><span class="fade">Series VII: Audiovisual Materials </span><span class="hidden code">{ :title => "Series VII: Audiovisual Materials " }</span></p>'
           + '<p class="alt"><span class="fade">Subseries 1: Audio</span><span class="hidden code">{ :title => "Subseries 1: Audio", :parents => ["Series VII: Audiovisual Materials "] }</span></p>'
           + '<p class="alt"><span class="bold">Bowie, David</span><span class="hidden code">{ :title => "Bowie, David", :parents => ["Series VII: Audiovisual Materials ", "Subseries 1: Audio"] }</span></p>'
           + '<p class="alt"><span class="fade">Subseries 2: Video</span><span class="hidden code">{ :title => "Subseries 2: Video", :parents => ["Series VII: Audiovisual Materials "] }</span></p>'
           + '<p class="alt"><span class="bold">Van Halen</span><span class="hidden code">{ :title => "Van Halen", :parents => ["Series VII: Audiovisual Materials ", "Subseries 2: Video"] }</span></p>';
  
  $('#ead').html(flat);
  $('#ead').removeClass('orig');
};

function indentEad() {

  var orig = '<ul class="folder"><li>Series I: Artist Files<ul><li>Aerosmith</li><li>Dylan, Bob</li></ul></li><li>Series VII: Audiovisual Materials <ul class="folder"><li>Subseries 1: Audio<ul><li>Bowie, David</li></ul></li><li>Subseries 2: Video<ul><li>Van Halen</li></ul></li></ul></li></ul>';
  $('#ead').html(orig);
  $('#ead').addClass('orig');

};

function altToggle() {
  $(this).find('span').toggleClass('hidden');
}

function searchResults() {
  $("#search-results").toggleClass("hidden")
}

function showFirst () {
  var content = "<h3>Series I: Artist Files</h3><h3>Series VII: Audiovisual Materials </h3>"
}

function toggleFirst () {
  $("div#ref1").toggleClass("hidden");
  $("i#hide-ref1").toggleClass("hidden");
  $("i#show-ref1").toggleClass("hidden");
}

function toggleSecond () {
  $("div#ref2").toggleClass("hidden");
  $("i#hide-ref2").toggleClass("hidden");
  $("i#show-ref2").toggleClass("hidden");
}

function toggleThird () {
  $("div#ref3").toggleClass("hidden");
  $("i#hide-ref3").toggleClass("hidden");
  $("i#show-ref3").toggleClass("hidden");
}

function toggleFourth () {
  $("div#ref4").toggleClass("hidden");
  $("i#hide-ref4").toggleClass("hidden");
  $("i#show-ref4").toggleClass("hidden");
}

function toggleFifth () {
  $("div#ref5").toggleClass("hidden");
  $("i#hide-ref5").toggleClass("hidden");
  $("i#show-ref5").toggleClass("hidden");
}



