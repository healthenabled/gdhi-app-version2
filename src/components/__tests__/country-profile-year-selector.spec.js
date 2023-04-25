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
  const setDefaultYearSpy = vi.fn();
  const getDefaultYearSpy = vi.fn();
  const axiosGetSpy = vi.spyOn(axios, "get");

  window.appProperties = {
    setDefaultYear: setDefaultYearSpy,
    getDefaultYear: getDefaultYearSpy,
  };

  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();

  beforeEach(async () => {
    axiosGetSpy.mockResolvedValueOnce({
      data: { years: ["Version 1", "2022", "2023"], defaultYear: "2022" },
    });
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
});
