import { mount } from "@vue/test-utils";
import { describe, beforeEach, it, expect, vi } from "vitest";
import AutoSearch from "../autoSearch/auto-search.vue";
import Autocomplete from "vuejs-auto-complete";
import sortBy from "lodash/sortBy";
import { i18n } from "../../plugins/i18n";
import axios from "axios";
import flushPromises from "flush-promises";

const axiosGetSpy = vi.spyOn(axios, "get");

describe("AutoSearch", () => {
  let wrapper;

  let countryData = [
    { id: "IND", name: "India", countryAlpha2Code: "IN" },
    { id: "USA", name: "United States of America", countryAlpha2Code: "US" },
    { id: "POL", name: "Poland", countryAlpha2Code: "PL" },
    { id: "AUS", name: "Australia", countryAlpha2Code: "AU" },
  ];
  beforeEach(async () => {
    axiosGetSpy.mockResolvedValue({ data: countryData });
    wrapper = mount(AutoSearch, { i18n });
    await flushPromises();
  });
  it("should contain the countires value, autocomplete component and source of autocomplete to be set to countries", () => {
    const sortedArray = sortBy(countryData, "name");
    expect(wrapper.vm.countries).to.deep.equal(sortedArray);
    const autocompleteComp = wrapper.find(Autocomplete);
    expect(wrapper.contains(Autocomplete)).to.equal(true);
    expect(autocompleteComp.props().source).to.deep.equal(sortedArray);
  });

  it("should set the country id when the onCountrySelect method", () => {
    wrapper.vm.onCountrySelect({
      value: "AUS",
      display: "Australia",
      selectedObject: countryData[3],
    });
    expect(wrapper.vm.countryId).to.deep.equal("AUS");
  });

  it("should render placeholder text", () => {
    expect(wrapper.find("input").element.placeholder).equal(
      i18n.messages.en.headers.searchBoxPlaceholder
    );
  });
});
