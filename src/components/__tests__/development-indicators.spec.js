import { mount, createLocalVue } from "@vue/test-utils";
import { describe, beforeEach, it, expect, afterEach, vi } from "vitest";
import VueRouter from "vue-router";
import DevelopmentIndicators from "../developmentIndicators/development-indicators.vue";
import Obj from "../../common/indicator-http-requests.js";
import { i18n } from "../../plugins/i18n";
import axios from "axios";
import flushPromises from "flush-promises";

const axiosGetSpy = vi.spyOn(axios, "get");

describe("Development Indicators", () => {
  let wrapper;
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();

  let responseData = {
    gniPerCapita: 1000,
    totalPopulation: 1000000,
    adultLiteracy: 70.22,
    doingBusinessIndex: 22.22,
    lifeExpectancy: 60,
    healthExpenditure: 22.23,
    totalNcdDeathsPerCapita: 22.2,
    under5Mortality: 22,
  };
  const developmentIndicatorsData = [
    {
      CONTEXT: {
        gniPerCapita: Obj.getGNIPerCapitaInKilo(responseData.gniPerCapita),
        totalPopulation: Obj.getTotalPopulationInMillion(
          responseData.totalPopulation
        ),
        adultLiteracyRate: Obj.getInPercenatge(responseData.adultLiteracy),
        easeOfDoingBusinessIndex: Obj.getValue(responseData.doingBusinessIndex),
      },
    },
    {
      HEALTH: {
        lifeExpectancy: Obj.getValue(responseData.lifeExpectancy),
        healthExpenditure: Obj.getInPercenatge(responseData.healthExpenditure),
        causeOfDeath: Obj.getInPercenatge(responseData.totalNcdDeathsPerCapita),
        mortalityRate: Obj.getValue(responseData.under5Mortality),
      },
    },
  ];
  it(" should set the local variable development indicators after the successful api call", async () => {
    axiosGetSpy.mockResolvedValue({ data: responseData });
    wrapper = mount(DevelopmentIndicators, {
      localVue,
      router,
      i18n,
    });
    await flushPromises();
    expect(wrapper.vm.developmentIndicators).to.deep.equal(
      developmentIndicatorsData
    );
  });
  it(" should render the html elements based on the response ", async () => {
    axiosGetSpy.mockResolvedValue({ data: responseData });
    wrapper = mount(DevelopmentIndicators, {
      localVue,
      router,
      i18n,
    });
    await flushPromises();
    expect(wrapper.findAll(".category").length).to.equal(
      developmentIndicatorsData.length
    );
    const firstElement = wrapper.findAll(".category").at(0);
    expect(firstElement.find(".header-bold").text().toLowerCase()).to.equal(
      Object.keys(developmentIndicatorsData[0])[0].toLowerCase()
    );
    expect(firstElement.findAll(".indicator").length).to.equal(
      Object.keys(developmentIndicatorsData[0]["CONTEXT"]).length
    );
  });
});
