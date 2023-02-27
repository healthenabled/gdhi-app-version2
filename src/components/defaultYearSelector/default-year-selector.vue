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
      filteredYear: "",
      defaultYear: window.appProperties.getDefaultYear(),
      years: [],
    };
  },

  created() {
    this.fetchYears();
  },

  mounted() {
    EventBus.$on(EVENTS.YEAR_FILTERED, (filteredYear) => {
      this.filteredYear = filteredYear;
    });
  },

  methods: {
    fetchYears: function () {
      const self = this;
      axios.get("/api/bff/distinct_year").then(({ data }) => {
        self.years = data.years;
        this.defaultYear = data.defaultYear;
        window.appProperties.setDefaultYear({
          defaultYear: data.defaultYear,
        });
      });
    },

    setDefaultYear: function () {
      const self = this;

      let payload;
      if (self.filteredYear) {
        payload = self.filteredYear;
      } else {
        if (self.years.includes(this.defaultYear)) {
          payload = this.defaultYear;
        } else {
          payload = self.years[0];
        }
      }

      axios
        .post("/api/default_year/submit", payload, {
          headers: { "Content-Type": "text/plain" },
        })
        .then(() => {
          window.appProperties.setDefaultYear({
            defaultYear: this.filteredYear,
          });
        });
    },
  },
});
</script>

<template>
  <div>
    <div class="year-indicator">
      <div class="header-bold">
        Select year for which date is to be displayed on the Homepage
      </div>

      <yearFilter :selectedYear="defaultYear" :years="years" />
    </div>
    <button
      class="btn btn-primary"
      @click="setDefaultYear"
      style="margin-left: 1vw"
    >
      SUBMIT
    </button>
  </div>
</template>
