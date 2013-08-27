/*globals L */

L.FeatureSelect = L.Class.extend({
  includes: L.Mixin.Events,

  options: {
    icon: L.divIcon({
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      className: 'leaflet-feature-selector'
    }),
    selectSize: [16, 16],
    featureGroup: null
  },

  initialize: function (options) {
    L.setOptions(this, options);

    this.options.selectSize = L.point(this.options.selectSize);
  },

  addTo: function (map) {
    this._map = map;
    this._center = map.getCenter();

    this._intersectingLayers = {};

    this._marker = L.marker(this._center, {
      icon: this.options.icon,
      clickable: false,
      zIndexOffset: 1000
    }).addTo(map);

    map.on('move', this._checkIntersections, this);

    this.options.featureGroup.on('layeradd', this._checkIntersections, this);
    this.options.featureGroup.on('layerremove', this._checkIntersections, this);

    return this;
  },

  _checkIntersections: function() {
    var selectionChanged = false,
        justSelected = [],
        justUnselected  = [],
        centerPoint = this._map.project(this._center);

    this.layers = [];
    this._center = this._map.getCenter();
    this._marker.setLatLng(this._center);

    this._selectBounds = L.latLngBounds(
      this._map.unproject([
        centerPoint.x + this.options.selectSize.x/2,
        centerPoint.y - this.options.selectSize.y/2
      ]),
      this._map.unproject([
        centerPoint.x - this.options.selectSize.x/2,
        centerPoint.y + this.options.selectSize.y/2
      ])
    );

    // TODO: this is not very robust. It has only been tested with multiline strings
    // via GeoJSON layers and will not work for other geometry types. FIX ME!
    this.options.featureGroup.eachLayer(function(layer) {
      var latLngs;

      if (layer.feature) {
        latLngs = L.GeoJSON.coordsToLatLngs(layer.feature.geometry.coordinates, 1)[0];
      } else if (layer.getLatLngs) {
        latLngs = layer.getLatLngs();
      }

      if (latLngs) {
        if (this._lineStringsIntersect(L.rectangle(this._selectBounds).getLatLngs(), latLngs)) {
          this.layers.push(layer);

          if (!this._intersectingLayers[L.stamp(layer)]) {
            selectionChanged = true;
            this._intersectingLayers[L.stamp(layer)] = layer;

            justSelected.push(layer);
          }
        } else {
          if (this._intersectingLayers[L.stamp(layer)]) {
            selectionChanged = true;
            delete this._intersectingLayers[L.stamp(layer)];

            justUnselected.push(layer);
          }
        }
      }
    }, this);

    if (selectionChanged) {
      selectionChanged = false;

      if (justSelected.length) {
        this.fire('select', {
          layers: justSelected
        });
      }

      if (justUnselected.length) {
        this.fire('unselect', {
          layers: justUnselected
        });
      }
    }


  },

  // adapted from https://github.com/maxogden/geojson-js-utils/
  _lineStringsIntersect: function (l1, l2) {
    var intersects = [],
        i, j, iLen, jLen, ua, ub;

    for (i = 0, iLen = l1.length - 2; i <= iLen; ++i) {
      for (j = 0, jLen = l2.length - 2; j <= jLen; ++j) {
        var a1 = {
            x: l1[i].lng,
            y: l1[i].lat
          },
          a2 = {
            x: l1[i + 1].lng,
            y: l1[i + 1].lat
          },
          b1 = {
            x: l2[j].lng,
            y: l2[j].lat
          },
          b2 = {
            x: l2[j + 1].lng,
            y: l2[j + 1].lat
          },
          ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
          ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x),
          u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

        if (u_b !== 0) {
          ua = ua_t / u_b;
          ub = ub_t / u_b;

          if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
            intersects.push(L.latLng([a1.y + ua * (a2.y - a1.y), a1.x + ua * (a2.x - a1.x)]));
          }
        }
      }
    }

    if (intersects.length === 0) {
      intersects = false;
    }
    return intersects;
  }
});

L.featureSelect = function (options) {
  return new L.FeatureSelect(options);
};
