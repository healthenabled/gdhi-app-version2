<script>
import Vue from "vue";

export default Vue.extend({
  name: "RegionalOverview",
  data() {
    return {
      regions: [],
      regionName: "",
    };
  },
  computed: {
    getRegionNameFromRegionId() {
      const regionId = this.$route.params.regionId;
      if (self.regions.length > 0) {
        self.regions.forEach((region, i) => {
          if (region.regionId == regionId) {
            this.regionName = region.regionName;
          }
        });
      }
      return this.regionName;
    },
  },
  // updated() {
  //   this.getRegionNameFromRegionId(this.$route.params.regionId);
  // },
  created() {
    self.regions = window.appProperties.getRegions();
    //   this.getRegionNameFromRegionId(this.$route.params.regionId);
  },
  // methods: {},
});
</script>
<template>
  <div class="heading">
    <h3>{{ getRegionNameFromRegionId }}</h3>
  </div>
</template>

<style scoped lang="scss">
@import "regional-overview";
</style>
