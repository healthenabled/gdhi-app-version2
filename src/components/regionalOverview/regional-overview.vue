<script>
import Vue from "vue";
import { EventBus } from "../common/event-bus";
import { EVENTS } from "../../constants";
import RegionYearSelector from "../regionYearComponent/region-year-selector.vue";
import RegionDefaultYear from "../regionYearComponent/region-default-year.vue";
import RegionBarGraphContainer from "../graphs/region-bar-graph/region-bar-graph-container.vue";

export default Vue.extend({
  name: "RegionalOverview",
  components: {
    RegionYearSelector,
    RegionDefaultYear,
    RegionBarGraphContainer,
  },
  data() {
    return {
      regions: [],
      regionName: "",
      defaultYear: "",
      year: "",
      locale: "en",
    };
  },
  methods: {
    getRegionNameFromRegionId() {
      const regionId = this.$route.params.regionId;
      window.appProperties.getRegions().forEach((region) => {
        if (region.regionId === regionId) {
          this.regionName = region.regionName;
        }
      });
      this.regionName = this.regionName.replace("Region", "Regional Overview");
    },
    setYear(year) {
      this.year = year;
    },
    setDefaultYear(defaultYear) {
      this.defaultYear = defaultYear;
    },
  },
  updated() {
    this.locale = this.$i18n.locale;
  },
  mounted() {
    EventBus.$on(EVENTS.REGION_TRANSLATED, () => {
      this.getRegionNameFromRegionId();
    });
  },
  watch: {
    $route() {
      this.getRegionNameFromRegionId();
      this.year = "";
    },
  },
  created() {
    this.getRegionNameFromRegionId();
  },
});
</script>
<template>
  <div>
    <div class="region-container">
      <p class="heading">{{ regionName }}</p>
      <div class="region-year-container">
        <RegionDefaultYear @defaultYearChanged="setDefaultYear" />
        <RegionYearSelector @selectedYearChanged="setYear" />
      </div>
    </div>
    <RegionBarGraphContainer
      v-if="defaultYear && year"
      :defaultYear="defaultYear"
      :year="year"
      :locale="locale"
    />
    <div v-else class="error">
      {{ $t("worldMap.indicatorPanel.noDigitalIndicatorAvailable") }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "regional-overview";
</style>
