<script>
import Vue from "vue";
import axios from "axios";
import { EventBus } from "../common/event-bus";
import Autocomplete from "vuejs-auto-complete";
import sortBy from "lodash/sortBy";
import common from "../../common/common";

export default Vue.extend({
  name: "AutoSearch",
  components: { Autocomplete },
  mounted() {
    this.loadCountries();
  },
  data() {
    return {
      countries: [],
      countryId: "",
      locale: "en",
    };
  },
  updated() {
    if (this.locale !== this.$i18n.locale) {
      this.loadCountries();
      this.locale = this.$i18n.locale;
    }
  },
  methods: {
    loadCountries() {
      axios
        .get(
          "/api/countries",
          common.configWithUserLanguageAndNoCacheHeader(this.$i18n.locale)
        )
        .then((response) => {
          this.countries = sortBy(response.data, ["name"]);
          this.$refs.autoComplete.clear();
        });
    },
    onCountrySelect(selectedItem) {
      this.countryId = selectedItem.value;
      EventBus.$emit("Map:Searched", this.countryId);
    },
  },
});
</script>

<template>
  <div class="search-box hd-element" ref="autocomplete">
    <autocomplete
      id="search-box"
      :source="countries"
      :placeholder="$t('headers.searchBoxPlaceholder')"
      input-class="search-box-container"
      @selected="onCountrySelect"
      ref="autoComplete"
    />
  </div>
</template>
