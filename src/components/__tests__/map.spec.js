import { shallowMount } from "@vue/test-utils";
import Map from "../landingMap/map.vue";
import sinon from "sinon";
import worldMap from "../landingMap/world-map.js";
import { EventBus } from "../common/event-bus";
import { describe, it, expect, beforeEach, vi } from "vitest";
import axios from "axios";
import { i18n } from "../../plugins/i18n";
import flushPromises from "flush-promises";

const axiosGetSpy = vi.spyOn(axios, "get");
const eventBusSpy = vi.spyOn(EventBus, "$emit");

describe("Map ", () => {
  let wrapper;
  let mockWorldMap;
  let setPhaseFilterMock = sinon.spy();
  window.appProperties = {
    getCategoryFilter: () => {
      return "";
    },
    getPhaseFilter: () => {
      return "";
    },
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
  beforeEach(() => {
    axiosGetSpy.mockImplementation(async (url) => {
      if (url.includes("countries_health_indicator_scores")) {
        return new Promise((resolve) => {
          resolve({ data: globalData });
        });
      }
    });
  });

  it(" should fetch the fetchGlobalIndices", async () => {
    vi.spyOn(worldMap, "drawMap").mockReturnValue({});
    wrapper = shallowMount(Map, { i18n });
    await flushPromises();
    expect(wrapper.vm.globalHealthIndicators).to.deep.equal(
      globalData.countryHealthScores
    );
    worldMap.drawMap.restore();
  });

  it(" should emit reset filter when resetFilter method is called", async () => {
    vi.spyOn(worldMap, "drawMap").mockReturnValue({});

    wrapper = shallowMount(Map, { i18n });
    await flushPromises();

    wrapper.vm.resetFilters();
    await flushPromises();

    expect(eventBusSpy.mock.calls[0][0]).toBe("Reset:Filters");
    worldMap.drawMap.restore();
  });

  it("should emit map clicked event when onCountrySelection is called", async () => {
    vi.spyOn(worldMap, "drawMap").mockReturnValue({});

    wrapper = shallowMount(Map, { i18n });
    await flushPromises();

    wrapper.vm.onCountrySelection("IND");
    await flushPromises();

    expect(wrapper.emitted("Map:Clicked").length).to.equal(1);
    expect(wrapper.emitted("Map:Clicked")[0]).to.deep.equal(["IND"]);
    worldMap.drawMap.restore();
  });

  it("should call worldMap handleSearch when onSearchTriggered is called", async () => {
    vi.spyOn(worldMap, "drawMap").mockReturnValue({});

    wrapper = shallowMount(Map, { i18n });

    await flushPromises();

    let mockFn1 = sinon.stub(worldMap, "handleSearch").callsFake(() => {});
    wrapper.vm.onSearchTriggered("IND");
    await flushPromises();

    expect(mockFn1.getCall(0).args[0]).to.deep.equal("IND");
    worldMap.handleSearch.restore();
    worldMap.drawMap.restore();
  });
});
