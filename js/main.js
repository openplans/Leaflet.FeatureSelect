/*globals L */

(function() {
  var map = new L.map('map'),
      layerUrl = 'http://{s}.tiles.mapbox.com/v3/atogle.map-vo4oycva/{z}/{x}/{y}.png',
      layerAttribution = 'Map data &copy; OpenStreetMap contributors, CC-BY-SA <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>',
      layer = new L.TileLayer(layerUrl, {maxZoom: 17, attribution: layerAttribution, subdomains: 'abcd'}),

      data = {"type":"FeatureCollection","features":[{"type":"Feature","id":"transit_linestrings.1","geometry":{"type":"MultiLineString","coordinates":[[[-73.8783051209751,40.7449562692332],[-73.8829848173908,40.74703692471883],[-73.8828890722808,40.74720917032996],[-73.8829637399808,40.74770336746572],[-73.88392287152966,40.74755646380847],[-73.88373045473526,40.7465560988898],[-73.88340803396162,40.74639382198161],[-73.88299177875025,40.74701143247681],[-73.87831604164666,40.74492675416545]]]},"geometry_name":"the_geom","properties":{"name":"Q29"}},{"type":"Feature","id":"transit_linestrings.2","geometry":{"type":"MultiLineString","coordinates":[[[-73.88529518956301,40.75530260230887],[-73.88391977620066,40.747601300371414],[-73.89165776216794,40.74679115635567],[-73.89137165612966,40.74658874636201],[-73.89141836374957,40.7468473771559],[-73.88766074753241,40.7472581613513],[-73.88485218594266,40.74754789146694],[-73.88629518960882,40.75533921037984]]]},"geometry_name":"the_geom","properties":{"name":"Q32"}},{"type":"Feature","id":"transit_linestrings.3","geometry":{"type":"MultiLineString","coordinates":[[[-73.8844936153906,40.75555867849012],[-73.88294747567737,40.74775027208972],[-73.89166774481342,40.74680051902781],[-73.89135730422076,40.74657770313795],[-73.89140376367584,40.74682318350012],[-73.8839404545986,40.74762874810287],[-73.88534532821636,40.7554748127849]]]},"geometry_name":"the_geom","properties":{"name":"Q33"}},{"type":"Feature","id":"transit_linestrings.4","geometry":{"type":"MultiLineString","coordinates":[[[-73.8956516420441,40.74266725088026],[-73.8957959960855,40.74338502109846],[-73.89588214433499,40.74455061832859],[-73.89626993537671,40.74632534574903],[-73.89539236857388,40.74641659121868],[-73.893547614005,40.74658238053662],[-73.89232648481742,40.74670741665117],[-73.89048255154984,40.74692439702642],[-73.89035577461523,40.74630997504997],[-73.89041390317074,40.74622209867678],[-73.89166315084022,40.74677145811073]]]},"geometry_name":"the_geom","properties":{"name":"Q45"}},{"type":"Feature","id":"transit_linestrings.5","geometry":{"type":"MultiLineString","coordinates":[[[-73.87617368251831,40.7526651531959],[-73.89301820600919,40.75090721008614],[-73.89268571373357,40.74885165010546],[-73.89237587089086,40.74713442948261],[-73.89148117763622,40.74722285306521],[-73.89181661162458,40.74880767166871],[-73.891759034102,40.7490711292067],[-73.8920900279835,40.75098629394471]]]},"geometry_name":"the_geom","properties":{"name":"Q49"}},{"type":"Feature","id":"transit_linestrings.6","geometry":{"type":"MultiLineString","coordinates":[[[-73.89371058138741,40.75468022655065],[-73.89237543554074,40.74713420698816],[-73.89061021694194,40.74731287000359],[-73.89046644627432,40.74692000720614],[-73.89141976821485,40.74682467923712],[-73.89176603483706,40.74883725567506],[-73.89173015433163,40.74905606379508],[-73.89278416744737,40.75470208086984]]]},"geometry_name":"the_geom","properties":{"name":"Q47"}},{"type":"Feature","id":"transit_linestrings.7","geometry":{"type":"MultiLineString","coordinates":[[[-73.90298784522005,40.75160682761548],[-73.89295197152427,40.74733190135552],[-73.88926978531975,40.74575223837842],[-73.88372009979125,40.74328225010619],[-73.88183852011585,40.742339494090515],[-73.88011815122599,40.74125307483408]]]},"geometry_name":"the_geom","properties":{"name":"Q53"}}]},
      defaultStyle = {
        opacity: 0.7,
        weight: 4,
        color: '#4575b4'
      },
      selectStyle = {
        opacity: 0.9,
        weight: 4,
        color: '#ffff00'
      },

      geojson = L.geoJson(data, {
        style: function() { return defaultStyle; }
      }),
      featureSelect = L.featureSelect({
        layerGroup: geojson,
        selectSize: [16, 16]
      });

  map.setView([40.7498, -73.8901], 16).addLayer(layer);

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