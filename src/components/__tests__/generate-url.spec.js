import { mount } from "@vue/test-utils";
import { describe, beforeEach, it, expect, vi } from "vitest";
import GenerateURL from "../generateUrl/generate-url.vue";
import sortBy from "lodash/sortBy";
import Autocomplete from "vuejs-auto-complete";
import sinon from "sinon";
import { i18n } from "../../plugins/i18n";
import axios from "axios";
import flushPromises from "flush-promises";

describe("Generate URL ", () => {
  let wrapper;
  let countryData = [
    { id: "IND", name: "India", countryAlpha2Code: "IN" },
    { id: "USA", name: "United States of America", countryAlpha2Code: "US" },
    { id: "POL", name: "Poland", countryAlpha2Code: "PL" },
    { id: "AUS", name: "Australia", countryAlpha2Code: "AU" },
  ];

  const axiosGetSpy = vi.spyOn(axios, "get");
  const axiosPostSpy = vi.spyOn(axios, "post");

  beforeEach(() => {
    axiosGetSpy.mockReset();
    axiosPostSpy.mockReset();
    axiosGetSpy.mockResolvedValue({ data: countryData });
    wrapper = mount(GenerateURL, { i18n });
  });
  it("should load the countries after hitting the API", async () => {
    await flushPromises();
    const sortedArray = sortBy(countryData, "name");
    expect(wrapper.vm.countries).to.deep.equal(sortedArray);
    const autocompleteComp = wrapper.find(Autocomplete);
    expect(autocompleteComp.props().source).to.deep.equal(sortedArray);
  });
  it("should set the appropriate data when the onCountrySelect method is called", async () => {
    await flushPromises();
    wrapper.vm.onCountrySelect({
      value: "AUS",
      display: "Australia",
      selectedObject: countryData[3],
    });
    expect(wrapper.vm.generatedURL).to.equal("");
    expect(wrapper.vm.message).to.equal("");
    expect(wrapper.vm.warningMessage).to.equal("");
    expect(wrapper.vm.countryId).to.equal(countryData[3].id);
    expect(wrapper.vm.countryUUID).to.equal("AUS");
    expect(wrapper.vm.disableGenerateBtn).to.equal(false);
  });

  it("should set the appropriate data when the onClearCountry method is called", async () => {
    await flushPromises();

    wrapper.vm.onClearCountry();
    expect(wrapper.vm.generatedURL).to.equal("");
    expect(wrapper.vm.message).to.equal("");
    expect(wrapper.vm.warningMessage).to.equal("");
    expect(wrapper.vm.countryId).to.equal("");
    expect(wrapper.vm.countryUUID).to.equal("");
    expect(wrapper.vm.disableGenerateBtn).to.equal(true);
  });
  it("should set the disabled property of the generate button based on the local variable", async () => {
    await flushPromises();

    expect(wrapper.find(".btn-primary").classes()).to.include("disabled");
    wrapper.vm.onCountrySelect({
      value: "AUS",
      display: "Australia",
      selectedObject: countryData[3],
    });
    await flushPromises();
    expect(wrapper.find(".btn-primary").classes()).to.not.include("disabled");
    wrapper.vm.onClearCountry();
    await flushPromises();

    expect(wrapper.find(".btn-primary").classes()).to.include("disabled");
  });

  it("On success of the generate_url API call notifier to be displayed", async () => {
    let notifier = sinon.spy();

    wrapper.vm.notifier = notifier;
    axiosPostSpy.mockResolvedValue({ data: { success: true } });

    wrapper.vm.onCountrySelect({
      value: "AUS",
      display: "Australia",
      selectedObject: countryData[3],
    });
    await flushPromises();

    wrapper.find(".btn-primary").trigger("click");
    await flushPromises();

    expect(wrapper.vm.generatedURL).to.equal(
      location.origin +
        "/health_indicator_questionnaire/" +
        wrapper.vm.countryUUID
    );

    expect(axiosPostSpy.mock.calls[0][0]).to.equal(
      "/api/countries/AUS/generate_url"
    );
    expect(axiosPostSpy.mock.calls[0][1].countryId).to.equal("AUS");
    expect(wrapper.vm.message).to.equal("URL Generated Successfully");

    sinon.assert.calledWith(notifier, {
      group: "custom-template",
      title: "Success",
      text: wrapper.vm.message,
      type: "success",
    });
  });
  it("should set the warning message if existing status = PUBLISHED", async () => {
    let notifier = sinon.spy();

    wrapper.vm.notifier = notifier;
    axiosPostSpy.mockResolvedValue({
      data: { success: true, existingStatus: "PUBLISHED" },
    });
    wrapper.vm.onCountrySelect({
      value: "AUS",
      display: "Australia",
      selectedObject: countryData[3],
    });
    await flushPromises();
    wrapper.find(".btn-primary").trigger("click");
    await flushPromises();

    expect(wrapper.vm.generatedURL).to.equal(
      location.origin +
        "/health_indicator_questionnaire/" +
        wrapper.vm.countryUUID
    );
    expect(wrapper.vm.warningMessage).to.equal("Already Published");
  });
  it("should set the warning message if sucess == false and exisiting status = NEW", async () => {
    let notifier = sinon.spy();

    wrapper.vm.notifier = notifier;
    axiosPostSpy.mockResolvedValue({
      data: { success: false, existingStatus: "NEW" },
    });
    wrapper.vm.onCountrySelect({
      value: "AUS",
      display: "Australia",
      selectedObject: countryData[3],
    });
    await flushPromises();
    wrapper.find(".btn-primary").trigger("click");
    await flushPromises();

    expect(wrapper.vm.generatedURL).to.equal(
      location.origin +
        "/health_indicator_questionnaire/" +
        wrapper.vm.countryUUID
    );
    expect(wrapper.vm.warningMessage).to.equal("Submission under process");
  });
  it("should set the warning message if sucess == false and exisiting status = DRAFT", async () => {
    let notifier = sinon.spy();

    wrapper.vm.notifier = notifier;
    axiosPostSpy.mockResolvedValue({
      data: { success: false, existingStatus: "DRAFT" },
    });
    wrapper.vm.onCountrySelect({
      value: "AUS",
      display: "Australia",
      selectedObject: countryData[3],
    });
    await flushPromises();
    wrapper.find(".btn-primary").trigger("click");
    expect(wrapper.vm.generatedURL).to.equal(
      location.origin +
        "/health_indicator_questionnaire/" +
        wrapper.vm.countryUUID
    );
    await flushPromises();

    expect(wrapper.vm.warningMessage).to.equal("Submission under process");
  });
  it("should set the warning message if sucess == false and exisiting status = REVIEW", async () => {
    let notifier = sinon.spy();

    wrapper.vm.notifier = notifier;
    axiosPostSpy.mockResolvedValue({
      data: { success: false, existingStatus: "REVIEW" },
    });
    wrapper.vm.onCountrySelect({
      value: "AUS",
      display: "Australia",
      selectedObject: countryData[3],
    });
    await flushPromises();
    wrapper.find(".btn-primary").trigger("click");
    expect(wrapper.vm.generatedURL).to.equal(
      location.origin +
        "/health_indicator_questionnaire/" +
        wrapper.vm.countryUUID
    );
    await flushPromises();

    expect(wrapper.vm.warningMessage).to.equal("Review Pending");
  });
  it("should set the warning message failure", async () => {
    let notifier = sinon.spy();
    wrapper.vm.notifier = notifier;
    axiosPostSpy.mockResolvedValue({});
    wrapper.vm.onCountrySelect({
      value: "AUS",
      display: "Australia",
      selectedObject: countryData[3],
    });
    await flushPromises();

    wrapper.find(".btn-primary").trigger("click");
    expect(wrapper.vm.generatedURL).to.equal(
      location.origin +
        "/health_indicator_questionnaire/" +
        wrapper.vm.countryUUID
    );
    await flushPromises();

    expect(wrapper.vm.message).to.equal(
      "Error While Generating URL for Country"
    );
    sinon.assert.calledWith(notifier, {
      group: "custom-template",
      title: "Error",
      text: wrapper.vm.message,
      type: "error",
    });
  });
});
