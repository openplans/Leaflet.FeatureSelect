/*globals L */

(function() {
  var map = new L.map('map'),
      layerUrl = 'http://{s}.tiles.mapbox.com/v3/atogle.map-vo4oycva/{z}/{x}/{y}.png',
      layerAttribution = 'Map data &copy; OpenStreetMap contributors, CC-BY-SA <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>',
      layer = new L.TileLayer(layerUrl, {maxZoom: 19, attribution: layerAttribution, subdomains: 'abcd'}),

      data = {"type": "FeatureCollection", "features": [{"type": "Feature", "properties": {}, "geometry": {"type": "Polygon", "coordinates": [[[-75.1727271080017, 39.95036204091233 ], [-75.17305970191956, 39.94885689751962 ], [-75.1710855960846, 39.94858547469472 ], [-75.17072081565857, 39.950107073596506 ], [-75.1727271080017, 39.95036204091233 ] ] ] } }, {"type": "Feature", "properties": {}, "geometry": {"type": "LineString", "coordinates": [[-75.1638650894165, 39.951562841944174 ], [-75.1655387878418, 39.94360097316576 ] ] } }, {"type": "Feature", "properties": {}, "geometry": {"type": "Point", "coordinates": [-75.16995906829834, 39.95320774064685 ] } } ] },
      defaultStyle = {
        opacity: 0.7,
        weight: 3,
        color: '#4575b4',
        radius: 10
      },
      selectStyle = {
        opacity: 0.9,
        weight: 3,
        color: '#ffff00',
        radius: 10
      },

      geojson = L.geoJson(data, {
        style: function() { return defaultStyle; },
        pointToLayer: function(geojson, latLng) {
          return L.circleMarker(latLng, defaultStyle);
        }
      }),
      featureSelect = L.featureSelect({
        featureGroup: geojson,
        selectSize: [16, 16]
      });

  map.setView([39.952385, -75.163651], 16).addLayer(layer);

  geojson.addTo(map);

  featureSelect.addTo(map);

  function setStyle(layers, style) {
    var i;
    for (i=0; i<layers.length; i++) {
      layers[i].setStyle(style);
    }
  }


  featureSelect.on('select', function(evt) {
    console.log(evt);
    setStyle(evt.layers, selectStyle);
  });

  featureSelect.on('unselect', function(evt) {
    console.log(evt);
    setStyle(evt.layers, defaultStyle);

  });


}());
