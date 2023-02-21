<script>
import Vue from "vue";
import axios from "axios";
import yearFilter from "./year-filter.vue";
import { EventBus } from "../common/event-bus";
import { EVENTS } from "../../constants";

export default Vue.extend({
  name: "defaultYearSelector",
  components: { yearFilter },
  data() {
    return {
      defaultYear: "",
      years: [],
    };
  },

  created() {
    this.fetchYears();
  },

  mounted() {
    EventBus.$on(EVENTS.YEAR_FILTERED, (filteredYear) => {
      this.defaultYear = filteredYear;
    });
  },

  methods: {
    fetchYears: function () {
      const self = this;
      axios.get("/bff/distinctYears").then(({ data }) => {
        self.years = data.years;
        self.defaultYear = data.defaultYear;
      });
    },

    setDefaultYear: function () {
      const self = this;
      axios
        .post("/api/phases", { defaultYear: self.defaultYear })
        .then((response) => {
          window.appProperties.setDefaultYear({
            defaultYear: this.defaultYear,
          });
        });
    },
  },
});
</script>

<template>
  <div class="year-indicator">
    <div class="year-indicator-header">
      {{ $t("mixed.selectYear") }}
    </div>
    <yearFilter :defaultYear="defaultYear" :years="years" />
    <button class="btn btn-primary" @click="setDefaultYear">
      {{ $t("healthIndicatorQuestionnaire.submit") }}
    </button>
  </div>
</template>
