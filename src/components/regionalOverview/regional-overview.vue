<script>
import Vue from "vue";

export default Vue.extend({
  name: "RegionalOverview",
  data() {
    return {
      regions: [],
      selectedRegion: "",
    };
  },
});
</script>
<template>
  <div class="heading">
    <h3>{{ $route.params.regionName }}</h3>
  </div>
</template>

<style scoped lang="scss">
@import "regional-overview";
</style>
