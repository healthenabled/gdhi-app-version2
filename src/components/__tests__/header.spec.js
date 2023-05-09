import { mount, RouterLinkStub } from "@vue/test-utils";
import { shallowMount } from "@vue/test-utils";
import VueRouter from "vue-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Header from "../header/header.vue";
import { i18n } from "../../plugins/i18n";
import { EventBus } from "../common/event-bus";
import flushPromises from "flush-promises";
import axios from "axios";

describe("Header ", () => {
  let wrapper;
  const setRegionSpy = vi.fn();
  const axiosGetSpy = vi.spyOn(axios, "get");
  const eventBusSpy = vi.spyOn(EventBus, "$emit");
  const router = new VueRouter();
  const PAHO = {
    regionId: "PAHO",
    regionName: "Pan American Region",
  };

  const regionData = [
    PAHO,
    { regionId: "AFRO", regionName: "African Region" },
    { regionId: "EURO", regionName: "European Region" },
    { regionId: "WPRO", regionName: "Western Pacific Region" },
    { regionId: "SEARO", regionName: "South-East Asian Region" },
    { regionId: "EMRO", regionName: "Eastern Mediterranean Region" },
  ];
  window.appProperties = {
    setRegions: setRegionSpy,
  };
  beforeEach(() => {
    axiosGetSpy.mockReset();
    axiosGetSpy.mockResolvedValue({ data: regionData });
    wrapper = shallowMount(Header, {
      i18n,
      router,
    });
  });

  it("should have the data", () => {
    wrapper = mount(Header, {
      stubs: {
        "router-link": RouterLinkStub,
      },
      i18n,
      router,
    });

    const mockPush = vi.fn();
    wrapper.vm.$router = { push: mockPush };
    expect(wrapper.findAll(".hd-element").length).to.equal(6);
  });

  it("should invoke fetch all the regions api for different language", async () => {
    wrapper.vm.fetchRegions();
    await flushPromises();
    const mockPush = vi.fn();
    wrapper.vm.$router = { push: mockPush };
    expect(wrapper.vm.regions).to.deep.equal(regionData);
    expect(eventBusSpy.mock.calls[0][0]).toBe("region:translated");
  });
});
