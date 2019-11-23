// If you're adding a number of markers, you may want to drop them on the map
// consecutively rather than all at once. This example shows how to use
// window.setTimeout() to space your markers' animation.

var neighborhoods = [
    [{lat:48.1321294, lng:11.5687666}, '123 Tiki Tiki'],
    [{lat:48.1347542, lng:11.5752273}, 'Alpenwahn'],
    [{lat:48.1368557, lng:11.5798778}, 'Bar Centrale'],
    [{lat:48.1408436, lng:11.5763276}, 'Bar Comercial'],
    [{lat:48.1363703, lng:11.5788538}, 'Bar Elf'],
    [{lat:48.1379087, lng:11.5839833}, 'Bar Muenchen'],
    [{lat:48.1372632, lng:11.5789645}, 'Bar Restaurant Lux'],
    [{lat:48.1394553, lng:11.5726854}, 'Bar Tabacco'],
    [{lat:48.1321814, lng:11.5716826}, 'Bar zur Feuerwache'],
    [{lat:48.1373298, lng:11.5808198}, 'Bar31 (Mandarin Oriental)'],
    [{lat:48.1347027, lng:11.5739963}, 'Baricentro'],
    [{lat:48.1404519, lng:11.5745053}, 'Barista'],
    [{lat:48.1313472, lng:11.5691136}, 'Bavaria 2'],
    [{lat:48.1312343, lng:11.5683609}, 'Beverly Kills'],
    [{lat:48.1368262, lng:11.5656821}, 'Bikini Mitte'],
    [{lat:48.1404239, lng:11.5730494}, 'Blue Spa Bar & Lounge'],
    [{lat:48.1420514, lng:11.5749908}, 'Brasserie OskarMaria'],
    [{lat:48.141287, lng:11.572228}, 'Burger & Lobster Bank'],
    [{lat:48.1363887, lng:11.5653808}, 'Cafe Cord'],
    [{lat:48.1369979, lng:11.5748134}, 'Cafe Glockenspiel'],
    [{lat:48.1409219, lng:11.5748858}, 'Café Kunsthalle'],
    [{lat:48.1373298, lng:11.5808198}, 'China Moon Roof Terrace'],
    [{lat:48.1382889, lng:11.5657954}, 'City Lounge'],
    [{lat:48.1388991, lng:11.5835933}, 'Cohibar City'],
    [{lat:48.13604, lng:11.57161}, 'Cole & Porter in der Hofstatt'],
    [{lat:48.1339844, lng:11.5754337}, 'Colibri'],
    [{lat:48.1368179, lng:11.5794554}, 'Cortiina Bar & Restaurant'],
    [{lat:48.1384677, lng:11.5773708}, 'Dallmayr Bar & Grill'],
    [{lat:48.1370846, lng:11.5803325}, 'Das Griabig'],
    [{lat:48.1382889, lng:11.5657954}, 'Das Labor'],
    [{lat:48.1341267, lng:11.5761786}, 'Di Rosa 2 Bar'],
    [{lat:48.1343682, lng:11.578127}, 'Easy Tiger'],
    [{lat:48.1404254, lng:11.573056}, 'Falks Bar'],
    [{lat:48.1367271, lng:11.5683953}, 'Favorit Bar'],
    [{lat:48.14387, lng:11.57866}, 'Filmcasino'],
    [{lat:48.1414477, lng:11.5778316}, 'Frank Weinbar'],
    [{lat:48.143243, lng:11.5751323}, 'Gamsbar'],
    [{lat:48.134045, lng:11.5752439}, 'Garçon'],
    [{lat:48.1326213, lng:11.57301}, 'Goldener Reiter'],
    [{lat:48.1368179, lng:11.5794554}, 'Grapes Weinbar'],
    [{lat:48.1336153, lng:11.5689967}, 'Gspusi'],
    [{lat:48.1397292, lng:11.5737027}, 'Hugos Pizza Bar Lounge'],
    [{lat:48.1361035, lng:11.5830174}, 'Havana Club'],
    [{lat:48.1358358, lng:11.5777325}, 'Heiliggeist 1 Bar'],
    [{lat:48.1380358, lng:11.5723208}, 'Hirmer Tagesbar'],
    [{lat:48.1348951, lng:11.5738439}, 'Hoiz Weinbistro'],
    [{lat:48.1354479, lng:11.5672591}, 'Jaded Monkey'],
    [{lat:48.1339844, lng:11.5754337}, 'Kays Bistro'],
    [{lat:48.1341489, lng:11.5670761}, 'Kennedys'],
    [{lat:48.1386744, lng:11.5747577}, 'Kilians Irish Pub'],
    ];
    
    var markers = [];
    var map;
    var directionsService;
    var directionsRenderer;
    var selectedWaypoints = [];
    var startingPoint = 'Marienplatz, München';
    var travelM = 'WALKING';
    var cat = '';
    
    function initMap() {
      console.log("Datafile", data["Kirchen"]);
      directionsService = new google.maps.DirectionsService(); //initiate directionService
      directionsRenderer = new google.maps.DirectionsRenderer(); //initiate directionRenderer
      map = new google.maps.Map(document.getElementById('map'), {  //Set Center of View
        zoom: 15,
        center: {lat: 48.1370339, lng: 11.5758134}
      });
    }

