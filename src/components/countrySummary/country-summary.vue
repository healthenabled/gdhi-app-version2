<script>
import Vue from "vue";

import axios from "axios";
import common from "../../common/common";

export default Vue.extend({
  name: "CountrySummary",
  data() {
    return {
      countrySummaries: {},
      error: "",
    };
  },
  mounted() {
    common.showLoading();
    this.getCountrySummary(this.$route.params.countryCode);
  },
  methods: {
    getCountrySummary(countryCode) {
      const countrySummaryUrl = `/api/countries/${countryCode}/country_summary`;
      axios
        .get(countrySummaryUrl)
        .then((response) => {
          this.countrySummaryCallback(response);
        })
        .catch((e) => {
          this.error = e?.response?.message;
        });
    },
    countrySummaryCallback(response) {
      this.countrySummaries = response.data;
      this.$emit("summaryLoaded", this.countrySummaries.summary);
      common.hideLoading();
    },
  },
});
</script>

<template>
  <div class="country-summary">
    <div class="country-map">
      <div class="country-contact header-bold no-margin-top">
        {{ $t("countryProfile.countrySummary.keyContacts") }}
      </div>
      <div v-if="countrySummaries.contactName">
        <span class="country-summary-link" v-if="countrySummaries.contactName">
          <a
            :href="'mailto:' + countrySummaries.contactEmail"
            target="_blank"
            class="link-blue"
            >{{ countrySummaries.contactName }}</a
          >,
        </span>
        <span
          v-if="countrySummaries.contactDesignation"
          class="country-designation"
          >{{ countrySummaries.contactDesignation }},</span
        >
        <span v-if="countrySummaries.contactOrganization" class="country-org">{{
          countrySummaries.contactOrganization
        }}</span>
      </div>
      <div class="error" v-else>{{ $t("mixed.noDataAvailable") }}</div>
    </div>
    <div class="country-summary-title header-bold">
      {{ $t("countryProfile.countrySummary.text") }}
    </div>
    <div class="country-summary-text">
      <div v-if="countrySummaries.summary">{{ countrySummaries.summary }}</div>
      <div class="error" v-else>{{ $t("mixed.noDataAvailable") }}</div>
    </div>
    <div class="country-resource-title header-bold">
      {{ $t("countryProfile.countrySummary.resources") }}
    </div>
    <ul class="country-text" v-if="countrySummaries.resources">
      <li
        v-for="resource in countrySummaries.resources"
        class="country-resource-link"
      >
        <a
          :href="resource.startsWith('http') ? resource : 'http://' + resource"
          target="_blank"
          class="link-blue"
          >{{ resource }}</a
        >
      </li>
    </ul>
    <div class="error" v-else>{{ $t("mixed.noDataAvailable") }}</div>
  </div>
</template>
