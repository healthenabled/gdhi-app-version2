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
    },
  },
  mounted() {
    EventBus.$on(EVENTS.REGION_TRANSLATED, () => {
      this.getRegionNameFromRegionId();
    });
  },
  created() {
    this.getRegionNameFromRegionId();
  },
});
</script>
<template>
  <div class="heading">
    <h3>{{ regionName }}</h3>
  </div>
</template>

<style scoped lang="scss">
@import "regional-overview";
</style>
