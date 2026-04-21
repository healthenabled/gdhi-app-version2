import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import CountryProfileYearSelector from "../countryProfile/country-profile-year-selector.vue";
import { i18n } from "../../plugins/i18n";
import { createLocalVue } from "@vue/test-utils";
import VueRouter from "vue-router";
import axios from "axios";

describe("Country Profile Year Selector ", () => {
  let wrapper;
  let router;
  const setDefaultYearSpy = vi.fn();
  const getDefaultYearSpy = vi.fn();
  const axiosGetSpy = vi.spyOn(axios, "get");

  window.appProperties = {
    setDefaultYear: setDefaultYearSpy,
    getDefaultYear: getDefaultYearSpy,
  };

  const localVue = createLocalVue();
  localVue.use(VueRouter);

  beforeEach(async () => {
    router = new VueRouter({
      routes: [
        {
          path: "/country_profile/:countryCode",
          component: CountryProfileYearSelector,
        },
      ],
    });
    router.push("/country_profile/SDN");
    axiosGetSpy.mockResolvedValueOnce({
      data: ["2023", "2021", "Version1"],
    });
    wrapper = mount(CountryProfileYearSelector, {
      localVue,
      router,
      i18n,
    });
    await flushPromises();
  });

  afterEach(() => {
    axiosGetSpy.mockReset();
  });

  it("should render select year description", async () => {
    expect(wrapper.find(".select-year-desc").find("p").text()).equal(
      i18n.messages.en.countryProfile.selectYearDescription
    );
  });

  it("should render select year", async () => {
    expect(
      wrapper.findAll(".title .sub-header-country-profile").at(0).text()
    ).equal(i18n.messages.en.countryProfile.selectYear);
  });

  it("should render Year Selector", async () => {
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  it("should return the published years of a country when api call is made", async () => {
    let data = ["2023", "2021", "Version1"];
    expect(wrapper.vm.years).to.deep.equal(data);
  });

  it("should show the latest country-specific published year on initial load", async () => {
    expect(axiosGetSpy).toHaveBeenCalledTimes(1);
    expect(axiosGetSpy.mock.calls[0][0]).to.equal(
      "/api/countries/SDN/published_years"
    );
    expect(wrapper.vm.selectedYear).to.equal("2023");
    expect(wrapper.find(".year-indicator-select option").text()).to.equal(
      "2023"
    );
  });
});
