import L from "leaflet";
// import countriesData from '../../../public/countries_mega.json';
import helper from "./map-helper";
import eventHandler from "./map-event-handler";
import filter from "lodash/filter";
import axios from "axios";
import { LayoutDirectionConfig } from "../../plugins/i18n";

export default {
  BLACK_COLOR_CODE: "#000",
  WHITE_COLOR_CODE: "#fff",
  lastClickedCountry: "",
  lastMouseOverCountry: "",
  drawMap: function (healthData, postClickCallBack, i18n) {
    this.healthData = healthData;
    const self = this;
    const ResetButton = L.Control.extend({
      options: {
        position: "topright",
      },
      onAdd() {
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control " + "leaflet-control-custom"
        );
        container.type = "button";
        container.id = "reset-btn";
        container.innerHTML =
          '<img src="/static/img/zoomReset.svg" height="26.67" width="26.67" loading="lazy"/>';
        container.onclick = function () {
          self.resetMap(postClickCallBack);
        };

        return container;
      },
    });
    if (this.map !== undefined) {
      this.map.off();
      this.map.remove();
    }
    //To adjust map according to RTL view
    const xAxis = LayoutDirectionConfig[i18n.locale] === "rtl" ? 0 : -10;
    const yAxis = 44;

    this.map = L.map("map", {
      attributionControl: false,
      zoomControl: false,
    }).setView([yAxis, xAxis], 0.5);

    this.map.setMinZoom(2);
    // L.control
    //   .attribution({
    //     position: "bottomleft",
    //     prefix:
    //       'Made with Natural Earth.<a href="https://github.com/datameet/maps/blob/master/Country/india-composite.geojson">India boundaries</a> by <a href="http://datameet.org/">DataMeet India community</a>',
    //   })
    //   .addTo(this.map);

    L.control
      .zoom({
        position: "topright",
        zoomInText:
          '<img src="/static/img/zoomIn.svg" height="26.67" width="26.67" loading="lazy"/>',
        zoomOutText:
          '<img src="/static/img/zoomOut.svg" height="26.67" width="26.67" loading="lazy"/>',
      })
      .addTo(this.map);
    this.map.addControl(new ResetButton());
    if (!self.countriesData) {
      axios
        .get("/static/data/countries_modified.json")
        .then(function (response) {
          self.countriesData = response.data;
          const mapLoader = document.querySelector(".loader");
          if (mapLoader) mapLoader.style.display = "none";
          return self.addMapToLeaflet(
            self,
            response.data,
            healthData,
            postClickCallBack
          );
        });
    } else {
      const mapLoader = document.querySelector(".loader");
      if (mapLoader) mapLoader.style.display = "none";
    }
    return this.addMapToLeaflet(
      this,
      this.countriesData,
      healthData,
      postClickCallBack
    );
  },
  addMapToLeaflet: function (self, data, healthData, postClickCallBack) {
    self.geoLayer = L.geoJson(data, {
      style(feature) {
        const fillColorCode = helper.getColorCodeOf(
          feature.properties.BRK_A3,
          healthData
        );
        return {
          weight: 1,
          color: self.WHITE_COLOR_CODE,
          fillColor: fillColorCode,
          fillOpacity: 0.95,
          id: feature.id,
        };
      },
      onEachFeature(feature, layer) {
        if (feature.properties) {
          let popupString = '<div class="popup">';
          popupString += feature.properties.NAME_LONG;
          popupString += "</div>";
          layer.bindTooltip(popupString);
        }
        layer.on({
          mousemove(e) {
            const li = document.getElementsByClassName("leaflet-interactive");
            for (let i = 0; i < li.length; i++) {
              li[i].setAttribute("style", "outline:none;");
            }
            eventHandler.onMouseMove(e.target, self.lastMouseOverCountry);
          },
          mouseout(e) {
            const li = document.getElementsByClassName("leaflet-interactive");
            for (let i = 0; i < li.length; i++) {
              li[i].setAttribute("style", "outline:none;");
            }
            eventHandler.onMouseOut(e.target, self.lastMouseOverCountry);
          },
          click(e) {
            const li = document.getElementsByClassName("leaflet-interactive");
            for (let i = 0; i < li.length; i++) {
              li[i].setAttribute("style", "outline:none;");
            }
            self.handleClick(
              e.target,
              feature.properties.BRK_A3,
              self.lastClickedCountry,
              self.healthData,
              postClickCallBack
            );
          },
        });
      },
    }).addTo(self.map);
    return self.geoLayer._layers;
  },
  handleSearch: function (countryCode, postSearchCallBack) {
    const searchCountry = filter(
      this.geoLayer._layers,
      (layer) => layer.feature.properties.BRK_A3 === countryCode
    );
    this.handleClick(
      searchCountry[0],
      countryCode,
      this.lastClickedCountry,
      this.healthData,
      postSearchCallBack
    );
  },
  handleClick: function (
    $el,
    countryCode,
    lastClickedCountry,
    healthData,
    postClickCallBack
  ) {
    const clickState = eventHandler.onCountryClick(
      $el,
      lastClickedCountry,
      healthData
    );
    if (clickState === "CLICK_ON") {
      this.lastClickedCountry = $el;
      postClickCallBack({
        type: "COUNTRY",
        countryCode: $el.feature.properties.BRK_A3,
        countryName: $el.feature.properties.NAME_LONG,
      });
      this.map.fitBounds($el.getBounds(), { maxZoom: 7 });
    } else if (clickState === "SELECT_COUNTRY") {
      let findCountry = healthData.filter(
        (data) => data.countryId === $el.feature.properties.BRK_A3
      );
      if (findCountry.length) {
        window.location.href = `/country_profile/${$el.feature.properties.BRK_A3}`;
        this.resetMap(postClickCallBack);
      }
    } else {
      this.lastClickedCountry = "";
      postClickCallBack({
        type: "COUNTRY",
        countryCode,
        countryName: "",
      });
      this.map.setView([44, -31], 2);
    }
  },
  resetMap(postClickCallBack) {
    eventHandler.resetLayer(this.lastClickedCountry, this.healthData);
    this.lastClickedCountry = "";
    postClickCallBack({ type: "GLOBAL" });
  },
};
