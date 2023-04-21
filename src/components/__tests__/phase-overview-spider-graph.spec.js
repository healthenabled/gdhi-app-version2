import { mount } from "@vue/test-utils";
import { describe, beforeEach, it, expect, vi } from "vitest";
import PhaseOverviewSpiderGraph from "../graphs/phase-overview-spider-graph/phase-overview-spider-graph.vue";
import Chart from "chart.js/auto";

describe("Phase OverView Spider Graph", () => {
  let wrapper;
  vi.mock("chart.js/auto");
  beforeEach(() => {
    wrapper = mount(PhaseOverviewSpiderGraph, {
      propsData: {
        countryDataCategories: [
          { name: "Phase1", phase: 1 },
          { name: "Phase2", phase: 2 },
          { name: "Phase3", phase: 3 },
          { name: "Phase4", phase: 4 },
        ],
        regionalDataCategories: [
          { phase: 1 },
          { phase: 1 },
          { phase: 2 },
          { phase: 2 },
        ],
        countryName: "Sample Country Name",
      },
    });
  });
  it("should render Graph when mounted and create a new Chart instance", () => {
    expect(wrapper.vm.$el).toMatchSnapshot();
    vi.useFakeTimers();
    vi.advanceTimersByTime(700);
    expect(Chart.mock.calls.length).toEqual(1);
    expect(Chart.mock.calls[0][1]).toMatchSnapshot();
    // TODO: Fix mock of ChartJS to be able to assert watch call
    // wrapper.vm.$options.watch.countryDataCategories.call();
  });
});
