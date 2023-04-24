import { shallowMount } from "@vue/test-utils";
import { describe, beforeEach, it, expect, vi } from "vitest";
import RegionSelector from "../regionSelector/region-selector.vue";
import { i18n } from "../../plugins/i18n";
import axios from "axios";
import flushPromises from "flush-promises";
import { EventBus } from "../common/event-bus";
import sinon from "sinon";
describe("Region Selector", () => {
  let wrapper;

  const axiosGetSpy = vi.spyOn(axios, "get");
  const eventBusSpy = vi.spyOn(EventBus, "$emit");
  const responseData = [
    { region_id: "PAHO", regionName: "Pan American Region" },
  ];
  const onChangeStub = sinon.stub();

  const setRegionSpy = vi.fn();

  window.appProperties = {
    setRegion: setRegionSpy,
  };
  const event = { target: { options: { selectedIndex: 1 } } };
  beforeEach(() => {
    axiosGetSpy.mockReset();
    axiosGetSpy.mockResolvedValue({ data: responseData });
    wrapper = shallowMount(RegionSelector, {
      i18n,
    });
  });

  it("should invoke fetch all the regions api", async () => {
    wrapper.vm.fetchRegions();
    await flushPromises();
    expect(axiosGetSpy.mock.calls[0][0]).to.equal("/api/regions");
  });

  it("should render region selector", async () => {
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  it("should emit the event when region dropdown is selected", async () => {
    wrapper.vm.onChange(event);
    expect(eventBusSpy.mock.calls[0][0]).toBe("region:filtered");
  });

  it("should invoke fetch all the regions api for different language", async () => {
    wrapper.vm.selectedRegion = {
      region_id: "PAHO",
      regionName: "Pan American Region",
    };
    wrapper.setMethods({ onChange: onChangeStub });
    wrapper.vm.fetchRegions();
    await flushPromises();
    expect(onChangeStub.called).toBe(true);
  });
});
