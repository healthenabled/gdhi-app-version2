<script>
import Vue from "vue";
import developmentIndicators from "../developmentIndicators/development-indicators.vue";
import countrySummary from "../countrySummary/country-summary.vue";
import axios from "axios";
import { generateScorecard } from "../pdfHelper/pdf-generate-scorecard";
import isEmpty from "lodash/isEmpty";
import Notifications from "vue-notification";
import common from "../../common/common";

Vue.use(Notifications);

export default Vue.extend({
  components: { developmentIndicators, countrySummary, Notifications },
  data() {
    return {
      healthIndicatorData: {
        countryName: "",
        countryPhase: "NA",
        categories: [],
      },
      url: "",
      benchmarkData: {},
      benchmarkPhase: "",
      phases: [],
      countrySummary: "",
      hasBenchmarkData: true,
      updatedDate: "",
      locale: "en",
    };
  },

  mounted() {
    this.getHealthIndicatorsFor(this.$route.params.countryCode);
    this.url = `/api/export_country_data/${this.$route.params.countryCode}`;
    this.fetchPhases();
  },
  updated() {
    if (this.locale !== this.$i18n.locale) {
      this.getHealthIndicatorsFor(this.$route.params.countryCode);
      if (this.healthIndicatorData && this.healthIndicatorData.updatedDate) {
        this.setUpdatedDate(this.healthIndicatorData.updatedDate);
      }
      this.locale = this.$i18n.locale;
    }
  },
  methods: {
    fetchPhases() {
      axios.get("/api/phases").then((response) => {
        this.phases = response.data;
      });
    },
    onSummaryLoaded(countrySummary) {
      this.countrySummary = countrySummary;
    },
    getHealthIndicatorsFor(countryCode) {
      axios
        .get(
          `/api/countries/${countryCode}/health_indicators`,
          common.configWithUserLanguageAndNoCacheHeader(this.$i18n.locale)
        )
        .then((response) => {
          this.healthIndicatorCallback(response);
        });
    },
    setUpdatedDate(date) {
      this.updatedDate = common.dateInLocaleFormat(date, this.$i18n);
    },

    healthIndicatorCallback(response) {
      this.healthIndicatorData = response.data;
      this.setUpdatedDate(this.healthIndicatorData.updatedDate);

      this.initialise();
    },
    onCategoryExpand(category) {
      category.showCategory = !category.showCategory;
    },
    initialise() {
      this.healthIndicatorData.categories.forEach((category) => {
        this.$set(category, "showCategory", false);
      });
    },
    generatePDF() {
      if (this.$i18n.locale === "ar") {
        window.print();
      } else {
        generateScorecard(
          this.healthIndicatorData,
          this.countrySummary,
          this.benchmarkData,
          this.benchmarkPhase,
          this.hasBenchmarkData,
          this.$i18n
        );
      }
    },
    notifier(props) {
      this.$notify({
        group: "custom-template",
        title: props.title,
        text: props.message,
        type: props.type,
      });
    },
    getBenchmarkData() {
      this.benchmarkData = {};
      this.hasBenchmarkData = true;
      if (this.benchmarkPhase === "") {
        return;
      }
      axios
        .get(
          `/api/countries/${this.$route.params.countryCode}/benchmark/${this.benchmarkPhase}`
        )
        .then((response) => {
          this.benchmarkData = response.data;
          if (isEmpty(this.benchmarkData)) {
            this.hasBenchmarkData = false;
            this.notifier({
              title: this.$i18n.t("mixed.noData"),
              message: this.$i18n.t(
                "countryProfile.benchmark.benchmarkNoCountryForSelectedPhase"
              ),
              type: "warn",
            });
          } else {
            this.healthIndicatorData.categories.forEach((category) => {
              this.$set(category, "showCategory", true);
            });
          }
        })
        .catch(() => {
          this.notifier({
            title: this.$i18n.t("mixed.serverErrorTitle"),
            message: this.$i18n.t(
              "countryProfile.benchmark.serverErrorDescription"
            ),
            type: "error",
          });
        });
    },
    countryDataSheetUrl() {
      return `/api/export_country_data/${this.$route.params.countryCode}?user_language=${this.$i18n.locale}`;
    },
    getLocaleBenchmarkValue(indicatorId) {
      const value =
        this.benchmarkData[indicatorId].benchmarkValue.toLowerCase();
      const formatMapping = {
        at: this.$i18n.t("countryProfile.benchmark.benchmarkValues.atAvg"),
        above: this.$i18n.t(
          "countryProfile.benchmark.benchmarkValues.aboveAvg"
        ),
        below: this.$i18n.t(
          "countryProfile.benchmark.benchmarkValues.belowAvg"
        ),
      };

      return formatMapping[value];
    },
  },
});
</script>

