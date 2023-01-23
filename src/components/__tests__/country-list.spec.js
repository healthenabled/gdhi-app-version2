import { createLocalVue, mount } from "@vue/test-utils";
import VueRouter from "vue-router";
import CountryList from "../countryList/countryList.vue";
import moxios from "moxios";
import { i18n } from "../../plugins/i18n";

describe("Country List", () => {
  let wrapper;

  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  window.appProperties = {
    getCategoryFilter: function () {
      return "";
    },
    getPhaseFilter: function () {
      return "";
    },
  };
  let responseData = {
    countryHealthScores: [
      {
        countryId: "IND",
        countryName: "India",
        countryAlpha2Code: "IN",
        overallScore: 3.226190476190476,
        countryPhase: 4,
        collectedDate: "January 2018",
      },
      {
        countryId: "SGP",
        countryName: "Singapore",
        countryAlpha2Code: "SG",
        overallScore: 3.619047619047619,
        countryPhase: null,
        collectedDate: "November 2018",
      },
    ],
  };
  beforeEach(() => {
    moxios.install();
    wrapper = mount(CountryList, {
      localVue,
      router,
      i18n,
    });
    moxios.stubRequest(
      "/api/countries_health_indicator_scores?categoryId=&phase=",
      {
        status: 200,
        response: responseData,
      }
    );
  });
  it(" should render one li for each country", (done) => {
    moxios.wait(() => {
      expect(wrapper.vm.globalHealthIndicators).to.deep.equal(
        responseData.countryHealthScores
      );
      expect(
        wrapper.findAll(".countries-list-details-country").length
      ).to.equal(responseData.countryHealthScores.length);
      done();
    });
  });

  it(" should display the correct country score and name", (done) => {
    moxios.wait(() => {
      expect(
        wrapper
          .findAll(".countries-list-details-country")
          .at(0)
          .find(".country-score")
          .text()
      ).to.equal(responseData.countryHealthScores[0].countryPhase.toString());
      expect(
        wrapper
          .findAll(".countries-list-details-country")
          .at(0)
          .find(".country-name")
          .text()
      ).to.equal(responseData.countryHealthScores[0].countryName);
      expect(
        wrapper
          .findAll(".countries-list-details-country")
          .at(1)
          .find(".country-score")
          .text()
      ).to.equal("NA");
      done();
    });
  });

  it(" should navigate to correct country url when clicking on the country name", (done) => {
    moxios.wait(() => {
      wrapper
        .findAll(".countries-list-details-country")
        .at(0)
        .find(".country-name")
        .trigger("click");
      expect(wrapper.vm.$route.path).to.equal(
        `/country_profile/${responseData.countryHealthScores[0].countryId}`
      );
      done();
    });
  });

  it("should render localization texts properly", (done) => {
    moxios.wait(() => {
      expect(wrapper.find(".page-title").text()).equal(
        i18n.messages.en.countryList.title
      );
      expect(wrapper.find(".export-button").text()).equal(
        i18n.messages.en.countryList.exportButtonText
      );
      expect(
        wrapper
          .find(".countries-list-section-description")
          .findAll("p")
          .at(0)
          .text()
      ).equal(i18n.messages.en.countryList.line1);
      expect(
        wrapper
          .find(".countries-list-section-description")
          .findAll("p")
          .at(1)
          .text()
      ).equal(i18n.messages.en.countryList.line2);
      done();
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });
});
