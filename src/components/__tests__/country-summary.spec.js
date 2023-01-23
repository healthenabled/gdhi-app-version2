import { createLocalVue, mount } from "@vue/test-utils";
import VueRouter from "vue-router";
import CountrySummary from "../countrySummary/country-summary.vue";
import moxios from "moxios";
import { i18n } from "../../plugins/i18n";

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
    collectedDate: "2018-11-12",
    resources: ["sdfsd"],
  };
  beforeEach(() => {
    moxios.install();
    wrapper = mount(CountrySummary, {
      localVue,
      router,
      i18n,
    });
  });
  it("should return the country data after the API call is made", (done) => {
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({ status: 200, response: responseData }).then(() => {
        expect(wrapper.vm.countrySummaries).to.deep.equal(responseData);
        done();
      });
    });
  });

  it("should update the html based on the data recieved", (done) => {
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({ status: 200, response: responseData }).then(() => {
        expect(wrapper.find(".country-summary-link").text()).to.equal(
          responseData.contactName + ","
        );
        expect(wrapper.find(".country-designation").text()).to.equal(
          responseData.contactDesignation + ","
        );
        expect(wrapper.find(".country-org").text()).to.equal(
          responseData.contactOrganization
        );
        expect(wrapper.find(".country-summary-text").text()).to.equal(
          responseData.summary
        );
        expect(wrapper.findAll(".country-resource-link").length).to.equal(
          responseData.resources.length
        );
        expect(wrapper.find(".link-blue").attributes().href).to.equal(
          "mailto:" + responseData.contactEmail
        );
        done();
      });
    });
  });

  it("should execute catch block if the API call is failed", (done) => {
    let errResp = {
      status: 500,
      response: { message: "problem" },
    };
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.reject(errResp);
      moxios.wait(() => {
        expect(wrapper.vm.error).to.deep.equal(errResp.response.message);
        done();
      });
    });
  });

  it("should render localization texts properly", (done) => {
    moxios.wait(() => {
      expect(wrapper.find(".country-contact").text()).equal(
        i18n.messages.en.countryProfile.countrySummary.keyContacts
      );
      expect(wrapper.find(".country-summary-title").text()).equal(
        i18n.messages.en.countryProfile.countrySummary.text
      );
      expect(wrapper.find(".country-resource-title").text()).equal(
        i18n.messages.en.countryProfile.countrySummary.resources
      );
      done();
    });
  });

  it("should render localization error texts properly", (done) => {
    moxios.wait(() => {
      expect(wrapper.findAll(".error").length).to.equal(3);
      expect(wrapper.findAll(".error").at(0).text()).equal(
        i18n.messages.en.mixed.noDataAvailable
      );
      expect(wrapper.findAll(".error").at(1).text()).equal(
        i18n.messages.en.mixed.noDataAvailable
      );
      expect(wrapper.findAll(".error").at(2).text()).equal(
        i18n.messages.en.mixed.noDataAvailable
      );

      done();
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });
});
