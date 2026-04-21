import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import yearFilterMap from "../yearFilter/year-filter-map.vue";
import { EventBus } from "../common/event-bus";
import { i18n } from "../../plugins/i18n";
import axios from "axios";
import flushPromises from "flush-promises";

const axiosGetSpy = vi.spyOn(axios, "get");

describe("year-filter-map", () => {
  let wrapper;

  beforeEach(async () => {
    axiosGetSpy.mockResolvedValue({
      data: { years: ["2026", "2025", "2024", "2023", "Version1"], defaultYear: "2023" },
    });
    wrapper = shallowMount(yearFilterMap, { i18n });
    await flushPromises();
  });

  it("should fetch years and filter out non-numeric values", () => {
    expect(wrapper.vm.years).to.deep.equal(["2026", "2025", "2024", "2023"]);
  });

  it("should default yearValue to empty string", () => {
    expect(wrapper.vm.yearValue).to.equal("");
  });

  it("should emit YEAR_FILTERED event with selected year on change", async () => {
    vi.spyOn(EventBus, "$emit");
    wrapper.vm.yearValue = "2024";
    wrapper.vm.filter();
    expect(EventBus.$emit.mock.calls[0][1]).to.equal("2024");
  });

  it("should reset yearValue to empty string on Reset:Filters event", async () => {
    wrapper.vm.yearValue = "2024";
    EventBus.$emit("Reset:Filters");
    await flushPromises();
    expect(wrapper.vm.yearValue).to.equal("");
  });
});
