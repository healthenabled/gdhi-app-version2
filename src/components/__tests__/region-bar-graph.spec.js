import { mount } from "@vue/test-utils";
import { describe, beforeEach, it, expect, vi } from "vitest";
import RegionBarGraph from "../graphs/region-bar-graph/region-bar-graph.vue";
import Chart from "chart.js/auto";

describe("Region Bar Graph Liner", () => {
  let wrapper;
  vi.mock("chart.js/auto");
  beforeEach(() => {
    wrapper = mount(RegionBarGraph, {
      propsData: {
        selectedYearData: new Map(),
        defaultYearData: new Map(),
        categoryFilter: 0,
        labels: [],
      },
    });
  });
  it("should render Graph when mounted and create a new Chart instance", () => {
    expect(wrapper.vm.$el).toMatchSnapshot();
    expect(Chart.mock.calls.length).toEqual(1);
    expect(Chart.mock.calls[0][1]).toMatchSnapshot();
  });
});
