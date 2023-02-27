<template>
  <select class="year-indicator-select" @change="filter" name="test_select3">
    <option
      v-for="(year, index) in years"
      :key="index"
      :value="year"
      :selected="year === selectedYear"
    >
      {{ year }}
    </option>
  </select>
</template>

<script>
import { EventBus } from "../common/event-bus";
import { EVENTS } from "../../constants";

export default {
  name: "yearFilter",
  props: {
    years: Array,
    selectedYear: String,
  },

  methods: {
    filter: (event) => {
      EventBus.$emit(EVENTS.YEAR_FILTERED, event.target.value);
    },
  },
};
</script>
