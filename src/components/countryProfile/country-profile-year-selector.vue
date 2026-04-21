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
    if (this.countryCode) {
      this.fetchPublishedYearsForACountry(this.countryCode);
    }
  },

  methods: {
    async fetchPublishedYearsForACountry(countryCode) {
      try {
        const response = await axios.get(`/api/countries/${countryCode}/published_years`);
        
        const data = Array.isArray(response.data) ? response.data : [];
        this.years = data;

        if (this.years.length > 0 && this.selectedYear === null) {
          this.selectedYear = this.years[0];
        }
      } catch (error) {
        console.error("Error fetching published years:", error);
        this.years = [];
      }
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
