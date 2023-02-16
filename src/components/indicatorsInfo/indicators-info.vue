<script>
import Vue from "vue";

import axios from "axios";
import uniq from "lodash/uniq";
import common from "../../common/common";

export default Vue.extend({
  name: "IndicatorsInfo",

  data() {
    return {
      categoricalIndicators: [],
      categoryNames: [],
      locale: "en",
    };
  },

  mounted() {
    this.fetchAndStoreCategoricalIndicators();
  },
  updated() {
    if (this.locale !== this.$i18n.locale) {
      this.fetchAndStoreCategoricalIndicators();
      this.locale = this.$i18n.locale;
    }
  },
  methods: {
    fetchAndStoreCategoricalIndicators() {
      const self = this;
      common.showLoading();

      self.fetchCategoricalIndicators().then((response) => {
        self.categoricalIndicators = response.data;
        self.categoricalIndicators.forEach((category) => {
          this.$set(category, "showCategory", true);
        });
        self.categoryNames = self.getCategoryNames(response.data);
        common.hideLoading();
      });
    },
    fetchCategoricalIndicators() {
      return axios.get(
        "/api/health_indicator_options",
        common.configWithUserLanguageAndNoCacheHeader(this.$i18n.locale)
      );
    },

    getCategoryNames(categories) {
      return uniq(
        categories.map((category) => {
          return category.categoryName;
        })
      );
    },
    onCategoryExpand(category) {
      category.showCategory = !category.showCategory;
    },
  },
});
</script>
<template>
  <div class="indicators-info content-centered">
    <div class="hero-image">
      <img src="/static/img/hero.jpg" alt="hero image" />
      <span class="hero-title"
        >{{ $t("indicators.gdhi") }}<br />{{
          $t("indicators.indicatorGuide")
        }}</span
      >
    </div>
    <div class="page-description header-regular">
      <span v-html="$t('indicators.paragraph1')"></span>
    </div>
    <div class="inline-links text-center">
      <a
        class="text-center"
        :href="'#' + category.categoryName.toString().replace(' ', '_')"
        v-for="category in categoricalIndicators"
      >
        <span>{{ category.categoryName }}</span>
      </a>
    </div>
    <div class="indicators-info-content">
      <div class="indicators-info-content-categories">
        <div class="indicators">
          <div v-for="category in categoricalIndicators">
            <a
              class="internal_anchor"
              :name="category.categoryName.toString().replace(' ', '_')"
            ></a>
            <div class="indicator-details">
              <div
                v-bind:class="
                  category.showCategory ? 'accordion expanded' : 'accordion'
                "
              >
                <div
                  class="align-No sub-header"
                  @click="onCategoryExpand(category)"
                >
                  {{ category.categoryName }}
                </div>
                <div class="accordion-content">
                  <div v-for="indicator in category.indicators">
                    <div class="box indicator">
                      <div class="indicator-info text-center">
                        <span class="indicator-id"
                          >{{ $t("indicators.indicator") }}
                          {{ indicator.indicatorCode }} -
                        </span>
                        <span class="indicator-name">{{
                          indicator.indicatorName
                        }}</span>
                        <div class="indicator-def copy-italics">
                          {{ indicator.indicatorDefinition }}
                        </div>
                      </div>
                      <div
                        v-if="score.score !== -1"
                        class="score"
                        v-for="score in indicator.scores"
                      >
                        <span :class="'phase' + score.score">{{
                          score.score
                        }}</span>
                        <span>{{ score.scoreDefinition }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="top">
        <a class="arrow" href="#"
          ><span class="fa fa-chevron-circle-up fa-3x"></span
        ></a>
      </div>
    </div>
  </div>
</template>
