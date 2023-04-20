<script>
import Vue from "vue";
import axios from "axios";
import { EventBus } from "../common/event-bus";
import { EVENTS } from "../../constants";

export default Vue.extend({
  name: "RegionSelect",
  data() {
    return {
      regions: [],
      regionValue: "",
    };
  },
  created() {
    this.fetchRegions();
  },
  methods: {
    fetchRegions: function () {
      const self = this;
      axios.get("/api/regions").then(({ data }) => {
        self.regions = data;
      });
    },
    filter: (event) => {
      EventBus.$emit(EVENTS.REGION_FILTERED, event.target.value);
    },
  },
});
</script>

<template>
  <div class="region">
    <div class="header-bold">Select Region</div>
    <select class="region-select" name="test_select3" @change="filter">
      <option
        v-for="region in regions"
        :key="region.region_id"
        :value="region.region_id"
        :selected="region.region_id === regionValue"
      >
        {{ region.region_id }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
@import "region-selector";
</style>
