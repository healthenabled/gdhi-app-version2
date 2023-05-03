import { createLocalVue, shallowMount } from "@vue/test-utils";
import regionYearSelector from "../regionYearComponent/region-year-selector.vue";
import { describe, it, expect, beforeEach, vi } from "vitest";
import axios from "axios";
import { i18n } from "../../plugins/i18n";
import flushPromises from "flush-promises";
import VueRouter from "vue-router";

const axiosGetSpy = vi.spyOn(axios, "get");

describe("region-year-selector ", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  let wrapper;
  const years = ["2023", "2022", "2021"];

  beforeEach(async () => {
    axiosGetSpy.mockResolvedValue({ data: years });
    wrapper = shallowMount(regionYearSelector, { i18n, localVue, router });
    await flushPromises();
  });
  it("should fetch years available for a region", async () => {
    expect(wrapper.vm.years).to.deep.equal(years);
  });
  it("should fetch latest year available for a region", async () => {
    expect(wrapper.vm.latestYear).to.deep.equal("2023");
  });
});
