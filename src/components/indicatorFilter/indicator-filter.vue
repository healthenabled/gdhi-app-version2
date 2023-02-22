<script>
import Vue from "vue";
import axios from "axios";
import common from "../../common/common";
import { EventBus } from "../common/event-bus";
import { EVENTS } from "../../constants";
import { LayoutDirectionConfig } from "../../plugins/i18n";

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

  mounted: function () {
    EventBus.$on("Reset:Filters", () => {
      this.resetFilters();
    });
  },

  updated() {
    if (this.locale !== this.$i18n.locale) {
      this.fetchCategoricalIndicators();
    }
    this.locale = this.$i18n.locale;
  },

  methods: {
    filter: function () {
      window.appProperties.setCategoryFilter({
        categoryId: this.categoryValue,
      });
      EventBus.$emit(EVENTS.INDICATOR_FILTERED);
    },

    getDirection: function () {
      return LayoutDirectionConfig[this.locale];
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
      :style="`direction: ${getDirection()}`"
    >
      <option value="">{{ $t("mixed.textOverAll") }}</option>
      <option
        v-for="(category, index) in categories"
        :value="category.categoryId"
        :key="index"
      >
        {{ category.categoryName }}
      </option>
    </select>
  </div>
</template>
