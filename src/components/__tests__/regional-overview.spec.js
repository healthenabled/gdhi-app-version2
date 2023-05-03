import RegionalOverview from "../../components/regionalOverview/regional-overview.vue";
import { describe, it, expect, vi } from "vitest";
import VueRouter from "vue-router";
import { EventBus } from "../common/event-bus";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import { i18n } from "../../plugins/i18n";
import flushPromises from "flush-promises";
describe("Region Overview", () => {
  let wrapper;
  const eventBusOnSpy = vi.spyOn(EventBus, "$on");
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  const regionData = [
    { regionId: "PAHO", regionName: "Pan American Region" },
    { regionId: "AFRO", regionName: "African Region" },
    { regionId: "EURO", regionName: "European Region" },
    { regionId: "WPRO", regionName: "Western Pacific Region" },
    { regionId: "SEARO", regionName: "South-East Asian Region" },
    { regionId: "EMRO", regionName: "Eastern Mediterranean Region" },
  ];
  window.appProperties = {
    getRegions: function () {
      return regionData;
    },
  };

  beforeEach(async () => {
    wrapper = shallowMount(RegionalOverview, {
      localVue,
      router,
      i18n,
    });
    await flushPromises();
  });

  afterEach(() => {
    wrapper.vm.$route.params.regionId = "";
  });

  it("should render regional overview", async () => {
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  it("should have the data", async () => {
    wrapper.vm.$route.params.regionId = "PAHO";
    wrapper.vm.getRegionNameFromRegionId();
    expect(wrapper.vm.regionName).equal("Pan American Regional Overview");
  });

  it("should register event when regional overview page is mounted", async () => {
    expect(eventBusOnSpy.mock.calls[0][0]).to.equal("region:translated");
  });
});
