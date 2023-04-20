import { mount } from "@vue/test-utils";
import { describe, beforeEach, it, expect, vi } from "vitest";
import CountryProgressLineChart from "../graphs/country-progress-line-graph/country-progress-line-graph-chart.vue";
import Chart from "chart.js/auto";

describe("Country Progress Line Chart", () => {
  let wrapper;
  vi.mock("chart.js/auto");
  beforeEach(() => {
    wrapper = mount(CountryProgressLineChart, {
      propsData: {
        currentYear: "2023",
        defaultYear: "2022",
        categoryFilter: 0,
        locale: "en",
        countryName: "India",
        xAxisLabels: ["2020", "2021", "2022", "2023", "2024"],
        yearOnYearData: [
          {
            year: "2023",
            data: {
              country: {
                countryId: "IND",
                countryName: "India",
                countryAlpha2Code: "IN",
                categories: [],
                countryPhase: 3,
                updatedDate: "",
              },
              average: {},
            },
          },
        ],
      },
    });
  });
  it("should render Graph when mounted and create a new Chart instance", () => {
    expect(wrapper.vm.$el).toMatchSnapshot();
    expect(Chart.mock.calls.length).toEqual(1);
    expect(Chart.mock.calls[0][1]).toMatchSnapshot();
  });
});
