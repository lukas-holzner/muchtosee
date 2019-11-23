// If you're adding a number of markers, you may want to drop them on the map
// consecutively rather than all at once. This example shows how to use
// window.setTimeout() to space your markers' animation.
  
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
    addMarker(datasheet[i]['location'],datasheet[i]['name'],i,datasheet[i]['minzeit'],datasheet[i]['maxzeit']);
  }
}

function createRoute(){
  clearMarkers();
  var resp;
  var wayp = []
  selectedWaypoints.forEach(element => {
    wayp.push(element[0]);
  });
  var request = {
      origin: startingPoint,
      destination: startingPoint,
      provideRouteAlternatives: false,
      travelMode: travelM,
      optimizeWaypoints: true,
      waypoints: wayp,
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
    
function markerclicked(coord, i, mintime, maxtime){
    markers[i].setAnimation(google.maps.Animation.BOUNCE);
    selectedWaypoints.push([{location: coord, stopover: false}, mintime, maxtime]);
    console.log("Ausgewählte Waypoints: ",selectedWaypoints);
}

function computeTotalDuration(result) {
    var total = 0;
    var mint = 0;
    var maxt = 0;
    console.log("Result: "+result);
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].duration.value;
    }
    selectedWaypoints.forEach(element => {
      console.log("Waypoint Element: ",element);
      mint += element[1];
      maxt += element[2];
    });
    total = Math.round(total / 60);
    mint += total;
    maxt += total;

    document.getElementById("duration").innerHTML = ' Von '+mint+' bis zu '+maxt+' Minuten je nach Aufenthaltszeit.';
}
    
function addMarker(location, name, i, mintime, maxtime) {
  markers.push(new google.maps.Marker({
    position: location,
    animation: google.maps.Animation.DROP,
    map: map,
    title: name
  }));
  markers[markers.length-1].addListener('click', function() {
        markerclicked(location,i,mintime,maxtime);
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
  if ($(this).text() == "Alle") {
    var custom = []
    for (var index in data) {
      custom = custom.concat(data[index]);
    }
    console.log('Alle: ',custom)
    initMarkers(custom);
  }else{
    initMarkers(data[$(this).text()]);
  }
});
