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
          '<svg height="26.67" width="26.67" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.458 27.167C7.56934 26.8337 5.15967 25.5697 3.22901 23.375C1.29834 21.1803 0.333008 18.611 0.333008 15.667C0.333008 14.0277 0.680341 12.465 1.37501 10.979C2.06967 9.493 3.02801 8.20833 4.25001 7.125L5.25001 8.125C4.11134 9.04167 3.24334 10.1597 2.64601 11.479C2.04867 12.7983 1.75001 14.1943 1.75001 15.667C1.75001 18.2223 2.57634 20.4513 4.22901 22.354C5.88167 24.2567 7.95801 25.4027 10.458 25.792V27.167ZM13.542 27.25V25.833C16.042 25.361 18.1183 24.1807 19.771 22.292C21.4237 20.4027 22.25 18.1943 22.25 15.667C22.25 12.8057 21.257 10.382 19.271 8.396C17.285 6.41 14.8613 5.417 12 5.417H10.75L13.625 8.292L12.583 9.292L8.00001 4.708L12.583 0.125L13.625 1.125L10.75 4H12C15.25 4 18.007 5.139 20.271 7.417C22.535 9.69433 23.667 12.4443 23.667 15.667C23.667 18.611 22.7017 21.1663 20.771 23.333C18.8403 25.4997 16.4307 26.8053 13.542 27.25Z" fill="#0A0A0A"/></svg>';
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
    L.control
      .attribution({
        position: "bottomleft",
        prefix:
          'Made with Natural Earth.<a href="https://github.com/datameet/maps/blob/master/Country/india-composite.geojson">India boundaries</a> by <a href="http://datameet.org/">DataMeet India community</a>',
      })
      .addTo(this.map);

    L.control
      .zoom({
        position: "topright",
        zoomInText:
          '<svg height="26.67" width="26.67" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.292 21.5H14.708V14.708H21.5V13.292H14.708V6.5H13.292V13.292H6.49999V14.708H13.292V21.5ZM0.666992 27.333V0.667H27.333V27.333H0.666992Z" fill="#0A0A0A"/> </svg>',
        zoomOutText:
          '<svg height="26.67" width="26.67" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.12499 14.667H21.875V13.25H6.12499V14.667ZM0.666992 27.333V0.667H27.333V27.333H0.666992Z" fill="#0A0A0A"/></svg>',
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
