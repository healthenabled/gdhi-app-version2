import { createLocalVue, shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import { describe, expect, it, beforeEach, vi } from "vitest";
import VueRouter from "vue-router";
import axios from "axios";
import { EventBus } from "../common/event-bus";
import CountryProfile from "../countryProfile/country-profile.vue";
import * as pdfHelper from "../pdfHelper/pdf-generate-scorecard.js";
import { i18n } from "../../plugins/i18n";

const eventBusOnSpy = vi.spyOn(EventBus, "$on");

describe("Country Profile ", () => {
  let wrapper;
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  const globalData = {
    countryHealthScores: [
      {
        countryId: "IND",
        countryName: "India",
        countryAlpha2Code: "IN",
        categories: [
          {
            id: 1,
            name: "Leadership and Governance",
            overallScore: 1.5,
            phase: 2,
            indicators: [
              {
                id: 1,
                code: "1",
                name: "Digital health prioritized at the national level through dedicated bodies / mechanisms for governance",
                indicatorDescription:
                  "Does the country have a separate department / agency / national working group for digital health?",
                score: 1,
                supportingText: "markr@thoughtworks.com",
                scoreDescription:
                  "No coordinating body exists and/or nascent governance structure for digital health is constituted on a case-by-case basis.",
              },
              {
                id: 2,
                code: "2",
                name: "Digital Health prioritized at the national level through planning",
                indicatorDescription:
                  "Is digital health included and budgeted for in national health or relevant national strategies and/or plan(s)?",
                score: 2,
                supportingText: "markr@thoughtworks.com",
                scoreDescription:
                  "There is some discussion of inclusion of digital health in national health or other relevant national strategies or plans. Proposed language for inclusion of digital health in national health or relevant national strategies and/or plans has been made and is under review.",
              },
            ],
          },
        ],
        countryPhase: 3,
        updatedDate: "May 2018",
      },
      {
        countryId: "MLI",
        countryName: "Mali",
        countryAlpha2Code: "ML",
        categories: [
          {
            id: 1,
            name: "Leadership and Governance",
            overallScore: 4.0,
            phase: 4,
            indicators: [
              {
                id: 1,
                code: "1",
                name: "Digital health prioritized at the national level through dedicated bodies / mechanisms for governance",
                indicatorDescription:
                  "Does the country have a separate department / agency / national working group for digital health?",
                score: 4,
                supportingText: "sdfl",
                scoreDescription:
                  "Governance structure is fully-functional, government-led, consults with other ministries, and monitors implementation of digital health based on a work plan.",
              },
              {
                id: 2,
                code: "2",
                name: "Digital Health prioritized at the national level through planning",
                indicatorDescription:
                  "Is digital health included and budgeted for in national health or relevant national strategies and/or plan(s)?",
                score: 4,
                supportingText: "sdfl",
                scoreDescription:
                  "Digital health is being implemented as part of national health or other relevant national strategies and/or plans.",
              },
            ],
          },
        ],
        countryPhase: 3,
        updatedDate: "May 2018",
      },
    ],
  };
  const healthIndicatorData = {
    countryId: "IND",
    countryName: "India",
    countryAlpha2Code: "IN",
    overallScore: 3.226190476190476,
    categories: [
      {
        id: 1,
        name: "Leadership and Governance",
        overallScore: 3.0,
        phase: 3,
        indicators: [
          {
            id: 1,
            code: "1",
            name: "Digital health prioritized at the national level through dedicated bodies / mechanisms for governance",
            indicatorDescription:
              "Does the country have a separate department / agency / national working group for digital health?",
            score: 4,
            supportingText: "sdg",
            scoreDescription:
              "Governance structure is fully-functional, government-led, consults with other ministries, and monitors implementation of digital health based on a work plan.",
          },
          {
            id: 2,
            code: "1",
            name: "Digital health prioritized at the national level through dedicated bodies / mechanisms for governance",
            indicatorDescription:
              "Does the country have a separate department / agency / national working group for digital health?",
            score: 4,
            supportingText: "sdg",
            scoreDescription:
              "Governance structure is fully-functional, government-led, consults with other ministries, and monitors implementation of digital health based on a work plan.",
          },
          {
            id: 3,
            code: "1",
            name: "Digital health prioritized at the national level through dedicated bodies / mechanisms for governance",
            indicatorDescription:
              "Does the country have a separate department / agency / national working group for digital health?",
            score: 4,
            supportingText: "sdg",
            scoreDescription:
              "Governance structure is fully-functional, government-led, consults with other ministries, and monitors implementation of digital health based on a work plan.",
          },
        ],
      },
    ],
    countryPhase: 4,
    updatedDate: "January 2018",
  };

  const govtApproved = true;
  const selectedYear = "2023";
  const benchmarkData = {
    1: {
      benchmarkScore: 5,
      benchmarkValue: "above",
    },
    2: {
      benchmarkScore: 3,
      benchmarkValue: "Below",
    },
    3: {
      benchmarkScore: 4,
      benchmarkValue: "At",
    },
  };

  const benchmarkDataForAYear = {
    1: {
      benchmarkScore: 2,
      benchmarkValue: "above",
    },
    2: {
      benchmarkScore: 1,
      benchmarkValue: "Below",
    },
    3: {
      benchmarkScore: 5,
      benchmarkValue: "At",
    },
  };

  const phaseData = [
    {
      phaseName: "phase1",
      phaseValue: 1,
    },
    {
      phaseName: "phase2",
      phaseValue: 2,
    },
  ];
  const axiosGetSpy = vi.spyOn(axios, "get");
  const generateScoreCardSpy = vi
    .spyOn(pdfHelper, "generateScorecard")
    .mockReturnValue({});

  axiosGetSpy.mockImplementation(async (url) => {
    if (url.includes("benchmark")) {
      if (url.includes("year")) {
        return new Promise((resolve) =>
          resolve({ data: benchmarkDataForAYear })
        );
      } else {
        return new Promise((resolve) => resolve({ data: benchmarkData }));
      }
    } else if (url.includes("global_health_indicators")) {
      return new Promise((resolve) => resolve({ data: globalData }));
    } else if (url.includes("countries")) {
      return new Promise((resolve) => resolve({ data: healthIndicatorData }));
    } else {
      return new Promise((resolve) => resolve({ data: phaseData }));
    }
  });

  beforeEach(() => {
    wrapper = shallowMount(CountryProfile, {
      selectedYear: null,
      localVue,
      router,
      i18n,
    });
  });

  it("should populate the data after successfull API call", async () => {
    await flushPromises();
    expect(JSON.stringify(wrapper.vm.healthIndicatorData)).to.deep.equal(
      JSON.stringify(healthIndicatorData)
    );

    wrapper.vm.initialise();
    wrapper.vm.healthIndicatorData.categories.forEach((category) => {
      expect(category["showCategory"]).to.equal(false);
    });
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  it("should have the appropriate html elements based on the data", async () => {
    await flushPromises();
    expect(wrapper.find(".country-name").text()).to.equal(
      healthIndicatorData.countryName + "  Updated on: January 2018"
    );
    expect(wrapper.find("#collected-date").text()).to.equal(
      `Updated on: January 2018`
    );
    expect(
      wrapper.find(".header-section-button-container a").attributes().href
    ).to.equal(wrapper.vm.countryDataSheetUrl());
    expect(wrapper.find(".overall-score").text()).to.equal(
      healthIndicatorData.countryPhase.toString()
    );
    expect(wrapper.findAll(".category-bar").length).to.equal(
      healthIndicatorData.categories.length
    );
    const firstCategory = wrapper.findAll(".category-bar").at(0);
    expect(firstCategory.find(".sub-header-country-profile").text()).to.equal(
      healthIndicatorData.categories[0].name
    );
    expect(firstCategory.findAll(".indicator").length).to.equal(
      healthIndicatorData.categories[0].indicators.length
    );
    const firstIndicator = firstCategory.findAll(".indicator").at(0);
    expect(firstIndicator.find(".indicator-name-value").text()).to.equal(
      healthIndicatorData.categories[0].indicators[0].name
    );
    expect(
      firstIndicator.findAll(".indicator-description").at(0).text()
    ).to.equal(
      healthIndicatorData.categories[0].indicators[0].indicatorDescription
    );
    expect(
      firstIndicator.findAll(".indicator-score-description").at(0).text()
    ).to.equal(
      healthIndicatorData.categories[0].indicators[0].scoreDescription
    );
    expect(firstIndicator.find(".indicator-score").text()).to.equal(
      healthIndicatorData.categories[0].indicators[0].score.toString()
    );
  });

  it("should updated the showCategory when the category is clicked", async () => {
    await flushPromises();
    const firstCategory = wrapper.findAll(".category-bar").at(0);
    firstCategory.find(".sub-header-country-profile").trigger("click");
    expect(wrapper.vm.healthIndicatorData.categories[0].showCategory).to.equal(
      true
    );
    firstCategory.find(".sub-header-country-profile").trigger("click");
    expect(wrapper.vm.healthIndicatorData.categories[0].showCategory).to.equal(
      false
    );
  });

  it("should register event when country page is mounted", async () => {
    expect(eventBusOnSpy.mock.calls[0][0]).to.equal("year:filtered");
    expect(eventBusOnSpy.mock.calls[1][0]).to.equal("region:filtered");
  });

  it("should call generateScorecard with the healthindicator data", async () => {
    await flushPromises();

    wrapper.vm.countrySummary = "Country Summary";
    wrapper.vm.benchmarkPhase = "Global";
    wrapper.vm.benchmarkData = benchmarkData;
    wrapper.vm.govtApproved = govtApproved;

    wrapper.findAll(".header-section-button").at(1).trigger("click");

    expect(generateScoreCardSpy.mock.calls[0]).to.deep.equal([
      {
        healthIndicatorData,
        countrySummary: wrapper.vm.countrySummary,
        benchmarkData,
        benchmarkPhase: wrapper.vm.benchmarkPhase,
        hasBenchmarkData: wrapper.vm.hasBenchmarkData,
        i18n,
        govtApproved,
      },
    ]);
  });

  it("should fetch global data for a year", async () => {
    wrapper.vm.getGlobalAverage();
    await flushPromises();
    expect(wrapper.vm.globalData).to.deep.equal(globalData);
  });

  it.skip("should load the benchmark data when the benchmark dropdown is changed when data is present", async () => {
    axiosGetSpy.mockResolvedValueOnce({ data: benchmarkData });
    await flushPromises();

    wrapper.findAll(".benchmarkDropDown option").at(1).element.selected = true;
    wrapper.find(".benchmarkDropDown").trigger("change");
    await flushPromises();
    expect(wrapper.vm.benchmarkData).to.deep.equal(benchmarkData);
    expect(wrapper.findAll(".benchmark-score").length).to.equal(
      Object.keys(benchmarkData).length
    );
    expect(wrapper.findAll(".benchmark-score").at(0).html()).equal(
      '<div class="benchmark-score"><span>Benchmark: 5</span></div>'
    );
    expect(wrapper.findAll(".benchmark-score").at(0).text()).to.equal(
      "Benchmark: " + benchmarkData["1"].benchmarkScore.toString()
    );

    expect(wrapper.findAll(".benchmarkCompare").at(0).text()).to.equal(
      "ABOVE AVG."
    );
    expect(wrapper.findAll(".benchmarkCompare").at(1).text()).to.equal(
      "BELOW AVG."
    );
    expect(wrapper.findAll(".benchmarkCompare").at(2).text()).to.equal(
      "AT AVG."
    );
  });

  it("should load the benchmark data for a selected year", async () => {
    wrapper.vm.getBenchmarkData();
    await flushPromises();

    expect(wrapper.vm.benchmarkData).to.deep.equal(benchmarkData);
  });

  it.skip("should reset the benchmark data to empty object when no value is selected", async () => {
    await flushPromises();
    wrapper.findAll(".benchmarkDropDown option").at(0).element.selected = true;
    wrapper.find(".benchmarkDropDown").trigger("change");
    await flushPromises();
    expect(wrapper.vm.benchmarkData).to.deep.equal({});
    expect(wrapper.findAll(".benchmark-score").length).to.equal(0);
  });

  it.skip("should load the benchmark data when the benchmark dropdown is changed when no data for country is present", async () => {
    let notifier = vi.fn();
    wrapper.vm.$notify = notifier;
    await flushPromises();
    axiosGetSpy.mockResolvedValueOnce({ data: {} });

    wrapper.findAll(".benchmarkDropDown option").at(1).element.selected = true;
    wrapper.find(".benchmarkDropDown").trigger("change");

    await flushPromises();

    expect(wrapper.vm.benchmarkData).to.deep.equal({});
    expect(wrapper.findAll(".benchmark-score").length).to.equal(0);
    notifier.mockReturnValue({
      group: "custom-template",
      title: "No Data",
      text: "No countries in the selected phase for benchmarking",
      type: "warn",
    });
  });

  it.skip("should call error notifier when the benchmark API call is failed", async () => {
    let notifier = vi.fn();
    wrapper.vm.$notify = notifier;
    wrapper.findAll(".benchmarkDropDown option").at(1).element.selected = true;
    axiosGetSpy.mockRejectedValueOnce({ data: { message: "problem" } });
    wrapper.find(".benchmarkDropDown").trigger("change");
    await flushPromises();
    expect(wrapper.vm.benchmarkData).to.deep.equal({});
    expect(wrapper.findAll(".benchmark-score").length).to.equal(0);
    notifier.mockReturnValue({
      group: "custom-template",
      title: "Server Error",
      text: "Unable to load benchmark data. Please try after sometime",
      type: "error",
    });
  });

  it(" should fetch phases", async () => {
    wrapper.vm.fetchPhases();

    await flushPromises();
    expect(wrapper.vm.phases).to.deep.equal(phaseData);
  });

  it(" Update the countries summary on the function call", () => {
    wrapper.vm.onSummaryLoaded("Demo Text");
    expect(wrapper.vm.countrySummary).to.equal("Demo Text");
  });

  it("should render collected on date", async () => {
    await flushPromises();
    expect(wrapper.vm.updatedDate).to.equal("Updated on: January 2018");
  });

  it("should render localization texts properly", async () => {
    await flushPromises();
    expect(
      wrapper.findAll(".header-section-button").at(0).find("p").text()
    ).equal(i18n.messages.en.countryProfile.exportCountryDataButton);

    expect(
      wrapper.findAll(".header-section-button").at(1).find("p").text()
    ).equal(i18n.messages.en.countryProfile.downloadScorecard);

    expect(
      wrapper.findAll(".title .sub-header-country-profile").at(0).text()
    ).equal(i18n.messages.en.countryProfile.overallDigitalHealthPhase);

    expect(wrapper.findAll(".phase-desc").at(0).find("p").text()).equal(
      i18n.messages.en.countryProfile.overallDigitalHealthPhaseDescription
    );

    expect(wrapper.findAll(".category-phase").at(0).text()).equal("3");

    expect(wrapper.findAll(".compare-to-header").at(0).text()).equal(
      i18n.messages.en.countryProfile.compareTo
    );
  });

  it.skip("should render localization benchmark error text", async () => {
    wrapper.setData({ hasBenchmarkData: false });
    await flushPromises();
    expect(wrapper.findAll(".phase-desc").at(1).find("span").text()).equal(
      i18n.messages.en.countryProfile.benchmark
        .benchmarkNoCountryForSelectedPhase
    );
  });
});
