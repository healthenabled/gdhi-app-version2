import { createLocalVue, shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import { describe, beforeEach, it, expect, vi } from "vitest";
import RegionBarGraphContainer from "../graphs/region-bar-graph/region-bar-graph-container.vue";
import axios from "axios";
import VueRouter from "vue-router";
import { i18n } from "../../plugins/i18n";

describe("Region Bar Graph Container", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  let wrapper;
  const regionCountriesData = {
    regionCountriesData: [
      {
        countryId: "NGA",
        countryName: "Nigeria",
        countryYearsData: [
          {
            year: "Version1",
            country: {
              categories: [
                {
                  id: 1,
                  name: "Leadership & Governance",
                  overallScore: 3.5,
                  phase: 4,
                  indicators: null,
                },
                {
                  id: 2,
                  name: "Strategy & Investment",
                  overallScore: 2.5,
                  phase: 3,
                  indicators: null,
                },
                {
                  id: 3,
                  name: "Legislation, Policy, & Compliance",
                  overallScore: 2.75,
                  phase: 3,
                  indicators: null,
                },
                {
                  id: 4,
                  name: "Workforce",
                  overallScore: 1.5,
                  phase: 2,
                  indicators: null,
                },
                {
                  id: 5,
                  name: "Standards & Interoperability",
                  overallScore: 1,
                  phase: 1,
                  indicators: null,
                },
                {
                  id: 6,
                  name: "Infrastructure",
                  overallScore: 1.5,
                  phase: 2,
                  indicators: null,
                },
                {
                  id: 7,
                  name: "Services & Applications",
                  overallScore: 1.6666666666666667,
                  phase: 2,
                  indicators: null,
                },
              ],
              countryPhase: 3,
            },
          },
        ],
      },
      {
        countryId: "MWI",
        countryName: "Malawi",
        countryYearsData: [
          {
            year: "2023",
            country: {
              categories: [
                {
                  id: 1,
                  name: "Leadership & Governance",
                  overallScore: 2,
                  phase: 2,
                  indicators: null,
                },
                {
                  id: 2,
                  name: "Strategy & Investment",
                  overallScore: 3.5,
                  phase: 4,
                  indicators: null,
                },
                {
                  id: 3,
                  name: "Legislation, Policy, & Compliance",
                  overallScore: 4,
                  phase: 4,
                  indicators: null,
                },
                {
                  id: 4,
                  name: "Workforce",
                  overallScore: 3.5,
                  phase: 4,
                  indicators: null,
                },
                {
                  id: 5,
                  name: "Standards & Interoperability",
                  overallScore: 4,
                  phase: 4,
                  indicators: null,
                },
                {
                  id: 6,
                  name: "Infrastructure",
                  overallScore: 4.5,
                  phase: 5,
                  indicators: null,
                },
                {
                  id: 7,
                  name: "Services & Applications",
                  overallScore: 4,
                  phase: 4,
                  indicators: null,
                },
              ],
              countryPhase: 4,
            },
          },
        ],
      },
    ],
  };
  const countries = ["Malawi", "Nigeria"];
  const defaultYearCountriesScore = new Map();
  defaultYearCountriesScore.set("Nigeria", {
    categories: [
      {
        id: 1,
        name: "Leadership & Governance",
        overallScore: 3.5,
        phase: 4,
        indicators: null,
      },
      {
        id: 2,
        name: "Strategy & Investment",
        overallScore: 2.5,
        phase: 3,
        indicators: null,
      },
      {
        id: 3,
        name: "Legislation, Policy, & Compliance",
        overallScore: 2.75,
        phase: 3,
        indicators: null,
      },
      {
        id: 4,
        name: "Workforce",
        overallScore: 1.5,
        phase: 2,
        indicators: null,
      },
      {
        id: 5,
        name: "Standards & Interoperability",
        overallScore: 1,
        phase: 1,
        indicators: null,
      },
      {
        id: 6,
        name: "Infrastructure",
        overallScore: 1.5,
        phase: 2,
        indicators: null,
      },
      {
        id: 7,
        name: "Services & Applications",
        overallScore: 1.6666666666666667,
        phase: 2,
        indicators: null,
      },
    ],
    countryPhase: 3,
  });
  const selectedYearCountriesScore = new Map();
  selectedYearCountriesScore.set("Malawi", {
    categories: [
      {
        id: 1,
        name: "Leadership & Governance",
        overallScore: 2,
        phase: 2,
        indicators: null,
      },
      {
        id: 2,
        name: "Strategy & Investment",
        overallScore: 3.5,
        phase: 4,
        indicators: null,
      },
      {
        id: 3,
        name: "Legislation, Policy, & Compliance",
        overallScore: 4,
        phase: 4,
        indicators: null,
      },
      {
        id: 4,
        name: "Workforce",
        overallScore: 3.5,
        phase: 4,
        indicators: null,
      },
      {
        id: 5,
        name: "Standards & Interoperability",
        overallScore: 4,
        phase: 4,
        indicators: null,
      },
      {
        id: 6,
        name: "Infrastructure",
        overallScore: 4.5,
        phase: 5,
        indicators: null,
      },
      {
        id: 7,
        name: "Services & Applications",
        overallScore: 4,
        phase: 4,
        indicators: null,
      },
    ],
    countryPhase: 4,
  });
  const axiosGetSpy = vi.spyOn(axios, "get");
  axiosGetSpy.mockImplementation(async () => {
    return new Promise((resolve) => resolve({ data: regionCountriesData }));
  });
  window.appProperties = {
    getCategoryFilter: function () {
      return "";
    },
    getPhaseFilter: function () {
      return "";
    },
  };
  beforeEach(() => {
    wrapper = shallowMount(RegionBarGraphContainer, {
      propsData: {
        defaultYear: "Version1",
        year: "2023",
        locale: "en",
      },
      i18n,
      localVue,
      router,
    });
  });

  it("should render region bar graph container", async () => {
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  it("should fetch defaultYearData on mount", async () => {
    wrapper.vm.getRegionCountriesData();
    await flushPromises();
    expect(wrapper.vm.defaultYearCountriesScore).to.deep.equal(
      defaultYearCountriesScore
    );
  });

  it("should fetch selectedYearsData on mount", async () => {
    wrapper.vm.getRegionCountriesData();
    await flushPromises();
    expect(wrapper.vm.selectedYearCountriesScore).to.deep.equal(
      selectedYearCountriesScore
    );
  });

  it("should fetch countries on mount", async () => {
    wrapper.vm.getRegionCountriesData();
    await flushPromises();
    expect(wrapper.vm.countries).to.deep.equal(countries);
  });
});
