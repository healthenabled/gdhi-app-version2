import { shallowMount } from "@vue/test-utils";
import phaseFilter from "../phaseFilter/phase-filter.vue";
import sinon from "sinon";
import { describe, it, expect, beforeEach, vi } from "vitest";
import axios from "axios";
import { i18n } from "../../plugins/i18n";
import flushPromises from "flush-promises";

const axiosGetSpy = vi.spyOn(axios, "get");

describe("phase-filter ", () => {
  let wrapper;
  let setPhaseFilterMock = sinon.spy();
  window.appProperties = {
    getPhaseFilter: () => {
      return "";
    },
    setPhaseFilter: setPhaseFilterMock,
  };
  let phaseData = [
    {
      phaseName: "phase1",
      phaseValue: 1,
    },
    {
      phaseName: "phase2",
      phaseValue: 2,
    },
  ];

  beforeEach(async () => {
    axiosGetSpy.mockResolvedValue({ data: phaseData });
    wrapper = shallowMount(phaseFilter, {
      i18n,
    });
    await flushPromises();
  });
  it("should fetch phases", async () => {
    expect(wrapper.vm.phases).to.deep.equal(phaseData);
  });
});
