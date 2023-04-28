<script>
import Vue from "vue";
import { EventBus } from "../common/event-bus";
import { EVENTS } from "../../constants";

export default Vue.extend({
  name: "RegionalOverview",
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
  <div class="heading">
    <p>{{ regionName }}</p>
  </div>
</template>

<style scoped lang="scss">
@import "regional-overview";
</style>
