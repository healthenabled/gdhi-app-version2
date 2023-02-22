import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import axios from "axios";
import defaultYearSelector from "../defaultYearSelector/default-year-selector.vue";
import { i18n } from "../../plugins/i18n";
import flushPromises from "flush-promises";
import { EventBus } from "../common/event-bus";

const axiosGetSpy = vi.spyOn(axios, "get");
const axiosPostSpy = vi.spyOn(axios, "post");
const eventBusOnSpy = vi.spyOn(EventBus, "$on");
const setDefaultYearSpy = vi.fn();
const getDefaultYearSpy = vi.fn();

window.appProperties = {
  setDefaultYear: setDefaultYearSpy,
  getDefaultYear: getDefaultYearSpy,
};
describe("year-filter", () => {
  let wrapper;

  beforeEach(async () => {
    axiosGetSpy.mockResolvedValueOnce({
      data: { years: ["Version 1", "2022", "2023"], defaultYear: "2022" },
    });
    wrapper = shallowMount(defaultYearSelector, { i18n });
    await flushPromises();
  });

  afterEach(() => {
    axiosGetSpy.mockReset();
    eventBusOnSpy.mockReset();
  });

  it("should render default Year Selector", async () => {
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  it("should call fetch years on mount and populate windows object", async () => {
    expect(axiosGetSpy.mock.calls[0][0]).to.equal("/api/bff/distinct_year");
    expect(setDefaultYearSpy.mock.calls[0][0].defaultYear).to.equal("2022");
  });

  it("register a listener on EventBus", async () => {
    expect(eventBusOnSpy.mock.calls[0][0]).to.equal("year:filtered");
  });

  it.skip("register a listener on EventBus which sets default year", async () => {
    eventBusOnSpy.mock.calls[0][1]("a_default_year");
    expect(wrapper.vm.defaultYear).to.equal("a_default_year");
  });

  it("trigger post API for default Year Change and populate windows object", async () => {
    axiosPostSpy.mockResolvedValue({});
    const submitButton = wrapper.find(".btn");

    submitButton.trigger("click");
    await flushPromises();
    expect(axiosPostSpy.mock.calls[0][0]).to.equal("/api/default_year/submit");
    expect(axiosPostSpy.mock.calls[0][1]).to.equal("2022");

    expect(setDefaultYearSpy.mock.calls[0][0].defaultYear).to.equal("2022");
  });
});
