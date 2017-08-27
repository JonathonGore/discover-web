function initialize() {
  handler = Gmaps.build('Google');
  handler.buildMap({
      // pass in Google Maps API options in the provider object here
      provider: {
        //disableDefaultUI: true

        // Makes it so the map is not zoomed in so much with only a single marker
        maxZoom: 16,

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

      // Add markers to map
      // Eventually make a request to backend to fetch markers
      markers = handler.addMarkers([
        {
          "lat": 43.471035,
          "lng": -80.544545,
          "infowindow": "hello!"
        }
      ]);

      // Check to see if browser has geo support, then plot users position
      if(navigator.geolocation) {
        // If there is geo support at the position and display on map
        navigator.geolocation.getCurrentPosition(displayOnMap);
      } else {
        // Otherwise fit the zoom the markers populated on the map
        handler.bounds.extendWith(markers);
        handler.fitMapToBounds();
      }
    }
  );

  // Adds users location and centers on it on the map
  function displayOnMap(position){
    var marker = handler.addMarker({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
    handler.map.centerOn(marker);
  };
}
