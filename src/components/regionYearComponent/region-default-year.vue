<script>
import Vue from "vue";
import axios from "axios";
import { EventBus } from "../common/event-bus";
import { EVENTS } from "../../constants";

export default Vue.extend({
  data() {
    return {
      defaultYear: "",
    };
  },
  mounted() {
    this.getDefaultYear();
  },
  methods: {
    getDefaultYear() {
      axios.get("/api/bff/distinct_year").then(({ data }) => {
        this.defaultYear = data.defaultYear;
        EventBus.$emit(EVENTS.DEFAULT_YEAR, this.defaultYear);
      });
    },
  },
});
</script>
<template>
  <div class="default-year-container">
    <div class="default-year">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="10" height="10" fill="#FCAB9C" />
        <rect y="10" width="10" height="10" fill="#FFE180" />
        <rect x="10" width="10" height="10" fill="#FFCA82" />
        <rect x="10" y="10" width="10" height="10" fill="#80E1CC" />
      </svg>
      <p class="text">{{ $t("regionalOverview.defaultYear") }}</p>
    </div>
    <div class="default-year-value">{{ defaultYear }}</div>
  </div>
</template>
<style scoped lang="scss">
@import "region-default-year";
</style>
