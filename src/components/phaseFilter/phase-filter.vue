<script>
import Vue from "vue";
import axios from "axios";
import { EventBus } from "../common/event-bus";
import { EVENTS } from "../../constants";

export default Vue.extend({
  name: "phaseFilter",
  data() {
    return {
      phaseValue: "",
      phases: [],
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

    resetFilters: function () {
      this.phaseValue = "";
      this.filter();
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
    >
      <option value="">{{ $t("mixed.all") }}</option>
      <option
        v-for="(phase, index) in phases"
        :key="index"
        v-bind:value="phase.phaseValue"
      >
        {{ $t("mixed.phase") }} {{ phase.phaseValue }}
      </option>
    </select>
  </div>
</template>
