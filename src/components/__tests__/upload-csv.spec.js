import { mount } from "@vue/test-utils";
import { describe, beforeEach, it, expect, vi } from "vitest";
import UploadCSV from "../uploadCSV/upload-csv.vue";
import axios from "axios";
import Papa from "papaparse";
import flushPromises from "flush-promises";
import * as uploadUtils from "../uploadCSV/uploadUtils";
import sinon from "sinon";
const event = {
  target: {
    files: [
      {
        name: "file.csv",
        size: 2,
        type: "text/csv",
      },
    ],
  },
};

describe("Upload CSV", () => {
  let wrapper;
  let countryStatuses = [
    {
      countryName: "IND",
      success: "false",
      currentStatus: "REVIEW_PENDING",
      message: "Country is already in REVIEW_PENDING state",
    },
    {
      countryName: "THA",
      success: "true",
      currentStatus: "REVIEW_PENDING",
      message: "",
    },
    {
      countryName: "PAK",
      success: "false",
      currentStatus: "PUBLISHED",
      message: "Country is already in PUBLISHED state",
    },
  ];

  const axiosPostSpy = vi.spyOn(axios, "post");
  const papaParseSpy = vi.spyOn(Papa, "parse").mockImplementation(() => null);
  const validateFieldsSpy = vi.spyOn(uploadUtils, "validateFields");
  const generatePayloadSpy = vi.spyOn(
    uploadUtils,
    "generatePayloadFromParsedJSON"
  );

  beforeEach(() => {
    axiosPostSpy.mockReset();
    papaParseSpy.mockReset();
    validateFieldsSpy.mockReset();
    generatePayloadSpy.mockReset();
    wrapper = mount(UploadCSV);
  });

  it("should submit data when the csv is uploaded", async () => {
    axiosPostSpy.mockResolvedValue({ data: countryStatuses });
    wrapper.vm.submitData();
    await flushPromises();

    expect(axiosPostSpy.mock.calls[0][0]).to.equal("/api/bff/countries/submit");
  });

  it("should not submit data when the wrong csv is uploaded and notifier should be displayed", async () => {
    let notifier = sinon.spy();

    wrapper.vm.notifier = notifier;
    axiosPostSpy.mockRejectedValue({});
    wrapper.vm.submitData();
    await flushPromises();

    sinon.assert.calledWith(notifier, {
      group: "custom-template",
      title: "Error",
      text: "Error While Importing Data To Server ",
      type: "error",
    });
  });

  it("should render upload csv", async () => {
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  it("import to server button should be disabled at start", async () => {
    expect(wrapper.vm.validationStatus).toBe("DEFAULT");
    const importButton = wrapper.find('[data-testid="import-button"]');
    expect(importButton.attributes().disabled).toEqual("disabled");
  });

  it("should call validateFields method when uploadFile is triggered", async () => {
    validateFieldsSpy.mockResolvedValue({ data: "a" });
    wrapper.vm.uploadFile(event);
    expect(papaParseSpy).toHaveBeenCalledWith(
      {
        name: "file.csv",
        size: 2,
        type: "text/csv",
      },
      expect.objectContaining({
        header: true,
        worker: true,
      })
    );
    papaParseSpy.mock.calls[0][1].complete({ data: ["abc"] });
    expect(validateFieldsSpy).toHaveBeenCalledWith("abc");
  });

  it("should set validation status to valid when validateFields is success", async () => {
    validateFieldsSpy.mockResolvedValue({ data: "a" });
    wrapper.vm.uploadFile(event);
    papaParseSpy.mock.calls[0][1].complete({ data: ["abc"] });
    await flushPromises();
    expect(generatePayloadSpy).toHaveBeenCalledOnce();
    expect(generatePayloadSpy).toHaveBeenCalledWith({ data: "a" });
    expect(wrapper.vm.validationStatus).toBe("VALID");
  });

  it("should set validation status to inValid when validateFields is failed", async () => {
    validateFieldsSpy.mockRejectedValueOnce({
      error: "error",
      value: { "Country Name": "India" },
    });
    wrapper.vm.uploadFile(event);
    papaParseSpy.mock.calls[0][1].complete({
      data: ["a"],
    });
    await flushPromises();
    expect(wrapper.vm.validationStatus).toBe("INVALID");
  });

  it("should set validation status to inValid when validateFields failed for one row and resolves for all other rows", async () => {
    validateFieldsSpy
      .mockRejectedValueOnce({
        error: "error",
        value: { "Country Name": "India" },
      })
      .mockRejectedValueOnce({
        error: "error",
        value: { "Country Name": "Germany" },
      })
      .mockResolvedValue({ data: "a" });
    wrapper.vm.uploadFile(event);
    papaParseSpy.mock.calls[0][1].complete({
      data: ["a", "b", "c"],
    });
    await flushPromises();
    expect(wrapper.vm.validationStatus).toBe("INVALID");
    expect(wrapper.vm.description).toContain("India");
  });

  it("should set validation status to invalid when file is empty", async () => {
    wrapper.vm.uploadFile(event);
    papaParseSpy.mock.calls[0][1].complete({ data: [] });
    expect(wrapper.vm.validationStatus).toBe("INVALID");
    expect(wrapper.vm.description).toBe("Empty csv");
  });
});
