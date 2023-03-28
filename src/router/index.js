import Vue from "vue";
import Router from "vue-router";
const content = () => import("@/components/container/container.vue");
const indicatorsInfoComp = () =>
  import("@/components/indicatorsInfo/indicators-info.vue");
const headerComp = () => import("@/components/header/header.vue");
const languageSelector = () =>
  import("@/components/language-selector/language-selector.vue");
const footerComp = () => import("@/components/footer/footer.vue");
const countryProfile = () =>
  import("@/components/countryProfile/country-profile.vue");
const landingMap = () => import("@/components/landing-map/map.vue");
const methodologyComp = () =>
  import("@/components/methodology/methodology.vue");
const healthIndicatorQuestionnaire = () =>
  import(
    "@/components/healthIndicatorQuestionnaire/health-indicator-questionnare.vue"
  );
const countryListComp = () =>
  import("@/components/countryList/country-list.vue");
const ErrorComp = () => import("@/components/error-handler/404-error.vue");
const adminPageComp = () => import("@/components/adminPage/admin-page.vue");

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
