import Vue from "vue";
import Router from "vue-router";
import content from "@/components/container/container.vue";
import indicatorsInfoComp from "@/components/indicatorsInfo/indicators-info.vue";
import headerComp from "@/components/header/header.vue";
import languageSelector from "@/components/language-selector/language-selector.vue";
import footerComp from "@/components/footer/footer.vue";
import countryProfile from "@/components/countryProfile/country-profile.vue";
import landingMap from "@/components/landing-map/map.vue";
import methodologyComp from "@/components/methodology/methodology.vue";
import healthIndicatorQuestionnaire from "@/components/healthIndicatorQuestionnaire/health-indicator-questionnare.vue";
import countryListComp from "@/components/countryList/country-list.vue";
import ErrorComp from "@/components/error-handler/404-error.vue";
import adminPageComp from "@/components/adminPage/admin-page.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "",
      components: {
        container: content,
        header: headerComp,
        footer: footerComp,
      },
      children: [
        {
          path: "/",
          redirect: "/map",
        },
        {
          path: "map",
          components: {
            routecontent: landingMap,
            languageSelect: languageSelector,
          },
          children: [
            {
              path: ":foo",
            },
          ],
        },
        {
          path: "country_profile/:countryCode",
          components: {
            routecontent: countryProfile,
            languageSelect: languageSelector,
          },
        },
        {
          path: "/indicators_info",
          components: {
            routecontent: indicatorsInfoComp,
            languageSelect: languageSelector,
          },
        },
        {
          path: "/methodology",
          components: {
            routecontent: methodologyComp,
            languageSelect: languageSelector,
          },
        },
        {
          path: "/health_indicator_questionnaire/:countryUUID",
          components: {
            routecontent: healthIndicatorQuestionnaire,
            languageSelect: languageSelector,
          },
        },
        {
          path: "/admin",
          components: {
            routecontent: adminPageComp,
            languageSelect: languageSelector,
          },
        },
        {
          path: "/country_list",
          components: {
            routecontent: countryListComp,
            languageSelect: languageSelector,
          },
        },
        {
          path: "/admin/health_indicator_questionnaire/:countryUUID/review/:currentYear",
          components: {
            routecontent: healthIndicatorQuestionnaire,
            languageSelect: languageSelector,
          },
        },
        {
          path: "/admin/health_indicator_questionnaire/:countryUUID/viewPublished/:currentYear",
          components: {
            routecontent: healthIndicatorQuestionnaire,
            languageSelect: languageSelector,
          },
        },
        {
          path: "*",
          components: {
            routecontent: ErrorComp,
          },
        },
      ],
    },
  ],
});
