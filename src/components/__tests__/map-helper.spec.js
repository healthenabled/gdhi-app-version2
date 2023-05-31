import mapHelper from "../landingMap/map-helper";
import { describe, it, expect } from "vitest";

const countryIndices = [
  {
    countryId: "AFG",
    countryName: "Afghanistan",
    countryPhase: 5,
    overallScore: 4.75,
    colorCode: "#11184B",
    categories: [
      {
        id: 1,
        name: "Leadership and Governance",
        overallScore: 4.5,
        phase: 5,
        indicators: [
          {
            id: 1,
            indicatorDescription:
              "Does the country have a separate department / agency / " +
              "national working group for digital health?",
            name:
              "Digital health prioritized at the national level through dedicated bodies / " +
              "mechanisms for governance",
            score: 4,
            scoreDescription:
              "Governance structure is fully-functional, government-led, consults" +
              "with other ministries, and monitors implementation of digital health based on a work" +
              "plan.",
            supportingText: null,
          },
        ],
      },
    ],
  },
];

describe("Map Helper", () => {
  it("should get color code for score", () => {
    expect(mapHelper.getColorCodeFor(4)).to.equal("#80E1CC");
  });
  it("should get color code for score", () => {
    expect(mapHelper.getColorCodeFor(null)).to.equal("#6C757D");
  });
  it("should get color code for score = value not in range", () => {
    expect(mapHelper.getColorCodeFor(7)).to.equal("#6C757D");
  });
  it("should get color code for score = 5", () => {
    expect(mapHelper.getColorCodeFor(5)).to.equal("#01C975");
  });
  it("should get color code for score = NA", () => {
    expect(mapHelper.getColorCodeFor("NA")).to.equal("#6C757D");
  });
  it("should get color code for country code", () => {
    expect(mapHelper.getColorCodeOf("AFG", countryIndices)).to.equal("#11184B");
  });
});
