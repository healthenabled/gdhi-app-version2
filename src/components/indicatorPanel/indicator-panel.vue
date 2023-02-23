<script>
import Vue from "vue";
import { EventBus } from "../common/event-bus";
import axios from "axios";
import httpRequests from "../../common/indicator-http-requests";
import common from "../../common/common";
import indicatorFilter from "../indicatorFilter/indicator-filter.vue";
import phaseFilter from "../phaseFilter/phase-filter.vue";
import autoSearch from "../auto-search/auto-search.vue";
import { EVENTS } from "../../constants";

export default Vue.extend({
  name: "IndicatorPanel",
  components: {
    indicatorFilter,
    phaseFilter,
    autoSearch,
  },
  data() {
    return {
      developmentIndicators: [],
      healthIndicators: {},
      globalHealthIndicators: {},
      showCountryDetail: true,
      country: {},
      categoryFilter: window.appProperties.getCategoryFilter(),
      isListOfCategoriesApplicable: this.areCategoriesApplicable(),
      isNoGlobalHealthIndicators: false,
      locale: "en",
    };
  },
  mounted() {
    common.showLoading();
    this.getGlobalHealthIndicators();
    if (this.$parent) {
      this.$parent.$on("Map:Clicked", ($clickedEl) => {
        if ($clickedEl.type === "COUNTRY") {
          this.country.countryName = $clickedEl.countryName;
          this.country.countryCode = $clickedEl.countryCode;
          this.getIndicators(this, this.country.countryCode);
        } else if ($clickedEl.type === "GLOBAL") {
          this.getGlobalHealthIndicators();
        }
      });
      // this.$parent.$on("filtered", () => {
      //   this.getGlobalHealthIndicators();
      // });
      EventBus.$on(EVENTS.INDICATOR_FILTERED, () => {
        this.getGlobalHealthIndicators();
      });
      EventBus.$on(EVENTS.PHASE_FILTERED, () => {
        this.getGlobalHealthIndicators();
      });
    }
  },
  updated() {
    if (this.locale !== this.$i18n.locale) {
      this.getGlobalHealthIndicators();
      if (this.country.countryCode) {
        this.getIndicators(this, this.country.countryCode);
      }
      this.locale = this.$i18n.locale;
    }
  },
  methods: {
    setIndicatorTitleAndCategoryApplicability() {
      this.isListOfCategoriesApplicable = this.areCategoriesApplicable();
      this.isNoGlobalHealthIndicators =
        this.isNoGlobalHealthIndicatorsPresent();
    },

    areCategoriesApplicable() {
      return this.categoryFilter || this.isNoFilterPresent();
    },

    isNoFilterPresent() {
      return !this.categoryFilter && !this.phaseFilter;
    },

    isNoGlobalHealthIndicatorsPresent() {
      return this.globalHealthIndicators.categories.length === 0;
    },

    getIndicators(context, countryId) {
      this.getHealthIndicators(context, countryId);
      httpRequests
        .getDevelopmentIndicators(countryId, true)
        .then((response) => {
          this.developmentIndicators = response;
        });
    },

    getHealthIndicators(context, countryId) {
      const healthIndicatorsUrl = `/api/countries/${countryId}/health_indicators`;
      axios
        .get(
          healthIndicatorsUrl,
          common.configWithUserLanguageAndNoCacheHeader(this.$i18n.locale)
        )
        .then((response) => {
          this.getHealthIndicatorCallback(response);
        });
      /* TODO: Handle error at component Level
        .catch(e => {
          console.log('Error pulling health indicators data');
        });
        */
    },

    getHealthIndicatorCallback(response) {
      const healthIndicatorsData = {
        countryId: response.data.countryId,
        countryName: response.data.countryName,
        categories: response.data.categories,
        countryPhase: response.data.countryPhase,
      };
      this.healthIndicators = healthIndicatorsData;
      this.showCountryDetail = true;
      this.isNoGlobalHealthIndicators = true;
      this.country.countryName = this.country.countryName
        ? this.country.countryName
        : healthIndicatorsData.countryName;
    },

    getGlobalHealthIndicators() {
      const windowProperties = window.appProperties;
      const globalHealthIndicatorsUrl = `/api/global_health_indicators?categoryId=${windowProperties.getCategoryFilter()}&phase=${windowProperties.getPhaseFilter()}`;
      axios
        .get(
          globalHealthIndicatorsUrl,
          common.configWithUserLanguageAndNoCacheHeader(this.$i18n.locale)
        )
        .then((response) => {
          this.getGlobalHealthIndicatorCallback(response);
        });
      /* TODO: Handle error at component Level
        .catch((e) => {
          common.hideLoading();
          console.log('Error pulling health indicators data');
        });
        */
    },

    getGlobalHealthIndicatorCallback(response) {
      const globalHealthIndicatorsData = {
        overallCountryScore: response.data.overAllScore,
        categories: response.data.categories,
      };
      this.globalHealthIndicators = globalHealthIndicatorsData;
      this.categoryFilter = window.appProperties.getCategoryFilter();
      this.phaseFilter = window.appProperties.getPhaseFilter();
      this.setIndicatorTitleAndCategoryApplicability();
      this.showCountryDetail = false;
      common.hideLoading();
    },

    showCountryDetails(countryId) {
      this.$router.push({ path: `/country_profile/${countryId}` });
    },

    showListOfCountries() {
      this.$router.push({ path: "/country_list" });
    },
  },
});
</script>
<template>
  <div class="indicator-panel">
    <div class="indicator-panel-filter-container">
      <auto-search />
      <indicatorFilter class="indicator-panel-filter-container-select" />
      <phaseFilter class="indicator-panel-filter-container-select" />
    </div>
    <div class="indicator-panel-container" v-if="!showCountryDetail">
      <div
        class="indicator-panel-container-category"
        v-if="
          globalHealthIndicators.overallCountryScore ||
          isListOfCategoriesApplicable
        "
      >
        <div
          class="indicator-panel-container-category-section"
          v-if="globalHealthIndicators.overallCountryScore && !categoryFilter"
        >
          <span
            class="indicator-panel-container-category-section-name-phase-and-icon"
          >
            <img src="/static/indicator-icons/overAll.svg" />
            <div
              class="indicator-panel-container-category-section-name-and-phase"
            >
              {{ $t("mixed.textOverAll") }}
              <div
                :class="'indicator-panel-container-category-section-name-and-phase-phaseN'"
                :value="globalHealthIndicators.overallCountryScore"
                :data-phase="
                  $t('mixed.phaseN', {
                    number: globalHealthIndicators.overallCountryScore,
                  })
                "
              ></div>
            </div>
          </span>
          <div
            :class="
              'indicator-panel-container-category-section-phase phase' +
              globalHealthIndicators.overallCountryScore
            "
            :value="globalHealthIndicators.overallCountryScore"
          ></div>
        </div>
        <div
          v-if="isListOfCategoriesApplicable"
          v-for="(category, index) in globalHealthIndicators.categories"
          :key="index"
          class="indicator-panel-container-category-section"
        >
          <span
            class="indicator-panel-container-category-section-name-phase-and-icon"
          >
            <img :src="`/static/indicator-icons/${category.id}.svg`" />
            <div
              class="indicator-panel-container-category-section-name-and-phase"
            >
              {{ category.name }}
              <div
                :class="'indicator-panel-container-category-section-name-and-phase-phaseN'"
                :value="category.phase"
                :data-phase="$t('mixed.phaseN', { number: category.phase })"
              ></div>
            </div>
          </span>
          <div
            :class="
              'indicator-panel-container-category-section-phase phase' +
              category.phase
            "
            :value="category.phase"
          ></div>
        </div>
        <div
          class="indicator-panel-error"
          v-if="!globalHealthIndicators.categories.length"
        >
          {{ $t("worldMap.indicatorPanel.noHealthIndicatorAvailable") }}
        </div>
      </div>
      <div class="indicator-panel-error" v-else>
        {{ $t("worldMap.indicatorPanel.noHealthIndicatorAvailable") }}
      </div>
    </div>
    <div class="indicator-panel-container" v-else>
      <div
        class="indicator-panel-container-category"
        v-if="healthIndicators.countryPhase || healthIndicators.categories"
      >
        <div
          class="indicator-panel-container-category-section"
          v-if="healthIndicators.countryPhase"
        >
          <span
            class="indicator-panel-container-category-section-name-phase-and-icon"
          >
            <img src="/static/indicator-icons/overAll.svg" />
            <div
              class="indicator-panel-container-category-section-name-and-phase"
            >
              {{ $t("mixed.textOverAll") }}
              <div
                :class="'indicator-panel-container-category-section-name-and-phase-phaseN'"
                :value="healthIndicators.countryPhase"
                :data-phase="
                  $t('mixed.phaseN', { number: healthIndicators.countryPhase })
                "
              ></div>
            </div>
          </span>
          <div
            :class="
              'indicator-panel-container-category-section-phase phase' +
              healthIndicators.countryPhase
            "
            :value="healthIndicators.countryPhase"
          ></div>
        </div>
        <div
          class="indicator-panel-error"
          v-else-if="
            healthIndicators &&
            healthIndicators.categories &&
            healthIndicators.categories.length !== 0
          "
        ></div>
        <div class="indicator-panel-error" v-else>
          {{ $t("worldMap.indicatorPanel.noDigitalIndicatorAvailable") }}
        </div>
        <div
          v-if="healthIndicators.categories"
          v-for="(category, index) in healthIndicators.categories"
          :key="index"
          class="indicator-panel-container-category-section"
        >
          <span
            class="indicator-panel-container-category-section-name-phase-and-icon"
          >
            <img :src="`/static/indicator-icons/${category.id}.svg`" />
            <div
              class="indicator-panel-container-category-section-name-and-phase"
            >
              {{ category.name }}
              <div
                :class="'indicator-panel-container-category-section-name-and-phase-phaseN'"
                :value="category.phase"
                :data-phase="$t('mixed.phaseN', { number: category.phase })"
              ></div>
            </div>
          </span>
          <div
            :class="
              'indicator-panel-container-category-section-phase phase' +
              category.phase
            "
            :value="category.phase"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
