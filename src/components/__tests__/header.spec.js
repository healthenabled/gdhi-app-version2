import { shallow, mount, RouterLinkStub } from "@vue/test-utils";
import Header from "../header/header.vue";
import moxios from "moxios";
import autoSearch from "../auto-search/auto-search.vue";
import { i18n } from "../../plugins/i18n";

describe("Header ", () => {
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
  });
  it("should have the data", () => {
    wrapper = shallow(Header, { i18n });
    expect(wrapper.vm.countries).to.deep.equal({});
    expect(wrapper.vm.developmentIndicators).to.deep.equal([]);
    expect(wrapper.vm.healthIndicators).to.deep.equal({});
  });
  it("should have the data", () => {
    wrapper = mount(Header, {
      stubs: {
        "router-link": RouterLinkStub,
        "router-view": {
          render: (h) => h(autoSearch),
        },
      },
      i18n,
    });
    expect(wrapper.findAll(".hd-element").length).to.equal(5);
    expect(wrapper.findAll(autoSearch).length).to.equal(2);
  });
});
