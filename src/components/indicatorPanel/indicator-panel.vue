<script>
import Vue from "vue";
import axios from "axios";
import httpRequests from "../../common/indicator-http-requests";
import common from "../../common/common";

export default Vue.extend({
  name: "IndicatorPanel",

  data() {
    return {
      developmentIndicators: [],
      healthIndicators: {},
      globalHealthIndicators: {},
      showCountryDetail: true,
      country: {},
      categoryFilter: window.appProperties.getCategoryFilter(),
      indicatorPanelTitle: this.getIndicatorContainerName(),
      phaseTitle: "",
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
      this.$parent.$on("filtered", () => {
        this.getGlobalHealthIndicators();
      });
    }
  },
  updated() {
    this.indicatorPanelTitle = this.getIndicatorContainerName();
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
      this.indicatorPanelTitle = this.getIndicatorContainerName();
      this.phaseTitle = this.getPhaseTitle();
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

    getIndicatorContainerName() {
      let indicatorPanelTitle = "";
      if (this.categoryFilter) {
        indicatorPanelTitle = this.getCategoryAsTitle();
      } else {
        indicatorPanelTitle = this.phaseFilter
          ? this.$i18n.t("mixed.textOverAll")
          : this.$i18n.t("worldMap.indicatorPanel.indicatorPanelTitle");
      }
      return indicatorPanelTitle;
    },

    getCategoryAsTitle() {
      const category = this.globalHealthIndicators.categories[0];
      return category
        ? category.name
        : "No countries available for the selected criteria";
    },

    isNoGlobalHealthIndicatorsPresent() {
      return this.globalHealthIndicators.categories.length === 0;
    },

    getPhaseTitle() {
      const phaseTitle = this.phaseFilter
        ? "Phase ".concat(this.phaseFilter)
        : "Global Average";
      return this.isNoGlobalHealthIndicatorsPresent() ||
        this.isNoFilterPresent()
        ? ""
        : phaseTitle;
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
    <div class="indicator-panel-container" v-if="!showCountryDetail">
      <div
        class="indicator-panel-container-category"
        v-if="globalHealthIndicators.overallCountryScore"
      >
        <div
          class="indicator-panel-container-category-section"
          v-if="!categoryFilter"
        >
          <span class="indicator-panel-container-category-section-name">{{
            $t("mixed.textOverAll")
          }}</span>
          <div
            :class="
              'indicator-panel-container-category-section-phase phase' +
              globalHealthIndicators.overallCountryScore
            "
            :value="globalHealthIndicators.overallCountryScore"
            :data-phase="
              $t('mixed.phaseN', {
                number: globalHealthIndicators.overallCountryScore,
              })
            "
          ></div>
        </div>
      </div>
      <div class="indicator-panel-error" v-else>
        {{ $t("worldMap.indicatorPanel.noHealthIndicatorAvailable") }}
      </div>
      <div
        class="indicator-panel-container-category"
        v-if="isListOfCategoriesApplicable"
      >
        <div
          v-for="(category, index) in globalHealthIndicators.categories"
          class="indicator-panel-container-category-section"
        >
          <span class="indicator-panel-container-category-section-name">{{
            category.name
          }}</span>
          <div
            :class="
              'indicator-panel-container-category-section-phase phase' +
              category.phase
            "
            :value="category.phase"
            :data-phase="$t('mixed.phaseN', { number: category.phase })"
          ></div>
        </div>
      </div>
    </div>
    <div class="indicator-panel-container" v-else>
      <div
        class="indicator-panel-container-category"
        v-if="healthIndicators.countryPhase"
      >
        <div class="indicator-panel-container-category-section">
          <span class="indicator-panel-container-category-section-name"
            >{{ $t("mixed.textOverAll") }}
          </span>
          <div
            :class="
              'indicator-panel-container-category-section-phase phase' +
              healthIndicators.countryPhase
            "
            :value="healthIndicators.countryPhase"
            :data-phase="
              $t('mixed.phaseN', { number: healthIndicators.countryPhase })
            "
          ></div>
        </div>
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
      <div class="indicator-panel-container-category">
        <div
          v-for="(category, index) in healthIndicators.categories"
          class="indicator-panel-container-category-section"
        >
          <span class="indicator-panel-container-category-section-name">{{
            category.name
          }}</span>
          <div
            :class="
              'indicator-panel-container-category-section-phase phase' +
              category.phase
            "
            :value="category.phase"
            :data-phase="$t('mixed.phaseN', { number: category.phase })"
          ></div>
        </div>
      </div>
      <div class="indicator-panel-container-context">
        <div
          v-for="indicatorCategory in developmentIndicators"
          class="indicator-panel-container-context-section"
        >
          <span class="indicator-panel-container-context-name">{{
            $t(
              "worldMap.indicatorPanel." +
                Object.keys(indicatorCategory)[0].toLowerCase() +
                ".text"
            )
          }}</span>
          <div
            v-for="indicators in indicatorCategory"
            class="indicator-panel-container-context-details"
          >
            <div
              v-for="(indicator, key) in indicators"
              class="indicator-panel-container-context-details-info"
            >
              <span
                class="indicator-panel-container-context-details-info-score"
                >{{ indicator }}</span
              >
              <span
                class="indicator-panel-container-context-details-info-title"
                >{{
                  $t(
                    "worldMap.indicatorPanel." +
                      Object.keys(indicatorCategory)[0].toLowerCase() +
                      "." +
                      key
                  )
                }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="button-container"
      v-if="!showCountryDetail && !isNoGlobalHealthIndicators"
    >
      <div
        class="indicator-panel-button btn btn-primary"
        @click="showListOfCountries()"
      >
        {{ $t("worldMap.indicatorPanel.viewCountries") }}
      </div>
    </div>
    <div
      class="button-container"
      v-if="
        healthIndicators &&
        healthIndicators.categories &&
        healthIndicators.categories.length !== 0 &&
        isNoGlobalHealthIndicators
      "
    >
      <div
        class="indicator-panel-button btn btn-primary"
        @click="showCountryDetails(healthIndicators.countryId)"
      >
        {{ $t("worldMap.indicatorPanel.viewDetails") }}
      </div>
    </div>
  </div>
</template>
