import { createLocalVue, mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import VueRouter from "vue-router";
import CountrySummary from "../countrySummary/country-summary.vue";
import { i18n } from "../../plugins/i18n";
import axios from "axios";
import flushPromises from "flush-promises";

const axiosGetSpy = vi.spyOn(axios, "get");

describe("Country Summary ", () => {
  let wrapper;

  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  let responseData = {
    countryId: "SGP",
    countryName: "Singapore",
    countryAlpha2Code: "SG",
    summary: "sdv",
    contactName: "k",
    contactDesignation: "sldjgfhv",
    contactOrganization: "dfg",
    contactEmail: "kjb@sdgnkjs.com",
    dataFeederName: "szdjk",
    dataFeederRole: "kg",
    dataFeederEmail: "sgf@saf.com",
    dataApproverName: "k",
    dataApproverRole: "kkh",
    dataApproverEmail: "khk",
    resources: ["sdfsd"],
  };

  it("should return the country data after the API call is made", async () => {
    axiosGetSpy.mockResolvedValue({ data: responseData });
    wrapper = mount(CountrySummary, {
      localVue,
      router,
      i18n,
    });
    await flushPromises();
    expect(wrapper.vm.countrySummaries).to.deep.equal(responseData);
  });

  it("should update the html based on the data recieved", async () => {
    axiosGetSpy.mockResolvedValue({ data: responseData });
    wrapper = mount(CountrySummary, {
      localVue,
      router,
      i18n,
    });
    await flushPromises();

    expect(wrapper.find(".country-summary-text").text()).to.equal(
      responseData.summary
    );
    expect(wrapper.findAll(".country-resource-link").length).to.equal(
      responseData.resources.length
    );
    expect(wrapper.find(".link-blue").attributes().href).to.equal(
      "http://sdfsd"
    );
  });

  it("should execute catch block if the API call is failed", async () => {
    axiosGetSpy.mockRejectedValue({ response: { message: "problem" } });
    wrapper = mount(CountrySummary, {
      localVue,
      router,
      i18n,
    });
    await flushPromises();
    expect(wrapper.vm.error).to.deep.equal("problem");
  });

  it("should render localization texts properly", async () => {
    axiosGetSpy.mockResolvedValue({ data: responseData });

    wrapper = mount(CountrySummary, {
      localVue,
      router,
      i18n,
    });
    await flushPromises();

    expect(wrapper.find(".country-summary-title").text()).equal(
      i18n.messages.en.countryProfile.countrySummary.text
    );
    expect(wrapper.find(".country-resource-title").text()).equal(
      i18n.messages.en.countryProfile.countrySummary.resources
    );
  });

  it("should render localization error texts properly", async () => {
    axiosGetSpy.mockRejectedValue({ response: { message: "problem" } });

    wrapper = mount(CountrySummary, {
      localVue,
      router,
      i18n,
    });
    await flushPromises();
    expect(wrapper.findAll(".error").length).to.equal(2);
    expect(wrapper.findAll(".error").at(0).text()).equal(
      i18n.messages.en.mixed.noDataAvailable
    );
    expect(wrapper.findAll(".error").at(1).text()).equal(
      i18n.messages.en.mixed.noDataAvailable
    );
  });
});
