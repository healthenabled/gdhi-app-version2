<script>
import Vue from "vue";

import axios from "axios";
import common from "../../common/common";
import { EventBus } from "../common/event-bus";
import { EVENTS } from "../../constants";

export default Vue.extend({
  name: "CountrySummary",
  data() {
    return {
      countrySummaries: {},
      error: "",
      selectedYear: null,
    };
  },
  mounted() {
    common.showLoading();
    this.getCountrySummary(this.$route.params.countryCode);
    EventBus.$on(EVENTS.YEAR_FILTERED, (selectedYear) => {
      this.selectedYear = selectedYear;
      this.getCountrySummary(this.$route.params.countryCode);
    });
  },
  methods: {
    getCountrySummary(countryCode) {
      const countrySummaryUrl = `/api/countries/${countryCode}/country_summary`;
      axios
        .get(
          countrySummaryUrl,
          common.configWithUserLanguageAndNoCacheHeader(
            this.$i18n.locale,
            this.selectedYear
          )
        )
        .then((response) => {
          this.countrySummaryCallback(response);
        })
        .catch((e) => {
          this.error = e?.response?.message;
        });
    },
    countrySummaryCallback(response) {
      this.countrySummaries = response.data;
      this.$emit(
        "summaryLoaded",
        this.countrySummaries.summary,
        this.countrySummaries.govtApproved
      );
      common.hideLoading();
    },
  },
});
</script>

<template>
  <div class="country-summary">
    <div class="country-summary-title header-bold">
      {{ $t("countryProfile.countrySummary.text") }}
    </div>
    <div class="country-summary-text">
      <div v-if="countrySummaries.summary">{{ countrySummaries.summary }}</div>
      <div class="error" v-else>{{ $t("mixed.noDataAvailable") }}</div>
    </div>
    <div
      class="country-resource-title header-bold"
      v-show="countrySummaries?.resources?.length"
    >
      {{ $t("countryProfile.countrySummary.resources") }}
    </div>
    <ul class="country-text" v-show="countrySummaries?.resources?.length">
      <li
        v-for="resource in countrySummaries.resources"
        class="country-resource-link"
      >
        <a
          :href="resource.startsWith('http') ? resource : 'http://' + resource"
          target="_blank"
          class="link-blue"
          style="word-wrap: break-word; word-break: break-all"
          >{{ resource }}</a
        >
      </li>
    </ul>
  </div>
</template>
