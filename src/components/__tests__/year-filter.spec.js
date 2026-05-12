import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import yearFilter from "../defaultYearSelector/year-filter.vue";
import { EventBus } from "../common/event-bus";
import { i18n } from "../../plugins/i18n";

describe("year-filter", () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = shallowMount(yearFilter, {
      i18n,
      propsData: {
        years: ["Version 1", "2022", "2023"],
        selectedYear: "2022",
        shouldRespectTranslation: true,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render Years and default Year passed to it", async () => {
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  it("should render Emit Event when a value is filtered", async () => {
    const emitSpy = vi.spyOn(EventBus, "$emit");
    const SelectElement = wrapper.find(".year-indicator-select");
    SelectElement.value = "2022";
    SelectElement.trigger("change");
    expect(emitSpy.mock.calls[0][0]).to.equal("year:filtered");
    expect(emitSpy.mock.calls[0][1]).to.equal("2022");
  });
});
