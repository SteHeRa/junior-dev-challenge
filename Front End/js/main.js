var map;
function addPinsOnMap(latLongs) {
  var myIcon = L.divIcon({
    html: '<img height="50px" width="50px" src="pictures/pin.png"></img>',
  });
  for (var i = 0; i < latLongs.length; i++) {
    var marker2 = L.marker([latLongs[i].lat, latLongs[i].lon], {
      icon: myIcon,
    }).addTo(map);
    marker2.bindPopup(`
				Client Name: ${latLongs[i].name} <br>
				`);
    marker2.on('mouseover', function () {
      this.openPopup();
    });
    marker2.on('click', function (e) {
      const clientLatLng = this.getLatLng();
      window.location.href = `http://localhost:3000/client?lat=${clientLatLng.lat}&lng=${clientLatLng.lng}`;
    });
  }
}
$(document).ready(function () {
  map = new L.Map('map', { zoom: 15 });

  // create the tile layer with correct attribution
  var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib =
    'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  var osm = new L.TileLayer(
    'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      minZoom: 2,
      maxZoom: 20,
      maxNativeZoom: 17,
    }
  );
  (async () => {
    map.setView(new L.LatLng(52.482793, -1.885955), 11);
    map.addLayer(osm);
    map.invalidateSize();
    const clients = await fetch('http://localhost:3000/clients').then((res) =>
      res.json()
    );
    addPinsOnMap(clients);
  })();
});
