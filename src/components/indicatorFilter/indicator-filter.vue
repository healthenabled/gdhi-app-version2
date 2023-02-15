<script>
import Vue from "vue";
import axios from "axios";
import common from "../../common/common";
import { EventBus } from "../common/event-bus";
import {EVENTS} from "../../constants";

export default Vue.extend({
  name: "IndicatorFilter",
  data() {
    return {
      categoryValue: "",
      categories: [],
    };
  },

  created() {
    this.categoryValue = window.appProperties.getCategoryFilter();
    this.fetchCategoricalIndicators();
  },

  methods: {
    filter: function () {
      window.appProperties.setCategoryFilter({
        categoryId: this.categoryValue,
      });
      EventBus.$emit(EVENTS.INDICATOR_FILTERED);
  },

    resetFilters: function () {
      this.categoryValue = "";
      this.filter();
    },

    fetchCategoricalIndicators: function () {
      const self = this;
      return axios
        .get(
          "/api/health_indicator_options",
          common.configWithUserLanguageAndNoCacheHeader(this.$i18n.locale)
        )
        .then((categories) => {
          self.categories = categories.data;
        });
    },
  },
});
</script>

<template>
  <div class="filter-indicator">
    <div class="filter-indicator-header">
      {{ $t("indicators.indicator") }}
    </div>
    <select
      class="filter-indicator-select"
      v-model="categoryValue"
      @change="filter()"
      name="test_select1"
    >
      <option value="">{{ $t("mixed.textOverAll") }}</option>
      <option v-for="category in categories" v-bind:value="category.categoryId">
        {{ category.categoryName }}
      </option>
    </select>
  </div>
</template>
