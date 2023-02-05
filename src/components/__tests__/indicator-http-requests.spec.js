import Obj from "../../common/indicator-http-requests.js";
import { describe, expect, it, vi } from "vitest";
import axios from "axios";
import flushPromises from "flush-promises";

const axiosGetSpy = vi.spyOn(axios, "get");

describe("Indicator HTTP Requests and Helper methods", () => {
  const response = {
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
        gniPerCapita: Obj.getGNIPerCapitaInKilo(response.gniPerCapita),
        totalPopulation: Obj.getTotalPopulationInMillion(
          response.totalPopulation
        ),
        adultLiteracyRate: Obj.getInPercenatge(response.adultLiteracy),
        easeOfDoingBusinessIndex: Obj.getValue(response.doingBusinessIndex),
      },
    },
    {
      HEALTH: {
        lifeExpectancy: Obj.getValue(response.lifeExpectancy),
        healthExpenditure: Obj.getInPercenatge(response.healthExpenditure),
        causeOfDeath: Obj.getInPercenatge(response.totalNcdDeathsPerCapita),
        mortalityRate: Obj.getValue(response.under5Mortality),
      },
    },
  ];
  const minimalDevelopmentIndicatorsData = [
    {
      CONTEXT: {
        gniPerCapita: Obj.getGNIPerCapitaInKilo(response.gniPerCapita),
        totalPopulation: Obj.getTotalPopulationInMillion(
          response.totalPopulation
        ),
      },
    },
    {
      HEALTH: {
        lifeExpectancy: Obj.getValue(response.lifeExpectancy),
        healthExpenditure: Obj.getInPercenatge(response.healthExpenditure),
      },
    },
  ];
  it("getGNIPerCapitaInKilo should return value in K or NA if the value is null or undefined", () => {
    expect(Obj.getGNIPerCapitaInKilo(2000)).to.equal("2K");
    expect(Obj.getGNIPerCapitaInKilo(25000)).to.equal("25K");
    expect(Obj.getGNIPerCapitaInKilo(25450)).to.equal("25.45K");
    expect(Obj.getGNIPerCapitaInKilo(undefined)).to.equal("NA");
    expect(Obj.getGNIPerCapitaInKilo(null)).to.equal("NA");
    expect(Obj.getGNIPerCapitaInKilo(0)).to.equal("NA");
  });
  it("getTotalPopulationInMillion should return value in M or NA if the value is null or undefined", () => {
    expect(Obj.getTotalPopulationInMillion(2000000)).to.equal("2M");
    expect(Obj.getTotalPopulationInMillion(22233432)).to.equal("22.23M");
    expect(Obj.getTotalPopulationInMillion(undefined)).to.equal("NA");
    expect(Obj.getTotalPopulationInMillion(null)).to.equal("NA");
    expect(Obj.getTotalPopulationInMillion(0)).to.equal("NA");
  });
  it("getInPercenatge should append percent sign and return the value rounded off to one decimal or NA for null or undefined", () => {
    expect(Obj.getInPercenatge(10.27)).to.equal("10.3%");
    expect(Obj.getInPercenatge(10.24)).to.equal("10.2%");
    expect(Obj.getInPercenatge(undefined)).to.equal("NA");
    expect(Obj.getInPercenatge(null)).to.equal("NA");
    expect(Obj.getInPercenatge(0)).to.equal("NA");
  });
  it("getValue should return the value if present or NA for null or undefined", () => {
    expect(Obj.getValue(12)).to.equal(12);
    expect(Obj.getValue(undefined)).to.equal("NA");
    expect(Obj.getValue(null)).to.equal("NA");
    expect(Obj.getValue(0)).to.equal("NA");
  });
  it("should return the correct value when the getMinimalDevelopmentIndicatorsData is called", () => {
    expect(Obj.getMinimalDevelopmentIndicatorsData(response)).to.deep.equal(
      minimalDevelopmentIndicatorsData
    );
  });
  it("should return the correct value when the getDevelopmentIndicatorsData is called", () => {
    expect(Obj.getDevelopmentIndicatorsData(response)).to.deep.equal(
      developmentIndicatorsData
    );
  });
  it("should set the developmentIndicators data when getDevelopmentIndicators is called", async () => {
    axiosGetSpy.mockResolvedValue({ data: response });

    const returnPromise = Obj.getDevelopmentIndicators("IND", false);

    returnPromise.then((value) => {
      expect(value).to.deep.equal(developmentIndicatorsData);
    });
  });
  it("should set the developmentIndicators data when getDevelopmentIndicators is called for minimal indicators", async () => {
    axiosGetSpy.mockResolvedValue({ data: response });
    const returnPromise = Obj.getDevelopmentIndicators("IND", true);

    returnPromise.then((value) => {
      expect(value).to.deep.equal(minimalDevelopmentIndicatorsData);
    });
  });

  it("should set the developmentIndicators data when getDevelopmentIndicators is called for minimal indicators", async () => {
    let errResp = {
      response: { message: "problem" },
    };
    axiosGetSpy.mockRejectedValue(errResp);
    const returnPromise = Obj.getDevelopmentIndicators("IND", true);

    await flushPromises();
    returnPromise.then().catch((e) => {
      expect(e).to.equal(errResp);
    });
  });
});
