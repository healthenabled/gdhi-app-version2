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
    EventBus.$on(EVENTS.YEAR_FILTERED, (value) => {
      this.defaultYear = value;
    });
  },

  methods: {
    fetchYears: function () {
      const self = this;
      axios
        .get("/bff/distinctYears")
        .then((response) => {
          self.years = response.data.years;
          self.defaultYear = response.data.defaultYear;
        })
        .catch(() => {
          self.years = ["Version 1", "2022", "2023"];
          self.defaultYear = "Version 1";
        });
    },

    setDefaultYear: () => {
      axios.post("/api/phases", { data: this.defaultYear }).then((response) => {
        window.appProperties.setDefaultYear({
          defaultYear: response.data.defaultYear,
        });
        this.defaultYear = response.data.defaultYear;
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
