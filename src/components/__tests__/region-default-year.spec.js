import { shallowMount } from "@vue/test-utils";
import phaseFilter from "../phaseFilter/phase-filter.vue";
import sinon from "sinon";
import regionDefaultYear from "../regionYearComponent/region-default-year.vue";
import { describe, it, expect, beforeEach, vi } from "vitest";
import axios from "axios";
import { i18n } from "../../plugins/i18n";
import flushPromises from "flush-promises";

const axiosGetSpy = vi.spyOn(axios, "get");

describe("region-default-year ", () => {
  let wrapper;
  const years = {
    years: ["2023", "2022", "2021"],
    defaultYear: "2023",
  };

  beforeEach(async () => {
    axiosGetSpy.mockResolvedValue({ data: years });
    wrapper = shallowMount(regionDefaultYear, { i18n });
    await flushPromises();
  });
  it("should fetch default year", async () => {
    expect(wrapper.vm.defaultYear).to.deep.equal(years.defaultYear);
  });
});