<template>
  <div class="country-detail content-width content-centered">
    <div class="health-indicator-section">
      <div class="clearfix header-section">
        <div class="country-name page-title">
          <div class="flag" :style="{
            backgroundImage:
              'url(' +
              `/static/img/flags/${this.healthIndicatorData?.countryAlpha2Code?.toLowerCase()}.svg` +
              ')',
          }"></div>
          {{ healthIndicatorData.countryName }}
        </div>
        <span id="collected-date" v-if="healthIndicatorData.updatedDate !== ''" class="copy-italics copy-grey">
          {{ updatedDate }}
        </span>
        <div class="button-container float-right">
          <div class="export">
            <span><a v-bind:href="countryDataSheetUrl()" class="btn btn-primary"><i
                  class="fa fa-file-excel-o fa-lg"></i>{{ $t("countryProfile.exportCountryDataButton") }}</a></span>
          </div>
          <button class="download-btn btn btn-primary" @click="generatePDF()">
            <i class="fa fa-download" aria-hidden="true"></i>
            {{ $t("countryProfile.downloadScorecard") }}
          </button>
        </div>
      </div>
      <div class="row">
        <div class="column-60percent">
          <div class="box overall-card">
            <div class="title">
              <div class="title sub-header">
                {{ $t("countryProfile.overallDigitalHealthPhase") }}
              </div>
              <div class="phase-desc copy-italics copy-grey">
                <p>
                  {{
                    $t("countryProfile.overallDigitalHealthPhaseDescription")
                  }}
                </p>
              </div>
            </div>
            <div :class="'overall-score ' + locale">
              <div :class="'score ' + ' phase' + healthIndicatorData.countryPhase">
                {{
                  healthIndicatorData.countryPhase
                  ? healthIndicatorData.countryPhase
                  : "NA"
                }}
              </div>
            </div>
          </div>
          <div class="box">
            <div class="title sub-header">
              <span class="benchmark-dropdown-container">{{
                $t("countryProfile.benchmark.text")
              }}</span>
              <div v-if="healthIndicatorData" class="float-right">
                <select class="benchmarkDropDown" name="benchmarkDropDown" v-model="benchmarkPhase"
                  @change="getBenchmarkData()">
                  <option value="">-</option>
                  <option value="-1">
                    {{
                      $t(
                        "countryProfile.benchmark.benchmarkValues.globalAverage"
                      )
                    }}
                  </option>
                  <option v-for="phase in phases" v-bind:value="phase.phaseValue">
                    {{ $t("mixed.phaseN", { number: phase.phaseValue }) }}
                  </option>
                </select>
              </div>
            </div>
            <div class="phase-desc copy-italics copy-grey">
              <p>
                {{ $t("countryProfile.benchmark.benchmarkDescription") }}
              </p>
              <span v-if="!hasBenchmarkData" class="error-info">{{
                $t(
                  "countryProfile.benchmark.benchmarkNoCountryForSelectedPhase"
                )
              }}</span>
            </div>
          </div>
          <div v-if="healthIndicatorData" class="health-indicators">
            <div v-for="(category, index) in healthIndicatorData.categories"
              class="indicator-panel-container-category-section">
              <div class="category-bar box">
                <div v-bind:class="
                  category.showCategory ? 'accordion expanded' : 'accordion'
                ">
                  <div class="indicator-panel-container-category-section-name sub-header"
                    @click="onCategoryExpand(category, index)">
                    {{ category.name }}
                  </div>
                  <div :class="
                    'indicator-panel-container-category-section-phase phase' +
                    category.phase
                  " :value="category.phase" :data-phase="$t('mixed.phaseN', { number: category.phase })"></div>
                  <div class="accordion-content">
                    <div class="heading-row sub-header">
                      <div class="indicator-id">#</div>
                      <div class="indicator-name">
                        {{ $t("countryProfile.indicator") }}
                      </div>
                      <div :class="'indicator-score-heading ' + locale">
                        {{ $t("countryProfile.score") }}
                      </div>
                    </div>
                    <div v-for="(
                              indicator, index_indicator
                            ) in category.indicators" class="indicator">
                      <div class="indicator-id">{{ indicator.code }}</div>
                      <div class="indicator-desc">
                        <span class="indicator-name-value">{{
                          indicator.name
                        }}</span>
                        <div class="indicator-score-desc copy-italics copy-grey">
                          {{ indicator.indicatorDescription }}
                        </div>
                        <div class="indicator-score-desc copy-italics copy-blue">
                          {{ indicator.scoreDescription }}
                        </div>
                      </div>
                      <div :class="'text-center score-container ' + locale">
                        <div :class="
                          'indicator-score' + ' phase' + indicator.score
                        ">
                          {{ indicator.score >= 0 ? indicator.score : "NA" }}
                        </div>
                        <div v-if="benchmarkData[indicator.id.toString()]" class="benchmark copy-small">
                          <div class="benchmark-score">
                            <span>{{
                              $t("countryProfile.benchmark.textWithData", {
                                data: benchmarkData[indicator.id]
                                  .benchmarkScore,
                              })
                            }}</span>
                          </div>
                          <div :class="
                            'benchmarkCompare ' +
                            benchmarkData[
                              indicator.id
                            ].benchmarkValue.toLowerCase()
                          ">
                            {{ getLocaleBenchmarkValue(indicator.id) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column-40percent">
          <div class="health-indicator-container">
            <development-indicators></development-indicators>
          </div>
          <div class="country-summary-container box">
            <country-summary @summaryLoaded="onSummaryLoaded"></country-summary>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
