<script>
import Vue from "vue";
import axios from "axios";
import MapLegend from "../legend/legend.vue";
import { EventBus } from "../common/event-bus";
import { EVENTS } from "../../constants";
import common from "../../common/common";
import { LayoutDirectionConfig } from "../../plugins/i18n";

export default Vue.extend({
  components: {
    MapLegend,
  },
  name: "Header",

  data() {
    return {
      regions: [],
      selectedRegion: {},
      dropdownClicked: false,
      keepTrack: "",
    };
  },

  created() {
    this.fetchRegions();
  },
  updated() {
    if (this.locale !== this.$i18n.locale) {
      this.fetchRegions();
    }
    this.locale = this.$i18n.locale;
  },
  watch: {
    $route(to) {
      this.dropdownClicked = to.fullPath.includes("regional_overview");
    },
  },
  methods: {
    fetchRegions: function () {
      common.showLoading();
      const self = this;
      axios
        .get(
          "/api/regions",
          common.configWithUserLanguageAndNoCacheHeader(this.$i18n.locale)
        )
        .then(({ data }) => {
          self.regions = data;
          window.appProperties.setRegions(self.regions);
          EventBus.$emit(EVENTS.REGION_TRANSLATED);
        })
        .finally(() => {
          common.hideLoading();
        });
    },
    getBackgroundPositionX: function () {
      return LayoutDirectionConfig[this.locale] === "ltr" ? "95%" : "5%";
    },
    onClick({ regionId }) {
      if (!this.$route.path.includes(regionId)) {
        this.$router.push({
          path: `/regional_overview/${regionId}`,
        });
      }
    },
  },
});
</script>

<template>
  <div class="header">
    <div class="header-width">
      <div class="header-elements">
        <div class="left-aligned-headers">
          <span class="logo-name hd-element">
            <a href="http://www.digitalhealthmonitor.org" target="_blank">
              <img
                src="/static/img/GDHMLogo.svg"
                alt="GDHM Logo"
                width="200px"
                height="45px"
              /> </a
          ></span>
          <router-link :to="{ path: '/map' }" class="hd-element header-link"
            ><span>{{ $t("headers.worldMap") }}</span>
          </router-link>
          <a
            class="hd-element header-link"
            v-bind:class="{ colorOnSelect: dropdownClicked }"
          >
            <div class="dropdown">
              <button class="dropbtn">
                {{ $t("headers.regionalOverview") }}
                <i class="fa fa-caret-down"></i>
              </button>
              <div class="dropdown-content">
                <a
                  v-for="region in regions"
                  :key="region.regionId"
                  :value="region.regionId"
                  @click="onClick(region)"
                  >{{ region.regionName }}</a
                >
              </div>
            </div>
          </a>

          <router-link
            :to="{ path: '/indicators_info' }"
            class="hd-element header-link"
            ><span>{{ $t("headers.indicators") }}</span></router-link
          >
          <router-link
            :to="{ path: '/methodology' }"
            class="hd-element header-link"
            ><span>{{ $t("methodology.text") }}</span></router-link
          >
        </div>
        <div class="header-language-selector">
          <router-view name="languageSelect"></router-view>
        </div>
      </div>
    </div>

    <div class="sub-header">
      <div class="sub-header-title-and-description">
        <p class="sub-header-title">
          {{ $t("worldMap.indicatorPanel.indicatorPanelTitle") }}
        </p>
        <p class="sub-header-description">
          {{ $t("worldMap.indicatorPanel.description") }}
        </p>
      </div>
      <div class="sub-header-map-legend">
        <MapLegend />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "header";
</style>
