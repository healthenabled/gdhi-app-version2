<script>
import Vue from "vue";
import axios from "axios";
import { EventBus } from "../common/event-bus";
import { EVENTS } from "../../constants";
import { LayoutDirectionConfig } from "../../plugins/i18n";

export default Vue.extend({
  name: "phaseFilter",
  data() {
    return {
      phaseValue: "",
      phases: [],
      locale: "en",
    };
  },

  created() {
    this.phaseValue = window.appProperties.getPhaseFilter();
    this.fetchPhases();
  },

  mounted: function () {
    EventBus.$on("Reset:Filters", () => {
      this.resetFilters();
    });
  },

  methods: {
    filter: function () {
      window.appProperties.setPhaseFilter({ phaseId: this.phaseValue });
      EventBus.$emit(EVENTS.PHASE_FILTERED);
    },

    getBackgroundPositionX: function () {
      return LayoutDirectionConfig[this.$i18n.locale] === "ltr" ? "95%" : "5%";
    },

    resetFilters: function () {
      this.phaseValue = "";
      window.appProperties.setPhaseFilter({ phaseId: this.phaseValue });
    },

    fetchPhases: function () {
      const self = this;
      axios.get("/api/phases").then((response) => {
        self.phases = response.data;
      });
    },
  },
});
</script>
<template>
  <div class="phase-indicator">
    <div class="phase-indicator-header">
      {{ $t("mixed.phase") }}
    </div>
    <select
      class="phase-indicator-select"
      v-model="phaseValue"
      @change="filter()"
      name="test_select2"
      :style="`background-position-x: ${getBackgroundPositionX()}`"
    >
      <option value="">{{ $t("mixed.all") }}</option>
      <option
        v-for="(phase, index) in phases"
        :key="index"
        :value="phase.phaseValue"
      >
        {{ $t("mixed.phase") }} {{ phase.phaseValue }}
      </option>
    </select>
  </div>
</template>
