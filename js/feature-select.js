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

    this.layers = {};

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

  _handleIntersection: function(layer) {
    if (!this.layers[L.stamp(layer)]) {
      this.layers[L.stamp(layer)] = layer;

      this.justSelected.push(layer);
    }
  },

  _handleNoIntersection: function(layer) {
    if (this.layers[L.stamp(layer)]) {
      delete this.layers[L.stamp(layer)];
      this.justUnselected.push(layer);
    }
  },

  _checkIntersections: function() {
    var centerPoint = this._map.project(this._center),
        selectBounds, selectBoundsLatLngs;

    this.justSelected = [];
    this.justUnselected  = [];

    this._center = this._map.getCenter();
    this._marker.setLatLng(this._center);

    selectBounds = L.latLngBounds(
      this._map.unproject([
        centerPoint.x + this.options.selectSize.x/2,
        centerPoint.y - this.options.selectSize.y/2
      ]),
      this._map.unproject([
        centerPoint.x - this.options.selectSize.x/2,
        centerPoint.y + this.options.selectSize.y/2
      ])
    );

    selectBoundsLatLngs = [selectBounds.getSouthWest(), selectBounds.getSouthEast(), selectBounds.getNorthEast(),
                           selectBounds.getNorthWest(), selectBounds.getSouthWest()];

    this.options.featureGroup.eachLayer(function(layer) {
      var latLngs, len, i;

      if (layer.getLatLngs) {
        latLngs = layer.getLatLngs();
      }

      switch (layer.feature.geometry.type) {
        case 'Point':
          latLngs = [ layer.getLatLng() ];
        case 'MultiPoint':
          for (i=0; i<latLngs.length; i++) {
            if (selectBounds.contains(latLngs[i]))  {
              this._handleIntersection(layer);
            } else {
              this._handleNoIntersection(layer);
            }
          }
          break;

        case 'LineString':
          latLngs = [ latLngs ];
        case 'MultiLineString':
          for (i=0; i<latLngs.length; i++) {
            if (selectBounds.intersects(layer.getBounds()) && this._lineStringsIntersect(selectBoundsLatLngs, latLngs[i])) {
              console.log(layer.feature.geometry.type, 'intersects');
              this._handleIntersection(layer);
            } else {
              console.log(layer.feature.geometry.type, 'nointersects');
              this._handleNoIntersection(layer);
            }

          }
          break;

      }
    }, this);

    if (this.justSelected.length) {
      this.fire('select', {
        layers: this.justSelected
      });
    }

    if (this.justUnselected.length) {
      this.fire('unselect', {
        layers: this.justUnselected
      });
    }
  },

  // adapted from https://github.com/maxogden/geojson-js-utils/
  _lineStringsIntersect: function (l1, l2) {
    var i, j, iLen, jLen, ua, ub;

    for (i = 0, iLen = l1.length - 2; i <= iLen; ++i) {
      for (j = 0, jLen = l2.length - 2; j <= jLen; ++j) {
        var a1 = {x: l1[i].lng, y: l1[i].lat },
            a2 = {x: l1[i + 1].lng, y: l1[i + 1].lat },
            b1 = {x: l2[j].lng, y: l2[j].lat },
            b2 = {x: l2[j + 1].lng, y: l2[j + 1].lat },

            ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
            ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x),
            u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

        if (u_b !== 0) {
          ua = ua_t / u_b;
          ub = ub_t / u_b;

          if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
            return true;
          }
        }
      }
    }

    return false;
  }
});

L.featureSelect = function (options) {
  return new L.FeatureSelect(options);
};
