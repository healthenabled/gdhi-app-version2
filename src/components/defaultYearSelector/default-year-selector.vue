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
      axios.get("/bff/distinct_years").then(({ data }) => {
        self.years = data.years;
        self.defaultYear = data.defaultYear;
        window.appProperties.setDefaultYear({
          defaultYear: this.defaultYear,
        });
      });
    },

    setDefaultYear: function () {
      const self = this;
      axios
        .post("/admin/default_year/submit", self.defaultYear)
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
  <div>
    <div class="year-indicator">
      <div class="year-indicator-header">
        Select year for which date is to be displayed on the Homepage
      </div>
      <yearFilter :defaultYear="defaultYear" :years="years" />
    </div>
    <button class="btn btn-primary" @click="setDefaultYear">SUBMIT</button>
  </div>
</template>
