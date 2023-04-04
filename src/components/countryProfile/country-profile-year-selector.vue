<script>
import Vue from "vue";
import axios from "axios";
import yearFilter from "../defaultYearSelector/year-filter.vue";

export default Vue.extend({
  name: "countryProfileYearSelector",
  components: { yearFilter },
  data() {
    return {
      defaultYear: window.appProperties.getDefaultYear(),
      years: [],
      countryCode: "",
    };
  },

  created() {
    this.fetchDefaultYear();
    this.countryCode = this.$route.params.countryCode;
  },

  mounted() {
    this.fetchPublishedYearsForACountry(this.countryCode);
  },

  methods: {
    fetchDefaultYear: function () {
      axios.get("/api/bff/distinct_year").then(({ data }) => {
        this.defaultYear = data.defaultYear;
        window.appProperties.setDefaultYear({
          defaultYear: data.defaultYear,
        });
      });
    },
    fetchPublishedYearsForACountry(countryCode) {
      axios
        .get(`/api/countries/${countryCode}/published_years`)
        .then((response) => {
          this.years = response.data;
        });
    },
  },
});
</script>

<template>
  <div class="year-select-container">
    <div class="title">
      <div class="sub-header">{{ $t("countryProfile.selectYear") }}</div>
      <div class="select-year-desc">
        <p>{{ $t("countryProfile.selectYearDescription") }}</p>
      </div>
    </div>
    <div class="year-indicator year-indicator-select">
      <yearFilter :selectedYear="defaultYear" :years="years" />
    </div>
  </div>
</template>
