<script>
import Vue from "vue";
import axios from "axios";
import yearFilter from "../defaultYearSelector/year-filter.vue";

export default Vue.extend({
  name: "countryProfileYearSelector",
  components: { yearFilter },
  data() {
    return {
      selectedYear: null,
      years: [],
      countryCode: "",
    };
  },

  created() {
    this.countryCode = this.$route.params.countryCode;
  },

  mounted() {
    this.fetchPublishedYearsForACountry(this.countryCode);
  },

  methods: {
    fetchPublishedYearsForACountry(countryCode) {
      axios
        .get(`/api/countries/${countryCode}/published_years`)
        .then((response) => {
          this.years = response.data;
          if (this.years.length && this.selectedYear === null) {
            this.selectedYear = this.years[0];
          }
        });
    },
    yearChanged(selectedYear) {
      this.selectedYear = selectedYear;
    },
  },
});
</script>

<template>
  <div class="year-select-container">
    <div class="title">
      <div class="sub-header-country-profile">
        {{ $t("countryProfile.selectYear") }}
      </div>
      <div class="select-year-desc">
        <p>{{ $t("countryProfile.selectYearDescription") }}</p>
      </div>
    </div>
    <div class="year-indicator year-indicator-select">
      <yearFilter
        :selectedYear="selectedYear"
        :years="years"
        :shouldRespectTranslation="true"
        :shouldChangeWidth="true"
        @yearChanged="yearChanged"
      />
    </div>
  </div>
</template>
