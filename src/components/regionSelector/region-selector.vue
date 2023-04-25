<script>
import Vue from "vue";
import axios from "axios";
import { EventBus } from "../common/event-bus";
import { EVENTS } from "../../constants";
import { LayoutDirectionConfig } from "../../plugins/i18n";
import common from "../../common/common";

export default Vue.extend({
  name: "RegionSelect",
  data() {
    return {
      regions: [],
      selectedRegion: "",
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

  methods: {
    onChange(selectedIndex) {
      this.selectedRegion = this.regions[selectedIndex];
      window.appProperties.setRegion({
        region: this.selectedRegion,
      });
      EventBus.$emit(EVENTS.REGION_FILTERED);
    },

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
          if (self.selectedRegion) {
            let index = 0;
            self.regions.forEach((region, i) => {
              if (region.regionId == self.selectedRegion.regionId) {
                index = i;
              }
            });
            self.onChange(index);
          }
        })
        .finally(() => {
          common.hideLoading();
        });
    },

    getBackgroundPositionX: function () {
      return LayoutDirectionConfig[this.locale] === "ltr" ? "95%" : "5%";
    },
  },
});
</script>
<template>
  <div class="region">
    <div class="region-header">{{ $t("countryProfile.region") }}</div>
    <select
      class="region-select"
      name="test_select3"
      @change="
        {
          return onChange($event.target.options.selectedIndex - 1);
        }
      "
      :style="`background-position-x: ${getBackgroundPositionX()}`"
    >
      <option value="">{{ $t("regionDropDown.textSelectRegion") }}</option>
      <option
        v-for="region in regions"
        :key="region.regionId"
        :value="region.regionId"
      >
        {{ region.regionName }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
@import "region-selector";
</style>
