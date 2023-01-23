import { mount } from "@vue/test-utils";
import GenerateURL from "../generateUrl/generate-url.vue";
import moxios from "moxios";
import { sortBy } from "lodash";
import Autocomplete from "vuejs-auto-complete";
import sinon from "sinon";
import { i18n } from "../../plugins/i18n";

describe.todo("Generate URL ", () => {
  let wrapper;
  let countryData = [
    { id: "IND", name: "India", countryAlpha2Code: "IN" },
    { id: "USA", name: "United States of America", countryAlpha2Code: "US" },
    { id: "POL", name: "Poland", countryAlpha2Code: "PL" },
    { id: "AUS", name: "Australia", countryAlpha2Code: "AU" },
  ];
  beforeEach(() => {
    moxios.install();
    moxios.stubRequest("/api/countries", {
      status: 200,
      response: countryData,
    });
    wrapper = mount(GenerateURL, { i18n });
  });
  it("should load the countries after hitting the API", (done) => {
    moxios.wait(() => {
      const sortedArray = sortBy(countryData, "name");
      expect(wrapper.vm.countries).to.deep.equal(sortedArray);
      const autocompleteComp = wrapper.find(Autocomplete);
      expect(autocompleteComp.props().source).to.deep.equal(sortedArray);
      done();
    });
  });
  it("should set the appropriate data when the onCountrySelect method is called", (done) => {
    moxios.wait(() => {
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
      done();
    });
  });

  it("should set the appropriate data when the onClearCountry method is called", (done) => {
    moxios.wait(() => {
      wrapper.vm.onClearCountry();
      expect(wrapper.vm.generatedURL).to.equal("");
      expect(wrapper.vm.message).to.equal("");
      expect(wrapper.vm.warningMessage).to.equal("");
      expect(wrapper.vm.countryId).to.equal("");
      expect(wrapper.vm.countryUUID).to.equal("");
      expect(wrapper.vm.disableGenerateBtn).to.equal(true);
      done();
    });
  });
  it("should set the disabled property of the generate button based on the local variable", (done) => {
    moxios.wait(() => {
      expect(wrapper.find(".btn-primary").classes()).to.include("disabled");
      wrapper.vm.onCountrySelect({
        value: "AUS",
        display: "Australia",
        selectedObject: countryData[3],
      });
      expect(wrapper.find(".btn-primary").classes()).to.not.include("disabled");
      wrapper.vm.onClearCountry();
      expect(wrapper.find(".btn-primary").classes()).to.include("disabled");
      done();
    });
  });

  it("On success of the generate_url API call notifier to be displayed", (done) => {
    wrapper.vm.onCountrySelect({
      value: "AUS",
      display: "Australia",
      selectedObject: countryData[3],
    });
    wrapper.find(".btn-primary").trigger("click");
    let notifier = sinon.spy();
    wrapper.vm.notifier = notifier;
    expect(wrapper.vm.generatedURL).to.equal(
      location.origin +
        "/health_indicator_questionnaire/" +
        wrapper.vm.countryUUID
    );
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.resolve({
        countryId: wrapper.vm.countryUUID,
        status: 200,
        data: { success: true },
      });
      expect(request.config.method).to.equal("post");
      expect(request.config.url).to.equal(
        "/api/countries/" + wrapper.vm.countryUUID + "/generate_url"
      );
      let requestParams = JSON.parse(request.config.data);
      expect(requestParams.countryId).to.equal(wrapper.vm.countryUUID);
      moxios.wait(() => {
        expect(wrapper.vm.message).to.equal("URL Generated Successfully");

        sinon.assert.calledWith(notifier, {
          group: "custom-template",
          title: "Success",
          text: wrapper.vm.message,
          type: "success",
        });
        done();
      });
    });
  });
  it("should set the warning message if existing status = PUBLISHED", (done) => {
    wrapper.vm.onCountrySelect({
      value: "AUS",
      display: "Australia",
      selectedObject: countryData[3],
    });
    wrapper.find(".btn-primary").trigger("click");
    expect(wrapper.vm.generatedURL).to.equal(
      location.origin +
        "/health_indicator_questionnaire/" +
        wrapper.vm.countryUUID
    );
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.resolve({
        countryId: wrapper.vm.countryUUID,
        status: 200,
        data: { success: true, existingStatus: "PUBLISHED" },
      });
      moxios.wait(() => {
        expect(wrapper.vm.warningMessage).to.equal("Already Published");
        done();
      });
    });
  });
  it("should set the warning message if sucess == false and exisiting status = NEW", (done) => {
    wrapper.vm.onCountrySelect({
      value: "AUS",
      display: "Australia",
      selectedObject: countryData[3],
    });
    wrapper.find(".btn-primary").trigger("click");
    expect(wrapper.vm.generatedURL).to.equal(
      location.origin +
        "/health_indicator_questionnaire/" +
        wrapper.vm.countryUUID
    );
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.resolve({
        countryId: wrapper.vm.countryUUID,
        status: 200,
        data: { success: false, existingStatus: "NEW" },
      });
      moxios.wait(() => {
        expect(wrapper.vm.warningMessage).to.equal("Submission under process");
        done();
      });
    });
  });
  it("should set the warning message if sucess == false and exisiting status = DRAFT", (done) => {
    wrapper.vm.onCountrySelect({
      value: "AUS",
      display: "Australia",
      selectedObject: countryData[3],
    });
    wrapper.find(".btn-primary").trigger("click");
    expect(wrapper.vm.generatedURL).to.equal(
      location.origin +
        "/health_indicator_questionnaire/" +
        wrapper.vm.countryUUID
    );
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.resolve({
        countryId: wrapper.vm.countryUUID,
        status: 200,
        data: { success: false, existingStatus: "DRAFT" },
      });
      moxios.wait(() => {
        expect(wrapper.vm.warningMessage).to.equal("Submission under process");
        done();
      });
    });
  });
  it("should set the warning message if sucess == false and exisiting status = REVIEW", (done) => {
    wrapper.vm.onCountrySelect({
      value: "AUS",
      display: "Australia",
      selectedObject: countryData[3],
    });
    wrapper.find(".btn-primary").trigger("click");
    expect(wrapper.vm.generatedURL).to.equal(
      location.origin +
        "/health_indicator_questionnaire/" +
        wrapper.vm.countryUUID
    );
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.resolve({
        countryId: wrapper.vm.countryUUID,
        status: 200,
        data: { success: false, existingStatus: "REVIEW" },
      });
      moxios.wait(() => {
        expect(wrapper.vm.warningMessage).to.equal("Review Pending");
        done();
      });
    });
  });
  it("should set the warning message failure", (done) => {
    let notifier = sinon.spy();
    wrapper.vm.notifier = notifier;
    wrapper.vm.onCountrySelect({
      value: "AUS",
      display: "Australia",
      selectedObject: countryData[3],
    });
    wrapper.find(".btn-primary").trigger("click");
    expect(wrapper.vm.generatedURL).to.equal(
      location.origin +
        "/health_indicator_questionnaire/" +
        wrapper.vm.countryUUID
    );
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.reject({ countryId: wrapper.vm.countryUUID, status: 500 });
      moxios.wait(() => {
        expect(wrapper.vm.message).to.equal(
          "Error While Generating URL for Country"
        );
        sinon.assert.calledWith(notifier, {
          group: "custom-template",
          title: "Error",
          text: wrapper.vm.message,
          type: "error",
        });
        done();
      });
    });
  });
  afterEach(() => {
    moxios.uninstall();
  });
});
