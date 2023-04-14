import { describe, expect, it } from "vitest";
import { validateFields } from "../uploadCSV/uploadUtils";
import flushPromises from "flush-promises";

describe("upload Utils", () => {
  const data = {
    "Country Name": "Country Name",
    "Country Summary": "Country Summary",
    "Country Contact Name": "Country Contact Name",
    "Country Contact Role": "Country Contact Role",
    "Country Contact Org": "Country Contact Org",
    "Country Contact Email": "Country Contact Email",
    "Contact Person Name": "Contact Person Name",
    "Contact Person Role": "Contact Person Role",
    "Contact Person Email": "Contact Person Email",
    "Is the data approved by the government":
      "Is the data approved by the government",
    "Data Approver Name": "Data Approver Name",
    "Data Approver Role": "Data Approver Role",
    "Data Approver Email": "Data Approver Email",
    "Resources Link": "Resources Link",
    "Indicator 1 Score": "Indicator 1 Score",
    "Enter Indicator 1 justification": "Enter Indicator 1 justification",
    "Indicator 2 Score": "Indicator 2 Score",
    "Enter Indicator 2 justification": "Enter Indicator 2 justification",
    "Indicator 2a Score": "Indicator 2a Score",
    "Enter Indicator 2a justification": "Enter Indicator 2a justification",
    "Indicator 3 Score": "Indicator 3 Score",
    "Enter Indicator 3 justification": "Enter Indicator 3 justification",
    "Indicator 4 Score": "Indicator 4 Score",
    "Enter Indicator 4 justification": "Enter Indicator 4 justification",
    "Indicator 4a Score": "Indicator 4a Score",
    "Enter Indicator 4a justification": "Enter Indicator 4a justification",
    "Indicator 5 Score": "Indicator 5 Score",
    "Enter Indicator 5 justification": "Enter Indicator 5 justification",
    "Indicator 5a Score": "Indicator 5a Score",
    "Enter Indicator 5a justification": "Enter Indicator 5a justification",
    "Indicator 6 Score": "Indicator 6 Score",
    "Enter Indicator 6 justification": "Enter Indicator 6 justification",
    "Indicator 6a Score": "Indicator 6a Score",
    "Enter Indicator 6a justification": "Enter Indicator 6a justification",
    "Indicator 7 Score": "Indicator 7 Score",
    "Enter Indicator 7 justification": "Enter Indicator 7 justification",
    "Indicator 8 Score": "Indicator 8 Score",
    "Enter Indicator 8 justification": "Enter Indicator 8 justification",
    "Indicator 9 Score": "Indicator 9 Score",
    "Enter Indicator 9 justification": "Enter Indicator 9 justification",
    "Indicator 9a Score": "Indicator 9a Score",
    "Enter Indicator 9a justification": "Enter Indicator 9a justification",
    "Indicator 10 Score": "Indicator 10 Score",
    "Enter Indicator 10 justification": "Enter Indicator 10 justification",
    "Indicator 11 Score": "Indicator 11 Score",
    "Enter Indicator 11 justification": "Enter Indicator 11 justification",
    "Indicator 12 Score": "Indicator 12 Score",
    "Enter Indicator 12 justification": "Enter Indicator 12 justification",
    "Indicator 13 Score": "Indicator 13 Score",
    "Enter Indicator 13 justification": "Enter Indicator 13 justification",
    "Indicator 14 Score": "Indicator 14 Score",
    "Enter Indicator 14 justification": "Enter Indicator 14 justification",
    "Indicator 15 Score": "Indicator 15 Score",
    "Enter Indicator 15 justification": "Enter Indicator 15 justification",
    "Indicator 16 Score": "Indicator 16 Score",
    "Enter Indicator 16 justification": "Enter Indicator 16 justification",
    "Indicator 17 Score": "Indicator 17 Score",
    "Enter Indicator 17 justification": "Enter Indicator 17 justification",
    "Indicator 18 Score": "Indicator 18 Score",
    "Enter Indicator 18 justification": "Enter Indicator 18 justification",
    "Indicator 19 Score": "Indicator 19 Score",
    "Enter Indicator 19 justification": "Enter Indicator 19 justification",
    "Indicator 20 Score": "Indicator 20 Score",
    "Enter Indicator 20 justification": "Enter Indicator 20 justification",
    "Indicator 21 Score": "Indicator 21 Score",
    "Enter Indicator 21 justification": "Enter Indicator 21 justification",
    "Indicator 21a Score": "Indicator 21a Score",
    "Enter Indicator 21a justification": "Enter Indicator 21a justification",
    "Indicator 21b Score": "Indicator 21b Score",
    "Enter Indicator 21b justification": "Enter Indicator 21b justification",
    "Indicator 21c Score": "Indicator 21c Score",
    "Enter Indicator 21c justification": "Enter Indicator 21c justification",
    "Indicator 22 Score": "Indicator 22 Score",
    "Enter Indicator 22 justification": "Enter Indicator 22 justification",
    "Indicator 23 Score": "Indicator 23 Score",
    "Enter Indicator 23 justification": "Enter Indicator 23 justification",
  };
  it("should handle validating object", async () => {
    let error = null;
    validateFields(data).catch((e) => {
      error = e.toString();
    });
    await flushPromises();
    expect(error).toEqual(
      "ValidationError: resources link are not valid URL's"
    );
  });
});
