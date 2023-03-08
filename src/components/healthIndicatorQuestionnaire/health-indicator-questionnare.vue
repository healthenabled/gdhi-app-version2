<template>
  <div v-if="countrySummary && questionnaire && healthIndicators">
    <span>{{ $t("") }}</span>
    <!-- Added intentionally as component does not re render on locale change if i18n library is not used in template -->
    <edit-questionnaire :showEdit="showEdit" :countrySummary="countrySummary" :questionnaire="questionnaire"
      :healthIndicators="healthIndicators" :status="status" :isAdmin="isAdmin"></edit-questionnaire>
  </div>
</template>

<script>
import Vue from "vue";

import EditQuestionnaire from "./edit-questionare.vue";
import axios from "axios";
import VeeValidate from "vee-validate";
import common from "../../common/common";

const config = {
  fieldsBagName: "fieldBags",
};
Vue.use(VeeValidate, config);

export default Vue.extend({
  components: {
    EditQuestionnaire,
  },
  data() {
    const countrySummary = {
      dataFeederName: "",
      dataFeederRole: "",
      dataFeederEmail: "",
      dataApproverName: "",
      dataApproverRole: "",
      dataApproverEmail: "",
      summary: "",
      resources: [],
      contactName: "",
      contactDesignation: "",
      contactOrganization: "",
      contactEmail: "",
    };
    const healthIndicators = {};
    return {
      questionnaire: [],
      countrySummary,
      healthIndicators,
      showEdit: true,
      status: "",
      isAdmin: false,
      isViewPublish: false,
      locale: "en",
    };
  },
  created() {
    this.showEdit = true;
    common.showLoading();
    this.isViewPublish = this.$route.path.match("viewPublished") != null;
    this.prepareDataForViewForm(this.$route.params.countryUUID);
  },
  updated() {
    if (this.locale !== this.$i18n.locale) {
      this.prepareDataForViewForm(this.$route.params.countryUUID);
      this.locale = this.$i18n.locale;
    }
  },
  methods: {
    fetchHealthScoresFor(countryUUID) {
      let config = common.configWithUserLanguageAndNoCacheHeader(
        this.$i18n.locale
      );
      if (!this.isViewPublish)
        return axios.get(`/api/countries/${countryUUID}`, config);
      else
        return axios.get(`/api/countries/viewPublish/${countryUUID}`, config);
    },
    setUpHealthIndicators(data, isExpanded) {
      data.forEach((category) => {
        this.$set(category, "showCategory", isExpanded);
        category.indicators.forEach((indicator) => {
          indicator.scores = this.reOrderIndicatorScores(indicator.scores);
          this.healthIndicators[indicator.indicatorId] = {
            categoryId: category.categoryId,
            indicatorId: indicator.indicatorId,
            score: null,
            supportingText: "",
          };
          common.hideLoading();
        });
      });
    },
    setUpDataForNewHealthIndicators(data, existingHealthIndicators) {
      let existingIndicatorIds = existingHealthIndicators.map(
        (indicator) => indicator.indicatorId
      );
      data.forEach((category) => {
        category.indicators.forEach((indicator) => {
          indicator.scores = this.reOrderIndicatorScores(indicator.scores);
          if (!existingIndicatorIds.includes(indicator.indicatorId)) {
            this.healthIndicators[indicator.indicatorId] = {
              categoryId: category.categoryId,
              indicatorId: indicator.indicatorId,
              score: null,
              supportingText: "",
            };
          }
        });
      });
    },
    reOrderIndicatorScores(scores) {
      scores.splice(scores.length - 1, 0, scores.splice(0, 1)[0]);
      return scores;
    },
    viewFormCallback(options, scores) {
      this.status = scores.data.status;
      this.isAdmin = this.$route.path.match("review") != null;
      if (this.status === "PUBLISHED" && !this.isViewPublish)
        this.$router.push({ path: "/error" });
      this.questionnaire = options.data;
      this.countrySummary = scores.data.countrySummary;
      if (scores.data.status == "REVIEW_PENDING" && !this.isAdmin) {
        this.showEdit = false;
      }
      if (this.isViewPublish) {
        this.showEdit = false;
      }
      if (scores.data.healthIndicators.length == 0) {
        this.setUpHealthIndicators(options.data, false);
      } else {
        this.setUpDataForNewHealthIndicators(
          options.data,
          scores.data.healthIndicators
        );
        options.data.forEach((category) => {
          this.$set(category, "showCategory", false);
        });
        this.transformForView(scores.data.healthIndicators);
      }
      common.hideLoading();
    },
    prepareDataForViewForm(countryUUID) {
      axios
        .all([
          axios.get(
            "/api/health_indicator_options",
            common.configWithUserLanguageAndNoCacheHeader(this.$i18n.locale)
          ),
          this.fetchHealthScoresFor(countryUUID),
        ])
        .then(axios.spread(this.viewFormCallback.bind(this)))
        .catch(() => {
          this.$router.push({ path: "/error" });
        });
    },
    transformForView(healthindicators) {
      const self = this;
      healthindicators.forEach((indicator) => {
        self.healthIndicators[indicator.indicatorId] = {
          categoryId: indicator.categoryId,
          indicatorId: indicator.indicatorId,
          score: indicator.score,
          supportingText: indicator.supportingText,
        };
      });
    },
  },
});
</script>
