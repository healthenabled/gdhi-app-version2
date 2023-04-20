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
      regionValue: "",
    };
  },
  updated() {
    if (this.locale !== this.$i18n.locale) {
      this.fetchRegions();
    }
    this.locale = this.$i18n.locale;
  },
  created() {
    this.fetchRegions();
  },
  methods: {
    fetchRegions: function () {
      const self = this;
      axios
        .get(
          "/api/regions",
          common.configWithUserLanguageAndNoCacheHeader(this.$i18n.locale)
        )
        .then(({ data }) => {
          self.regions = data;
        });
    },
    filter: (event) => {
      EventBus.$emit(EVENTS.REGION_FILTERED, event.target.value);
    },
    getBackgroundPositionX: function () {
      return LayoutDirectionConfig[this.locale] === "ltr" ? "95%" : "5%";
    },
  },
});
</script>
<template>
  <div class="region">
    <div class="region-header">Region</div>
    <select
      class="region-select"
      name="test_select3"
      @change="filter"
      :style="`background-position-x: ${getBackgroundPositionX()}`"
    >
      <option value="">{{ $t("regionDropDown.textSelectRegion") }}</option>
      <option
        v-for="region in regions"
        :key="region.region_id"
        :value="region.region_id"
      >
        {{ region.regionName }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
@import "region-selector";
</style>
