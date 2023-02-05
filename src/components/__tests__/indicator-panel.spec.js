import { shallowMount, createLocalVue } from "@vue/test-utils";
import VueRouter from "vue-router";
import IndicatorPanel from "../indicatorPanel/indicator-panel.vue";
import sinon from "sinon";
import Obj from "../../common/indicator-http-requests.js";
import { i18n } from "../../plugins/i18n";
import { en, es } from "../../static-content/index";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import axios from "axios";
import flushPromises from "flush-promises";

const axiosGetSpy = vi.spyOn(axios, "get");

describe("Indicator Panel", () => {
  let wrapper;
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();

  const messages = {
    en,
    es,
  };

  let overallScoreData = {
    overAllScore: 3,
    categories: [
      {
        id: 1,
        name: "Leadership and Governance",
        overallScore: 2.4375,
        phase: 3,
        indicators: null,
      },
      {
        id: 2,
        name: "Strategy and Investment",
        overallScore: 2.9285714285714284,
        phase: 3,
        indicators: null,
      },
    ],
  };
  let countryData = {
    countryId: "IND",
    countryName: "India",
    countryAlpha2Code: "IN",
    categories: [
      {
        id: 1,
        name: "Leadership and Governance",
        overallScore: 1.0,
        phase: 1,
        indicators: [
          {
            id: 1,
            code: "1",
            name: "Digital health prioritized at the national level through dedicated bodies / mechanisms for governance",
            indicatorDescription:
              "Does the country have a separate department / agency / national working group for digital health?",
            score: 1,
            supportingText: "devbox",
            scoreDescription:
              "No coordinating body exists and/or nascent governance structure for digital health is constituted on a case-by-case basis.",
          },
          {
            id: 2,
            code: "2",
            name: "Digital Health prioritized at the national level through planning",
            indicatorDescription:
              "Is digital health included and budgeted for in national health or relevant national strategies and/or plan(s)?",
            score: -1,
            supportingText: "fdsf",
            scoreDescription: "Not Available or Not Applicable",
          },
        ],
      },
    ],
    countryPhase: 3,
    collectedDate: "February 2015",
  };
  window.appProperties = {
    getCategoryFilter: function () {
      return "";
    },
    getPhaseFilter: function () {
      return "";
    },
  };
  beforeEach(async () => {
    axiosGetSpy.mockResolvedValue({ data: overallScoreData });

    wrapper = shallowMount(IndicatorPanel, {
      localVue,
      router,
      i18n,
    });
    await flushPromises();
  });
  it("should update the variables with indicator data for the global", () => {
    let outputData = {
      overallCountryScore: overallScoreData.overAllScore,
      categories: overallScoreData.categories,
    };
    expect(wrapper.vm.globalHealthIndicators).to.deep.equal(outputData);
    expect(wrapper.vm.showCountryDetail).to.equal(false);
    expect(wrapper.vm.isNoGlobalHealthIndicators).to.equal(false);
  });

  it("should update the variables with indicator data for the country data", async () => {
    axiosGetSpy.mockResolvedValue({ data: countryData });

    wrapper.vm.getHealthIndicators("", "1");
    await flushPromises();
    const healthIndicatorsData = {
      countryId: countryData.countryId,
      countryName: countryData.countryName,
      categories: countryData.categories,
      countryPhase: countryData.countryPhase,
    };

    expect(wrapper.vm.healthIndicators).to.deep.equal(healthIndicatorsData);
    expect(wrapper.vm.showCountryDetail).to.equal(true);
    expect(wrapper.vm.isNoGlobalHealthIndicators).to.equal(true);
  });

  it("should return title based on the filter ", async () => {
    let returnStr = wrapper.vm.getIndicatorContainerName();
    expect(returnStr).to.deep.equal(
      "State of Digital Health around the world today"
    );

    wrapper.vm.phaseFilter = true;
    returnStr = wrapper.vm.getIndicatorContainerName();
    expect(returnStr).to.deep.equal("Overall");

    wrapper.vm.categoryFilter = true;
    returnStr = wrapper.vm.getIndicatorContainerName();
    expect(returnStr).to.deep.equal(overallScoreData.categories[0].name);

    wrapper.vm.globalHealthIndicators = {
      overAllScore: null,
      categories: [],
    };
    returnStr = wrapper.vm.getIndicatorContainerName();
    expect(returnStr).to.deep.equal(
      "No countries available for the selected criteria"
    );
  });

  it("should return phase title based on the filter ", async () => {
    wrapper.vm.categoryFilter = true;
    let returnStr = wrapper.vm.getPhaseTitle();
    expect(returnStr).to.deep.equal("Global Average");

    wrapper.vm.phaseFilter = 5;
    returnStr = wrapper.vm.getPhaseTitle();
    expect(returnStr).to.deep.equal("Phase 5");
  });

  it("should push the url when showcountrydetails is called ", async () => {
    let mockFn = vi.spyOn(router, "push").mockReturnValue({});
    wrapper.vm.showCountryDetails("IND");
    await flushPromises();
    expect(mockFn.mock.calls[0][0]).to.deep.equal({
      path: `/country_profile/IND`,
    });
    router.push.restore();
  });

  it("should push the url when showlistofcountries is called ", async () => {
    let mockFn = vi.spyOn(router, "push").mockReturnValue({});

    wrapper.vm.showListOfCountries();
    await flushPromises();

    expect(mockFn.mock.calls[0][0]).to.deep.equal({
      path: "/country_list",
    });
  });

  it(" should respond with development indicators for the selected country", async () => {
    let responseData = {
      gniPerCapita: 1000,
      totalPopulation: 1000000,
      adultLiteracy: 70.22,
      doingBusinessIndex: 22.22,
      lifeExpectancy: 60,
      healthExpenditure: 22.23,
      totalNcdDeathsPerCapita: 22.2,
      under5Mortality: 22,
    };
    const developmentIndicatorsData = [
      {
        CONTEXT: {
          gniPerCapita: Obj.getGNIPerCapitaInKilo(responseData.gniPerCapita),
          totalPopulation: Obj.getTotalPopulationInMillion(
            responseData.totalPopulation
          ),
        },
      },
      {
        HEALTH: {
          lifeExpectancy: Obj.getValue(responseData.lifeExpectancy),
          healthExpenditure: Obj.getInPercenatge(
            responseData.healthExpenditure
          ),
        },
      },
    ];
    axiosGetSpy.mockResolvedValue({ data: responseData });
    wrapper.vm.getIndicators("", "1");

    await flushPromises();
    expect(wrapper.vm.developmentIndicators).to.deep.equal(
      developmentIndicatorsData
    );
  });
});
