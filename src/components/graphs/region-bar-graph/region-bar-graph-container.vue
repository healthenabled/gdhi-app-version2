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
      regionCountriesData: null,
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
    getCountriesNames() {
      this.countries = [];
      for (let key of this.defaultYearCountriesScore.keys()) {
        this.countries.push(key);
      }
      for (let key of this.selectedYearCountriesScore.keys()) {
        this.countries.push(key);
      }
      this.countries = [...new Set(this.countries)].sort();
    },
    getDefaultYearCountriesData(regionCountriesData) {
      this.defaultYearCountriesScore = new Map();
      regionCountriesData.map((country) => {
        let countryName = country.countryName;
        country.countryYearsData.map((countryYearsData) => {
          if (countryYearsData.year === this.defaultYear) {
            if (this.category === -1) {
              if (
                countryYearsData.country.countryPhase !== -1 &&
                countryYearsData.country.countryPhase !== null
              ) {
                this.defaultYearCountriesScore.set(
                  countryName,
                  countryYearsData.country
                );
              }
            } else {
              if (
                countryYearsData.country.categories[this.category].phase !== -1
              ) {
                this.defaultYearCountriesScore.set(
                  countryName,
                  countryYearsData.country
                );
              }
            }
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
            if (this.category === -1) {
              if (
                countryYearsData.country.countryPhase !== -1 &&
                countryYearsData.country.countryPhase !== null
              ) {
                this.selectedYearCountriesScore.set(
                  countryName,
                  countryYearsData.country
                );
              }
            } else {
              if (
                countryYearsData.country.categories[this.category].phase !== -1
              ) {
                this.selectedYearCountriesScore.set(
                  countryName,
                  countryYearsData.country
                );
              }
            }
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
          this.regionCountriesData = regionCountriesData;
          this.getDefaultYearCountriesData(this.regionCountriesData);
          this.getSelectedYearCountriesData(this.regionCountriesData);
          this.getCountriesNames();
          common.hideLoading();
        });
    },
    categoryChange() {
      this.category = window.appProperties.getCategoryFilter() - 1;
      this.getDefaultYearCountriesData(this.regionCountriesData);
      this.getSelectedYearCountriesData(this.regionCountriesData);
      this.getCountriesNames();
    },
  },
});
</script>

<template>
  <div class="box overall-card container content-width">
    <div class="indicator-filter-container">
      <indicatorFilter
        v-if="regionCountriesData != null && regionCountriesData.length != 0"
        @categoryFiltered="categoryChange"
        title="countryProfile.countryProgressLineChart.indicatorGroupingDescription"
      />
    </div>
    <RegionBarGraph
      v-if="regionCountriesData != null"
      :labels="countries"
      :defaultYearData="defaultYearCountriesScore"
      :selectedYearData="selectedYearCountriesScore"
      :categoryFilter="category"
    />
    <div v-else class="spinner">
      <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
    </div>
    <div class="govtApproved">
      {{ $t("regionalOverview.note") }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../../assets/stylesheets/rtl-support";
@import "../../../assets/stylesheets/components/variables";
.container {
  margin-bottom: 20px;
  border-radius: 0px;
  .indicator-filter-container {
    @include padding-left(16px);
    font-weight: bold;
  }
}
.govtApproved {
  margin-left: 30px;
  margin-bottom: 10px;
  color: $gdhi-orange-shade1;
  margin-top: 8px;
}
.indicator-filter-container::v-deep .filter-indicator {
  height: 100%;
  width: max(20vw, 120px);
  @include margin-right(2.5vw);
  @include margin-left(0.5vw);

  &-header {
    margin-top: unset;
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
