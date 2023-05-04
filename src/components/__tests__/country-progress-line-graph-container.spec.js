import { createLocalVue, shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import { describe, beforeEach, it, expect, vi } from "vitest";
import CountryProgressLineGraphContainer from "../graphs/country-progress-line-graph/country-progress-line-graph-container.vue";
import { EventBus } from "../common/event-bus";
import axios from "axios";
import VueRouter from "vue-router";

const eventBusOnSpy = vi.spyOn(EventBus, "$on");
describe("Country Progress Line Graph Container", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  let wrapper;
  const yearsResponse = {
    years: ["2023", "2022", "2021"],
    defaultYear: "2023",
  };
  const yearOnYearData = {
    currentYear: "2023",
    defaultYear: "2022",
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
  };
  const axiosGetSpy = vi.spyOn(axios, "get");
  axiosGetSpy.mockImplementation(async (url) => {
    if (url.includes("year_on_year")) {
      return new Promise((resolve) => resolve({ data: yearOnYearData }));
    } else if (url.includes("distinct_year")) {
      return new Promise((resolve) => resolve({ data: yearsResponse }));
    }
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
    wrapper = shallowMount(CountryProgressLineGraphContainer, {
      propsData: {
        countryName: "India",
        locale: "en",
      },
      localVue,
      router,
    });
  });

  it("should render country progress line graph container", async () => {
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  it("should fetch yearOnYearData on mount", async () => {
    wrapper.vm.getYearOnYearData("IND");
    await flushPromises();
    expect(wrapper.vm.yearOnYearData).to.deep.equal(yearOnYearData);
  });

  it("should fetch distinct years on mount", async () => {
    await flushPromises();
    expect(wrapper.vm.years).to.deep.equal(yearsResponse.years);
  });

  it("should register event when line graph container is mounted", async () => {
    expect(eventBusOnSpy.mock.calls[0][0]).to.equal("indicator:filtered");
  });
});
