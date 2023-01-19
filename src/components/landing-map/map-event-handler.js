import mapHelper from './map-helper.js';

export default {
  onCountryClick(layer, lastClickedLayer, countryIndices) {
    const RED_COLOR_CODE = '#CF0A01';
    const SELECT_COUNTRY = 'SELECT_COUNTRY';
    const CLICK_ON = 'CLICK_ON';
    const COUNTRY_NOT_FOUND = 'COUNTRY_NOT_FOUND';
    if (lastClickedLayer !== '') {
      this.resetLayer(lastClickedLayer, countryIndices);
    }
    if (layer) {
      layer.setStyle({ fillColor: RED_COLOR_CODE, fillOpacity: 0.95 });
      if (lastClickedLayer && lastClickedLayer.feature.properties.BRK_A3 ===
        layer.feature.properties.BRK_A3) {
        return SELECT_COUNTRY;
      }
      return CLICK_ON;
    }
    return COUNTRY_NOT_FOUND;
  },

  onMouseMove(layer) {
    layer.setStyle({ fillOpacity: 0.65 });
  },
  onMouseOut(layer) {
    layer.setStyle({ fillOpacity: 0.95 });
  },
  resetLayer(layer, countryIndices) {
    if (layer) {
      layer.setStyle({
        fillOpacity: 0.95,
        fillColor: mapHelper.getColorCodeOf(
          layer.feature.properties.BRK_A3,
          countryIndices,
        ),
      });
    }
  },
};
