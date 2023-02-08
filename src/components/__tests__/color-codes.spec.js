import { describe, it, expect } from "vitest";
import colorCodes from "../common/color-codes";

describe("color codes", () => {
  let colorObj = [
    { score: "5", color: "#01C975", description: "Most Developed" },
    { score: "4", color: "#80E1CC", description: "" },
    { score: "3", color: "#FFE180", description: "" },
    { score: "2", color: "#FFCA82", description: "" },
    { score: "1", color: "#FCAB9C", description: "Least Developed" },
    { score: "NA", color: "#6C757D" },
  ];
  it(" should return the color codes object", () => {
    expect(colorCodes.getColorCodes()).to.deep.equal(colorObj);
  });
});
