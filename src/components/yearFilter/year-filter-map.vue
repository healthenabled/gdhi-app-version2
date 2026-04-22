<script>
import Vue from "vue";
import axios from "axios";
import { EventBus } from "../common/event-bus";
import { EVENTS } from "../../constants";
import { LayoutDirectionConfig } from "../../plugins/i18n";

export default Vue.extend({
  name: "yearFilterMap",
  data() {
    return {
      yearValue: "",
      years: [],
      locale: "en",
    };
  },

  created() {
    this.fetchYears();
  },

  mounted: function () {
    EventBus.$on("Reset:Filters", () => {
      this.resetFilters();
    });
  },

  beforeDestroy() {
    EventBus.$off("Reset:Filters");
  },

  methods: {
    filter: function () {
      EventBus.$emit(EVENTS.YEAR_FILTERED, this.yearValue);
    },

    getBackgroundPositionX: function () {
      return LayoutDirectionConfig[this.$i18n.locale] === "ltr" ? "95%" : "5%";
    },

    fetchYears: function () {
      axios.get("/api/bff/distinct_year").then(({ data }) => {
        this.years = data.years.filter((year) => /^\d{4}$/.test(year) || year === "Version1");
      });
    },

    resetFilters: function () {
      this.yearValue = "";
    },
  },
});
</script>

<template>
  <div class="phase-indicator">
    <div class="phase-indicator-header">
      {{ $t("mixed.year") }}
      <span class="year-filter-new-badge">{{ $t("mixed.new") }}</span>
    </div>
    <select
      :class="['phase-indicator-select', yearValue === '' ? 'year-indicator-select--latest' : '']"
      v-model="yearValue"
      @change="filter()"
      name="year_select"
      :style="`background-position-x: ${getBackgroundPositionX()}`"
    >
      <option value="" class="year-filter-latest-option">{{ $t("mixed.latestAvailableData") }}</option>
      <option v-for="year in years" :key="year" :value="year" class="year-filter-year-option">
        {{ year }}
      </option>
    </select>
  </div>
</template>
