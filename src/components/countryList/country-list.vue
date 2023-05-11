<script>
import Vue from "vue";
import axios from "axios";
import common from "../../common/common";

export default Vue.extend({
  name: "CountryList",

  data() {
    return {
      countryList: [],
      globalHealthIndicators: [],
      locale: "en",
    };
  },

  mounted() {
    common.showLoading();
    this.getListOfCountries();
  },
  updated() {
    if (this.locale !== this.$i18n.locale) {
      this.getListOfCountries();
      this.locale = this.$i18n.locale;
    }
  },

  methods: {
    countryListCallback(globalHealthIndices) {
      this.globalHealthIndicators =
        globalHealthIndices.data.countryHealthScores;
      this.listCountries(globalHealthIndices.data.countryHealthScores);
    },
    getListOfCountries() {
      return axios
        .get(
          `/api/countries_health_indicator_scores`,
          common.configWithUserLanguageAndNoCacheHeader(this.$i18n.locale)
        )
        .then((response) => {
          this.countryListCallback(response);
        });
    },
    listCountries(countriesDetails) {
      this.countryList = [];
      countriesDetails.forEach((country) => {
        const countryDetail = {
          countryName: country.countryName,
          overallPhase: country.countryPhase,
          countryId: country.countryId,
        };
        this.countryList.push(countryDetail);
        common.hideLoading();
      });
    },
    showCountryDetails(countryId) {
      this.$router.push({ path: `/country_profile/${countryId}` });
    },
    dataSheetUrl() {
      return `/api/export_global_data?user_language=${this.$i18n.locale}`;
    },
  },
});
</script>
<template>
  <div class="countries-container content-centered">
    <div class="countries-list">
      <div class="countries-list-heading page-title">
        {{ $t("countryList.title") }}
      </div>
      <div class="countries-list-section-export float-right">
        <span
          ><a :href="dataSheetUrl()" class="btn btn-primary export-button">{{
            $t("countryList.exportButtonText")
          }}</a></span
        >
      </div>
      <div class="countries-list-section clearfix">
        <div class="countries-list-section-description">
          <p>{{ $t("countryList.line1") }}</p>
          <p>{{ $t("countryList.line2") }}</p>
        </div>
      </div>
      <ul class="countries-list-details">
        <li
          v-for="country in countryList"
          class="countries-list-details-country"
        >
          <span :class="'country-score phase' + country.overallPhase">{{
            country.overallPhase ? country.overallPhase : "NA"
          }}</span>
          <span
            class="country-name"
            @click="showCountryDetails(country.countryId)"
            >{{ country.countryName }}</span
          >
        </li>
      </ul>
    </div>
  </div>
</template>
