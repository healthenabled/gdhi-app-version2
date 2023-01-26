import { describe, it, expect } from "vitest";
import colorCodes from "../common/color-codes";

describe("color codes", () => {
  let colorObj = [
    { score: "5", color: "#156DAE", description: "Most Developed" },
    { score: "4", color: "#2575AE", description: "" },
    { score: "3", color: "#4198C7", description: "" },
    { score: "2", color: "#5FB1E3", description: "" },
    { score: "1", color: "#77BBE3", description: "Least Developed" },
    { score: "NA", color: "#606060" },
  ];
  it(" should return the color codes object", () => {
    expect(colorCodes.getColorCodes()).to.deep.equal(colorObj);
  });
});
