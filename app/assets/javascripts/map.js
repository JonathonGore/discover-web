// Global coordinates var used for users location
var coords;
var map;
var errorPrompt = "<strong>Error: </strong>"

function addMarker(coords, name) {
  var locationMarker = new google.maps.Marker({
    position: new google.maps.LatLng(parseFloat(coords.lat), parseFloat(coords.lng)),
    map: map
  });
}

/* Populates the form dialog for creating a new event with initial data,
 * like coordinates.
 */
function populateCreateEventForm() {
  $("#latitude").val(coords.lat);
  $("#longitude").val(coords.lng);
}

/* Consumes an array of data representing the data from a
 * create event form and validates it returning a list of errors
 * (if any).
 */
function validateData(data) {
  var errors = [];
  // Ensure the name field is not blank
  if(data["name"] === "") {
    errors.push("Name cannot be blank");
  }
  return errors;
}

/**
 * prepareDate consumes value from the form from creating a
 * new event and validates and returns a completed object and a list
 * of errors if any.
 */
function prepareData(formArray) {
    // The values we want to keep
    var values = ["name", "endDate", "startDate", "latitude", "longitude"];

    // The array to return
    var tempArray = {};
    for (var i = 0; i < formArray.length; i++){
      tempArray[formArray[i]['name']] = formArray[i]['value'];
    }

    var returnArray = {};
    for (var j = 0; j < values.length; j++){
        returnArray[values[j]] = tempArray[values[j]];
    }
    return returnArray;
}

/**
 * The CenterControl adds a control to the map that recenters the map on
 * Chicago.
 * This constructor takes the control DIV as an argument.
 * @constructor
 */
function CenterControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '3px solid #fff';
  controlUI.style.borderRadius = '1px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginRight = '10px';
  controlUI.style.height = '26px';
  controlUI.style.width = '28px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = '<i class="fa fa-location-arrow map-icon" aria-hidden="true"></i>';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function() {
    // Center in on and then zoom in on position
    map.setCenter(coords);
    map.setZoom(16);
  });

}

/**
 * The EventControl adds a control to the map that makes a request to Discover
 * backend to create a new event.
 * This constructor takes the control DIV as an argument.
 * @constructor
 */
function EventControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.style.margin = '10px'
  controlUI.title = 'Click to create event';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = '<div class="map-icon"> New Event </div>';
  controlUI.appendChild(controlText);

  controlUI.addEventListener('click', function() {

    // Populates the create event form with initial information
    populateCreateEventForm();
    $("#new-event").removeClass("hidden");
    /*
      add logic here for creating event
    */
  });
}

function initialize() {
  coords = {lat: 43.471035, lng: -80.544545};

  // Check to see if browser has geo support, then plot users position
  if(navigator.geolocation) {
    // If there is geo support at the position and display on map
    navigator.geolocation.getCurrentPosition(displayOnMap);
  }

  // Adds users location and centers on it on the map
  function displayOnMap(position){
    coords.lat = position.coords.latitude;
    coords.lng = position.coords.longitude;

    var image = 'https://www.robotwoods.com/dev/misc/bluecircle.png';
    var locationMarker = new google.maps.Marker({
      position: {lat: coords.lat, lng: coords.lng},
      map: map,
      icon: image
    });
    // Having init map here will block and wait for the users location
    //initMap();
  };
  initMap();
}

function initMap() {

  handler = Gmaps.build('Google');
  handler.buildMap({
      // pass in Google Maps API options in the provider object here
      provider: {
        //disableDefaultUI: true

        // Makes it so the map is not zoomed in so much with only a single marker
        maxZoom: 16,

        // Set the default center of the map
        center: new google.maps.LatLng(coords.lat, coords.lng),

        // Removes the street view option
        streetViewControl: false,

        // Removes fullscreen control
        fullscreenControl: false,

        // Removes the map view controls (satelite/terrain)
        mapTypeControl: false
      },
      // Link to the containing div
      internal: {
        id: 'map'
      }
    },
    function(){

      // Check to see if browser has geo support, then plot users position
      if(!navigator.geolocation) {
        // Otherwise fit the zoom the markers populated on the map
        handler.bounds.extendWith(markers);
        handler.fitMapToBounds();
      }

      // Add markers to map
      // Eventually make a request to backend to fetch markers
      marker = handler.addMarker(
        {
          "lat": coords.lat,
          "lng": coords.lng,
          "infowindow": "hello!"
        }
      );
      handler.map.centerOn(marker);
    }
  );

  // Assign the map service object once initialized to map variable
  map = handler.map.serviceObject;

  // Create an event listener for getting coordinate from click
  google.maps.event.addListener(map, 'click', function(event) {
    //alert(event.latLng);  // in event.latLng  you have the coordinates of click
    $("#latitude").val(event.latLng.lat());
    $("#longitude").val(event.latLng.lng());
  });

  // Listener for cancel button on new event form
  $("#event-cancel").click(function() {
    // Hide the form on cancel
    $("#new-event").addClass("hidden");
  });

  // Create the DIV to hold the control and call the CenterControl()
  // constructor passing in this DIV.
  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);

  // Create the DIV to hold the add event button, then create the control
  var eventControlDiv = document.createElement('div');
  var eventControl = new EventControl(eventControlDiv, map);

  // Make the buttons visible on the map
  eventControlDiv.index = 1;
  centerControlDiv.index = 1;

  // Add the buttons to the map
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(eventControlDiv);
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);

  // Add action for when the form is submitted
  $('#form').submit(function() {
    // Take values from form and create object
    var formArray = $(this).serializeArray();
    var returnArray = prepareData(formArray);

    // Next validate data
    var errors = validateData(returnArray);
    // Get the amount of errors
    var amt = errors.length;
    // If the size of errors array is non-zero we cannot go ahead an submit
    // Instead we must display errors
    if(amt === 0) {
      // hide errors div
      $("#map-errors").addClass("hidden");
      // Close dialog
      $("#new-event").addClass("hidden");
      // Create new marker at the location
      addMarker({lat: returnArray["latitude"], lng: returnArray["longitude"]}, returnArray["name"]);

      // Post to backend
      $.ajax({
          type: "POST",
          url: $(this).attr('action'), //sumbits it to the given url of the form
          data: JSON.stringify(returnArray)
      }).success(function(json){
          // Probably want to do something different
          console.log("success", json);
      }).error(function (xhr) {
        // handle error
        console.log("error");
      });
    } else {
      // Here we have errors so display them

      // Clear existing errors
      $("#map-errors").html("");
      // Append new errors
      for(var i = 0; i < errors.length; i++) {
        $("#map-errors").append(errorPrompt + errors[i]);
      }
      // Unhide errors div
      $("#map-errors").removeClass("hidden");
    }



    return false; // prevents normal behaviour
  });
}
