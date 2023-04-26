<script>
import Vue from "vue";
import { EventBus } from "../common/event-bus";
import { EVENTS } from "../../constants";
import { LayoutDirectionConfig } from "../../plugins/i18n";

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
  <div>
    <h3>{{ $route.params.regionName }}</h3>
  </div>
</template>

<style scoped lang="scss">
@import "regional-overview";
</style>
