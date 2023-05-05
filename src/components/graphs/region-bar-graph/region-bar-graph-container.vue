<script>
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
  name: "RegionBarGraphContainer",
  data() {
    return {
      category: window.appProperties.getCategoryFilter() - 1,
      regionCountriesData: {},
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
    getRegionCountriesData() {
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
        .then(({ data }) => {
          //   console.log(data);
        });
    },
  },
});
</script>

<template>
  <div></div>
</template>
