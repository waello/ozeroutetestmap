let infoWindow: google.maps.InfoWindow;

function initMap(): void {
  /** mes propo comme meeting point Based on Uber system + me */
  var locations = [
    [
      'Dépose Minute Departures - Terminal 2A',
      49.0030499,
      2.5619835,
      'turquoise',
    ],
    [
      'Express Pickup 2B-2D / Parking Pro AB - Terminal 2B',
      49.0036482,
      2.5637822,
      'turquoise',
      -10,
      20,
    ],
    [
      'depose Minute Terminal 3',
      49.01340244496135,
      2.559901938900744,
      'turquoise',
      23,
      -3,
    ],
    [
      'depose Minute Terminal 1',
      49.014256065890955,
      2.540438489271546,
      'turquoise',
      23,
      -3,
    ],
    [
      'Car Drop-Off Area (by Parking 1) - paris beauvais',
      49.4603336,
      2.1119917,
      'turquoise',
      23,
      -3,
    ],
    [
      'RER Marne la Vallée - disneyLAnd',
      48.870709,
      2.783397,
      'turquoise',
      37,
      -3,
    ],
    [
      ' Orly Terminal 3 - Exit 18a - Parking Pro',
      48.728634,
      2.360249,
      'turquoise',
      37,
      -3,
    ],
  ];

  const map = new google.maps.Map(
    document.getElementById('map') as HTMLElement,
    {
      center: { lat: 48.3408418, lng: 3.7367867 },
      zoom: 7,
      mapTypeControl: false,
    }
  );
  var makrker, i;
  for (i = 0; i < locations.length; i++) {
    makrker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map,
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    });

    google.maps.event.addListener(
      makrker,
      'click',
      (function (makrker, i) {
        return function () {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, makrker);
        };
      })(makrker, i)
    );
  }

  const card = document.getElementById('pac-card') as HTMLElement;
  const input = document.getElementById('pac-input') as HTMLInputElement;
  const biasInputElement = document.getElementById(
    'use-location-bias'
  ) as HTMLInputElement;
  const strictBoundsInputElement = document.getElementById(
    'use-strict-bounds'
  ) as HTMLInputElement;
  const options = {
    fields: ['formatted_address', 'geometry', 'name'],
    strictBounds: false,
    types: ['establishment'],
  };

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

  const autocomplete = new google.maps.places.Autocomplete(input, options);

  autocomplete.bindTo('bounds', map);

  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById(
    'infowindow-content'
  ) as HTMLElement;

  infowindow.setContent(infowindowContent);
  const markerLocation = new google.maps.Marker({
    draggable: false,

    map,
    anchorPoint: new google.maps.Point(0, -29),
  });
  const marker = new google.maps.Marker({
    draggable: true,

    map,
    anchorPoint: new google.maps.Point(0, -29),
  });
  const geocoder = new google.maps.Geocoder();

  autocomplete.addListener('place_changed', () => {
    infowindow.close();
    marker.setVisible(false);

    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-address'].textContent =
      place.formatted_address;
    infowindow.open(map, marker);
  });

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  /** function setupClickListener(id, types) {
    const radioButton = document.getElementById(id) as HTMLInputElement;

    radioButton.addEventListener('click', () => {
      autocomplete.setTypes(types);
      input.value = '';
    });
  }

  setupClickListener('changetype-all', []);
  setupClickListener('changetype-address', ['address']);
  setupClickListener('changetype-establishment', ['establishment']);
  setupClickListener('changetype-geocode', ['geocode']);
  setupClickListener('changetype-cities', ['(cities)']);
  setupClickListener('changetype-regions', ['(regions)']);

  biasInputElement.addEventListener('change', () => {
    if (biasInputElement.checked) {
      autocomplete.bindTo('bounds', map);
    } else {
      // User wants to turn off location bias, so three things need to happen:
      // 1. Unbind from map
      // 2. Reset the bounds to whole world
      // 3. Uncheck the strict bounds checkbox UI (which also disables strict bounds)
      autocomplete.unbind('bounds');
      autocomplete.setBounds({ east: 180, west: -180, north: 90, south: -90 });
      strictBoundsInputElement.checked = biasInputElement.checked;
    }

    input.value = '';
  });

  strictBoundsInputElement.addEventListener('change', () => {
    autocomplete.setOptions({
      strictBounds: strictBoundsInputElement.checked,
    });

    if (strictBoundsInputElement.checked) {
      biasInputElement.checked = strictBoundsInputElement.checked;
      autocomplete.bindTo('bounds', map);
    }

    input.value = '';
  });**/
  async function geocodePosition(pos) {
    var gt = await geocoder.geocode(
      {
        latLng: pos,
      },
      function (responses) {
        if (responses && responses.length > 0) {
          var p = responses[0].formatted_address;
          return p;
        } else {
          return 'error';
        }
      }
    );
    console.log(gt['results'][0].formatted_address);
    console.log('employee');

    return gt['results'][0].formatted_address;
  }
  function sd() {
    let address = '';
    geocodePosition(marker.getPosition()).then((employee) =>
      infowindow.setContent(employee)
    );
    geocodePosition(marker.getPosition()).then(
      (employee) => (document.getElementById('adddress').innerHTML = employee)
    );
    infowindow.open(map, marker);

    document.getElementById('Latitude').innerHTML = marker.position.lat();
    document.getElementById('longitude').innerHTML = marker.position.lng();
  }
  getCurrentPosition(map, infoWindow);

  marker.addListener('dragend', sd);
  marker.addListener('click', toggleBounce);
  function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      const infowindow = new google.maps.InfoWindow();

      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }
}
function getCurrentPosition(map, infoWindow) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        var NewLatLng = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        const markerLocation = new google.maps.Marker({
          draggable: false,

          map,
          anchorPoint: new google.maps.Point(0, -29),
        });
        document.getElementById('adddress').innerHTML = position.coords.speed;
        document.getElementById('Latitude').innerHTML =
          position.coords.latitude;
        document.getElementById('longitude').innerHTML =
          position.coords.longitude;
        markerLocation.setPosition(NewLatLng);
        markerLocation.setVisible(true);
        console.log(position.coords.accuracy);
        console.log(position.coords.heading);

        console.log('Location found.');
        map.setCenter(pos);
        setTimeout(getCurrentPosition(map, infoWindow), 10000);
      },
      function () {
        handleLocationError(true, infoWindow, map.getCenter());
        interval;
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(
  browserHasGeolocation: boolean,
  infoWindow: google.maps.InfoWindow,
  pos: google.maps.LatLng
) {
  print('error');
}
declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
