$('#top-nav .menu-btn').click(function(){
  $('body').addClass('menu-open');
});

$('.overlay').click(function(){
  $('body').removeClass('menu-open');
});

$(document).ready(function(){

  if ("geolocation" in navigator) {

    navigator.geolocation.getCurrentPosition(function(position) {

    var convertCoords = "https://www.delijn.be/rise-api-core/coordinaten/convert/"+ position.coords.latitude+"/"+position.coords.longitude;

      $.ajax({
        method: "GET",
        url: convertCoords,
        datatype: "application/json"
      }).done(function(data){
        var xCoordinaat = data["xCoordinaat"];
        var yCoordinaat = data["yCoordinaat"];

        getHaltesInDeBuurt(xCoordinaat, yCoordinaat);

      }).fail(function(){
        console.log("call failed.");
      });

    });
  }

$("#knop").on("click", getDoorkomendeLijnenForHalte);

$("#haltes").on('click', '.liveDoorkomstenBtn',getLiveDoorkomsten);

});


var getDoorkomendeLijnenForHalte = function(){

  $("#lijst").html("");
  var halte = $("#tekstvak").val();

  $.ajax({
    method: "GET",
    url: "https://www.delijn.be/rise-api-core/haltes/doorkomendelijnen/" + halte,
    datatype: "application/json"
  }).done(function(data){
    for (var i = 0; i<data.length;i++){
      var bestemming = data[i]["bestemming"];
      var lijntype = data[i]["lijnType"];
      var lijnnummer = data[i]["lijnNummerPubliek"];
      $("#lijst").append('<li>'+ lijnnummer + '-' + bestemming + ': ' + lijntype +'</li>')
    }
  }).fail(function(){
    console.log("call failed.");
  });
}



var getHaltesInDeBuurt = function(xCoordinaat, yCoordinaat){

  var straal = 300;
  //$("#straal").append(" " + straal + "m:");
  var inDeBuurt = "https://www.delijn.be/rise-api-core/haltes/indebuurt/"+ xCoordinaat + "/" + yCoordinaat + "/" + straal;

  $.ajax({
    method: "GET",
    url: inDeBuurt,
    datatype: "application/json"
  }).done(function(data){
      for (var i=0; i<data.length;i++){
        var halte = data[i];
        var lijnen = halte["lijnen"];
        var haltenummer = halte["halteNummer"];
        var omschrijvingLang = halte["omschrijvingLang"];
        $("#haltesInDeBuurt").append('<li>Halte: '+haltenummer+': '+omschrijvingLang+' <button data-omschrijving="' + omschrijvingLang +'" data-halte="' + haltenummer +'" class="liveDoorkomstenBtn">Bekijk live doorkomsten</button><ol id="'+haltenummer+'"></ol></li>');
        for (var j=0;j<lijnen.length;j++){
          var bestemming = lijnen[j]["bestemming"];
          var lijnNummer = lijnen[j]["lijnNummer"];
          //$("#"+haltenummer).append('<li class="lijnen">Lijn '+lijnNummer+': ' + bestemming + '</li>');
        }

      }

  }).fail(function(){
    console.log("call failed.");
  });
}

var getLiveDoorkomsten = function(){
  $("#live-lijst").html("");

  var halteNummer = $(this).attr("data-halte");
  var omschrijving = $(this).attr("data-omschrijving");
  var amount = 5;

  var url = "https://www.delijn.be/rise-api-core/haltes/vertrekken/"+halteNummer+"/"+amount;

  $("#h1-live").html('Live doorkomsten ' + halteNummer +': ' + omschrijving);

  $.ajax({
    method: "GET",
    url:url,
    datatype: "application/json"
  }).done(function(data){
    $("#h1-live").append(' ' + data["huidigeDag"] + ' ' + data["huidigeTijd"]);
    var lijnen = data["lijnen"];
    for (var i=0;i<lijnen.length;i++){
      var lijnNummer = lijnen[i]["lijnNummer"];
      var lijnRichting = lijnen[i]["lijnRichting"];
      var lijnType = lijnen[i]["lijnType"];
      var vertrektijd = lijnen[i]["vertrekTijd"];
      $("#live-lijst").append('<li>'+lijnNummer+ ' '+ lijnType +' richting: ' + lijnRichting + ' vertrekTijd: ' + vertrektijd+'</li>');
    }

  }).fail(function(){
    console.log("call failed.");
  });
}
