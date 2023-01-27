import { shallowMount } from "@vue/test-utils";
import Map from "../landing-map/map.vue";
import moxios from "moxios";
import sinon from "sinon";
import worldMap from "../landing-map/world-map.js";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { i18n } from "../../plugins/i18n";

describe("Map ", () => {
  let wrapper;
  let mockWorldMap;
  let setCategoryFilterMock = sinon.spy();
  let setPhaseFilterMock = sinon.spy();
  window.appProperties = {
    getCategoryFilter: () => {
      return "";
    },
    getPhaseFilter: () => {
      return "";
    },
    setCategoryFilter: setCategoryFilterMock,
    setPhaseFilter: setPhaseFilterMock,
  };
  let globalData = {
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
        collectedDate: "May 2018",
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
        collectedDate: "May 2018",
      },
    ],
  };
  let healthIndicatorData = [
    {
      categoryId: 1,
      categoryName: "Leadership and Governance",
      indicators: [
        {
          indicatorId: 1,
          indicatorCode: "1",
          indicatorName:
            "Digital health prioritized at the national level through dedicated bodies / mechanisms for governance",
          indicatorDefinition:
            "Does the country have a separate department / agency / national working group for digital health?",
          scores: [
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
            {
              score: 1,
              scoreDefinition:
                "No coordinating body exists and/or nascent governance structure for digital health is constituted on a case-by-case basis.",
            },
            {
              score: 2,
              scoreDefinition:
                "Governance structure is formally constituted though not fully-functional or meeting regularly.",
            },
            {
              score: 3,
              scoreDefinition:
                "Governance structure and any related working groups have a scope of work (SOW) and conduct regular meetings with stakeholder participation and/or consultation.",
            },
            {
              score: 4,
              scoreDefinition:
                "Governance structure is fully-functional, government-led, consults with other ministries, and monitors implementation of digital health based on a work plan.",
            },
            {
              score: 5,
              scoreDefinition:
                "The digital health governance structure is institutionalized, consults with other ministries, and monitors implementation of digital health. It is relatively protected from interference or organizational changes. It is nationally recognized as the lead for digital health.The governance structure and its technical working groups emphasize gender balance in membership.",
            },
          ],
        },
      ],
    },
  ];
  beforeEach(() => {
    moxios.install();
    moxios.stubRequest(/\/api\/countries_health_indicator_scores.*/, {
      status: 200,
      response: globalData,
    });
    moxios.stubRequest(/\/api\/health_indicator_options/, {
      status: 200,
      response: healthIndicatorData,
    });
  });

  it(" should fetch phases", (done) => {
    let phaseData = [
      {
        phaseName: "phase1",
        phaseValue: 1,
      },
      {
        phaseName: "phase2",
        phaseValue: 2,
      },
    ];
    moxios.install();
    moxios.stubRequest("/api/phases", {
      status: 200,
      response: phaseData,
    });
    wrapper = shallowMount(Map, { i18n });
    vi.spyOn(worldMap, "drawMap").mockReturnValue({});
    wrapper.vm.fetchPhases();
    moxios.wait(() => {
      expect(wrapper.vm.phases).to.deep.equal(phaseData);
      worldMap.drawMap.restore();
      done();
    });
  });

  it(" should set the window properties when the filter method is called and fetch the fetchGlobalIndices", (done) => {
    wrapper = shallowMount(Map, { i18n });
    vi.spyOn(worldMap, "drawMap").mockReturnValue({});

    wrapper.vm.categoryValue = 1;
    wrapper.vm.phaseValue = 1;
    wrapper.vm.filter();
    sinon.assert.calledWith(setCategoryFilterMock, { categoryId: 1 });
    sinon.assert.calledWith(setPhaseFilterMock, { phaseId: 1 });
    moxios.wait(() => {
      expect(wrapper.vm.globalHealthIndicators).to.deep.equal(
        globalData.countryHealthScores
      );
      worldMap.drawMap.restore();
      done();
    });
  });

  it(" should reset the local values when the reset method is called", (done) => {
    wrapper = shallowMount(Map, { i18n });
    vi.spyOn(worldMap, "drawMap").mockReturnValue({});

    wrapper.vm.resetFilters();
    sinon.assert.calledWith(setCategoryFilterMock, { categoryId: "" });
    sinon.assert.calledWith(setPhaseFilterMock, { phaseId: "" });
    expect(wrapper.vm.categoryValue).to.equal("");
    expect(wrapper.vm.phaseValue).to.equal("");
    moxios.wait(() => {
      worldMap.drawMap.restore();
      done();
    });
  });
  it("should update the value for categories when fetchCategoricalIndicators is called ", (done) => {
    wrapper = shallowMount(Map, { i18n });
    vi.spyOn(worldMap, "drawMap").mockReturnValue({});

    wrapper.vm.fetchCategoricalIndicators();
    moxios.wait(() => {
      expect(wrapper.vm.categories).to.deep.equal(healthIndicatorData);
      worldMap.drawMap.restore();
      done();
    });
  });

  it("should emit map clicked event when onCountrySelection is called", (done) => {
    wrapper = shallowMount(Map, { i18n });
    vi.spyOn(worldMap, "drawMap").mockReturnValue({});

    wrapper.vm.onCountrySelection("IND");
    expect(wrapper.emitted("Map:Clicked").length).to.equal(1);
    expect(wrapper.emitted("Map:Clicked")[0]).to.deep.equal(["IND"]);
    moxios.wait(() => {
      worldMap.drawMap.restore();
      done();
    });
  });

  it("should call worldMap handleSearch when onSearchTriggered is called", (done) => {
    wrapper = shallowMount(Map, { i18n });
    vi.spyOn(worldMap, "drawMap").mockReturnValue({});

    let mockFn1 = sinon.stub(worldMap, "handleSearch").callsFake(() => {});
    wrapper.vm.onSearchTriggered("IND");
    expect(mockFn1.getCall(0).args[0]).to.deep.equal("IND");
    moxios.wait(() => {
      worldMap.handleSearch.restore();
      worldMap.drawMap.restore();
      done();
    });
  });
});
