import { createLocalVue, mount } from "@vue/test-utils";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import VueRouter from "vue-router";
import CountryList from "../countryList/country-list.vue";
import { i18n } from "../../plugins/i18n";
import axios from "axios";
import flushPromises from "flush-promises";

const axiosGetSpy = vi.spyOn(axios, "get");

describe("Country List", () => {
  let wrapper;

  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  window.appProperties = {
    getCategoryFilter: function () {
      return "";
    },
    getPhaseFilter: function () {
      return "";
    },
  };
  let responseData = {
    countryHealthScores: [
      {
        countryId: "IND",
        countryName: "India",
        countryAlpha2Code: "IN",
        overallScore: 3.226190476190476,
        countryPhase: 4,
        updatedDate: "January 2018",
      },
      {
        countryId: "SGP",
        countryName: "Singapore",
        countryAlpha2Code: "SG",
        overallScore: 3.619047619047619,
        countryPhase: null,
        updatedDate: "November 2018",
      },
    ],
  };
  beforeEach(async () => {
    axiosGetSpy.mockResolvedValue({ data: responseData });
    wrapper = mount(CountryList, {
      localVue,
      router,
      i18n,
    });
    await flushPromises();
  });
  it(" should render one li for each country", () => {
    expect(wrapper.vm.globalHealthIndicators).to.deep.equal(
      responseData.countryHealthScores
    );
    expect(wrapper.findAll(".countries-list-details-country").length).to.equal(
      responseData.countryHealthScores.length
    );
  });

  it(" should display the correct country score and name", () => {
    expect(
      wrapper
        .findAll(".countries-list-details-country")
        .at(0)
        .find(".country-score")
        .text()
    ).to.equal(responseData.countryHealthScores[0].countryPhase.toString());
    expect(
      wrapper
        .findAll(".countries-list-details-country")
        .at(0)
        .find(".country-name")
        .text()
    ).to.equal(responseData.countryHealthScores[0].countryName);
    expect(
      wrapper
        .findAll(".countries-list-details-country")
        .at(1)
        .find(".country-score")
        .text()
    ).to.equal("NA");
  });

  it(" should navigate to correct country url when clicking on the country name", () => {
    wrapper
      .findAll(".countries-list-details-country")
      .at(0)
      .find(".country-name")
      .trigger("click");
    expect(wrapper.vm.$route.path).to.equal(
      `/country_profile/${responseData.countryHealthScores[0].countryId}`
    );
  });

  it("should render localization texts properly", () => {
    expect(wrapper.find(".page-title").text()).equal(
      i18n.messages.en.countryList.title
    );
    expect(wrapper.find(".export-button").text()).equal(
      i18n.messages.en.countryList.exportButtonText
    );
    expect(
      wrapper
        .find(".countries-list-section-description")
        .findAll("p")
        .at(0)
        .text()
    ).equal(i18n.messages.en.countryList.line1);
    expect(
      wrapper
        .find(".countries-list-section-description")
        .findAll("p")
        .at(1)
        .text()
    ).equal(i18n.messages.en.countryList.line2);
  });
});
