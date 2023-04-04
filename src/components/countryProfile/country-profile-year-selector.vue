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
      countryCode: this.$route.params.countryCode,
    };
  },

  created() {
    this.fetchDefaultYear();
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
  <div class="year-indicator">
    <div class="header-bold">{{ $t("countryProfile.selectYear") }}</div>
    <div class="sub-header">
      {{ $t("countryProfile.selectYearDescription") }}
    </div>
    <yearFilter :selectedYear="defaultYear" :years="years" />
  </div>
</template>
