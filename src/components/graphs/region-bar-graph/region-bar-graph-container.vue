<script>
import Vue from "vue";
import axios from "axios";
import RegionBarGraph from "./region-bar-graph.vue";
import indicatorFilter from "../../indicatorFilter/indicator-filter.vue";
import common from "../../../common/common";

export default Vue.extend({
  name: "RegionBarGraphContainer",
  components: { RegionBarGraph, indicatorFilter },
  data() {
    return {
      category: window.appProperties.getCategoryFilter() - 1,
      countries: [],
      defaultYearCountriesScore: new Map(),
      selectedYearCountriesScore: new Map(),
    };
  },
  props: {
    defaultYear: { type: String, required: true },
    year: { type: String, required: false, default: "" },
    locale: { type: String, required: true },
  },
  mounted() {
    this.getRegionCountriesData();
  },
  watch: {
    locale() {
      this.getRegionCountriesData();
    },
    year() {
      this.getRegionCountriesData();
    },
  },
  methods: {
    getCountriesNames(regionCountriesData) {
      this.countries = [];
      regionCountriesData.map(({ countryName }) => {
        this.countries.push(countryName);
      });
    },
    getDefaultYearCountriesData(regionCountriesData) {
      this.defaultYearCountriesScore = new Map();
      regionCountriesData.map((country) => {
        let countryName = country.countryName;
        country.countryYearsData.map((countryYearsData) => {
          if (countryYearsData.year === this.defaultYear) {
            this.defaultYearCountriesScore.set(
              countryName,
              countryYearsData.country
            );
          }
        });
      });
    },
    getSelectedYearCountriesData(regionCountriesData) {
      this.selectedYearCountriesScore = new Map();
      regionCountriesData.map((country) => {
        let countryName = country.countryName;
        country.countryYearsData.map((countryYearsData) => {
          if (countryYearsData.year === this.year) {
            this.selectedYearCountriesScore.set(
              countryName,
              countryYearsData.country
            );
          }
        });
      });
    },
    getRegionCountriesData() {
      common.showLoading();
      const regionId = this.$route.params.regionId;
      const years = [this.defaultYear, this.year];
      axios
        .get(`/api/region/${regionId}`, {
          params: {
            list_of_years: years.reduce((f, s) => `${f},${s}`),
          },
          headers: {
            "Cache-Control": "no-cache",
            user_language: this.$i18n.locale,
          },
        })
        .then(({ data: { regionCountriesData } }) => {
          this.getCountriesNames(regionCountriesData);
          this.getDefaultYearCountriesData(regionCountriesData);
          this.getSelectedYearCountriesData(regionCountriesData);
          common.hideLoading();
        });
    },
    categoryChange() {
      this.category = window.appProperties.getCategoryFilter() - 1;
    },
  },
});
</script>

<template>
  <div class="box overall-card container content-width">
    <div class="indicator-filter-container">
      <indicatorFilter
        @categoryFiltered="categoryChange"
        title="countryProfile.countryProgressLineChart.indicatorGroupingDescription"
      />
    </div>
    <RegionBarGraph
      v-if="defaultYearCountriesScore.size || selectedYearCountriesScore.size"
      :labels="countries"
      :defaultYearData="defaultYearCountriesScore"
      :selectedYearData="selectedYearCountriesScore"
      :categoryFilter="category"
    />
    <div v-else class="spinner">
      <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../../assets/stylesheets/rtl-support";
@import "../../../assets/stylesheets/components/variables";
.container {
  height: 1000px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 0px;

  .indicator-filter-container {
    @include padding-left(16px);
    padding-top: 2px;
    font-weight: bold;
    margin-bottom: 20px;
  }
}
.indicator-filter-container::v-deep .filter-indicator {
  height: 100%;
  width: max(20vw, 120px);
  @include margin-right(2.5vw);
  @include margin-left(0.5vw);

  &-header {
    margin-top: 20px;
    padding-bottom: 10px;
    font-family: "Interbold";
    font-weight: 900;
    font-size: 17px;
  }
}
.indicator-filter-container::v-deep .filter-indicator-select {
  color: $cool-gray;
  background-color: $white;
  width: 100%;
  height: 40px;
  @include padding-left(20px);
  @include padding-right(20px);
  border: 1px solid #0a0a0a;
  -webkit-appearance: none;
  appearance: none;
  -moz-appearance: none;
  background: url("/static/img/arrowDown.svg") no-repeat;
  background-position-y: 50%;
  background-size: 15px;
}
.spinner {
  text-align: center;
  font-size: 15px;
  margin-top: 50px;
}
</style>
