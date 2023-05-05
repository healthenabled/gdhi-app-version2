<template>
  <div>
    <select
      class="year-indicator-select"
      @change="filter($event.target.value)"
      name="test_select3"
      :class="[
        shouldRespectTranslation ? direction : 'ltr',
        shouldChangeWidth ? 'width' : '',
      ]"
    >
      <option
        v-for="(year, index) in years"
        :key="index"
        :value="year"
        :selected="year === selectedYear"
      >
        {{ year }}
      </option>
    </select>
    {{ $t("") }}
  </div>
</template>

<script>
import { EventBus } from "../common/event-bus";
import { EVENTS } from "../../constants";
import { LayoutDirectionConfig } from "../../plugins/i18n";

export default {
  name: "yearFilter",
  data() {
    return {
      direction: "ltr",
    };
  },
  props: {
    years: Array,
    selectedYear: String,
    shouldRespectTranslation: {
      type: Boolean,
      default: false,
    },
    shouldChangeWidth: {
      type: Boolean,
      default: false,
    },
  },
  updated() {
    this.direction = LayoutDirectionConfig[this.$i18n.locale];
  },
  methods: {
    filter(value) {
      EventBus.$emit(EVENTS.YEAR_FILTERED, value);
      this.$emit("selectedYear", value);
    },
  },
};
</script>
