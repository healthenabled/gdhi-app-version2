import { mount } from "@vue/test-utils";
import { describe, beforeEach, it, expect, vi, vitest } from "vitest";
import RegionBarGraph from "../graphs/region-bar-graph/region-bar-graph.vue";
import Chart from "chart.js/auto";
import { i18n } from "../../plugins/i18n";

describe("Region Bar Graph Liner", () => {
  let wrapper;
  vi.mock("chart.js/auto");
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
  beforeEach(() => {
    vitest.useFakeTimers();
    wrapper = mount(RegionBarGraph, {
      propsData: {
        selectedYearData: selectedYearCountriesScore,
        defaultYearData: defaultYearCountriesScore,
        categoryFilter: 0,
        labels: [],
      },
      i18n,
    });
  });
  it("should render Graph when mounted and create a new Chart instance", () => {
    vitest.advanceTimersByTime(100);
    expect(wrapper.vm.$el).toMatchSnapshot();
    expect(Chart.mock.calls.length).toEqual(1);
    expect(Chart.mock.calls[0][1]).toMatchSnapshot();
  });
});
