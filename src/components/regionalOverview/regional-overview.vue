<script>
import Vue from "vue";
import { EventBus } from "../common/event-bus";
import { EVENTS } from "../../constants";
import RegionYearSelector from "../regionYearComponent/region-year-selector.vue";
import RegionDefaultYear from "../regionYearComponent/region-default-year.vue";

export default Vue.extend({
  name: "RegionalOverview",
  components: { RegionYearSelector, RegionDefaultYear },
  data() {
    return {
      regions: [],
      regionName: "",
    };
  },
  methods: {
    getRegionNameFromRegionId() {
      const regionId = this.$route.params.regionId;
      window.appProperties.getRegions().forEach((region, i) => {
        if (region.regionId == regionId) {
          this.regionName = region.regionName;
        }
      });
      this.regionName = this.regionName.replace("Region", "Regional Overview");
    },
  },
  mounted() {
    EventBus.$on(EVENTS.REGION_TRANSLATED, () => {
      this.getRegionNameFromRegionId();
    });
  },
  watch: {
    $route() {
      this.getRegionNameFromRegionId();
    },
  },
  created() {
    this.getRegionNameFromRegionId();
  },
});
</script>
<template>
  <div class="region-container">
    <p class="heading">{{ regionName }}</p>
    <div class="region-year-container">
      <region-default-year />
      <region-year-selector />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "regional-overview";
</style>
