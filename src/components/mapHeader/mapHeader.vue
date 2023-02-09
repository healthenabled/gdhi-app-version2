<script>
import Vue from "vue";
import MapLegend from "../legend/legend.vue";

export default Vue.extend({
    components: {
    MapLegend,
  },
  name: "MapHeader",
});
</script>

<template>
  <MapLegend></MapLegend>
</template>