function initMarkers(datasheet) {
  clearMarkers();
  selectedWaypoints = [];

  for (var i = 0; i < datasheet.length; i++) {
    addMarker(datasheet[i][0],datasheet[i][1],i);
  }
}

function createRoute(){
  clearMarkers();
  var resp;
  var request = {
      origin: startingPoint,
      destination: startingPoint,
      provideRouteAlternatives: false,
      travelMode: travelM,
      optimizeWaypoints: true,
      waypoints: selectedWaypoints,
      unitSystem: google.maps.UnitSystem.METRIC
    };
  console.log("Ausgewählte Waypoints: ",request);
  directionsRenderer.setMap(map);

  directionsService.route(request, function(response, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
        var route = response.routes[0];
        resp=response;
        console.log("Antwort: ",response);
        computeTotalDuration(resp);
        
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
}
    
function markerclicked(coord,i){
    markers[i].setAnimation(google.maps.Animation.BOUNCE);
    selectedWaypoints.push({location: coord, stopover: false});
    console.log("Ausgewählte Waypoints: ",selectedWaypoints);
}

function computeTotalDuration(result) {
    var total = 0;
    console.log("Result: "+result);
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].duration.value;
    }
    total = total / 60;
    document.getElementById("duration").innerHTML = Math.round(total)+' min';
}
    
function addMarker(position, title, i) {
  markers.push(new google.maps.Marker({
    position: position,
    animation: google.maps.Animation.DROP,
    map: map,
    title: title
  }));
  markers[markers.length-1].addListener('click', function() {
        markerclicked(position,i);
  });
}
    
function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function arrayRemove(arr, value) {
  return arr.filter(function(ele){
      return ele != value;
  });
}
    
// On-CLick Events
$(document).ready(function() {
  $('#submit').on('click', function() {

    var name = $('#start').val();

    // Check if empty of not
    if (name  === '') {
        alert('Text-field is empty.');
        return false;
    } else {
      startingPoint = name + ",Munich";
      console.log("Pressed On Click with Waypoints: ",selectedWaypoints);
      createRoute();
    }
  })
});

$(".movement").on('click', function(event){
  console.log("Movement geklickt ",$(this).attr('id'));
  travelM = $(this).attr('id');
  $('#movements').text($(this).text());
});

$(".category").on('click', function(event){
  console.log("Kategorie geklickt ",$(this).attr('id'));
  $('#category').text($(this).text());
  initMarkers(data[$(this).text()]);
});