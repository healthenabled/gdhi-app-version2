import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import adminViewFormDetails from "../adminViewFormDetails/admin-view-form-details.vue";
import VueRouter from "vue-router";
import { i18n } from "../../plugins/i18n";
import axios from "axios";
import flushPromises from "flush-promises";

const axiosGetSpy = vi.spyOn(axios, "get");

describe("AdminViewFormDetails", () => {
  let component;
  const router = new VueRouter();

  let responseData = {
    currentYear: "2023",
    NEW: [
      {
        countryName: "India",
        countryUUID: "1b9f0f33-9c69-4bfc-8730-8bcbb5c06d88",
        status: "NEW",
        contactName: "contactName",
        contactEmail: "email",
      },
      {
        countryName: "Australia",
        countryUUID: "5a1f8e8c-7ebd-499a-b6b0-015828695796",
        status: "NEW",
        contactName: "contactName",
        contactEmail: "email",
      },
    ],
    PUBLISHED: [
      {
        countryName: "Australia",
        countryUUID: "5a1f8e8c-7ebd-499a-b6b0-015828695796",
        status: "PUBLISHED",
        contactName: "contactName",
        contactEmail: "email",
      },
    ],
    DRAFT: [
      {
        countryName: "Australia",
        countryUUID: "5a1f8e8c-7ebd-499a-b6b0-015828695796",
        status: "DRAFT",
        contactName: "contactName",
        contactEmail: "email",
      },
    ],
    REVIEW_PENDING: [
      {
        countryName: "Australia",
        countryUUID: "5a1f8e8c-7ebd-499a-b6b0-015828695796",
        status: "REVIEW_PENDING",
        contactName: "contactName",
        contactEmail: "email",
      },
    ],
  };
  it("should get admin view form details data", async () => {
    axiosGetSpy.mockResolvedValue({ data: responseData });

    component = mount(adminViewFormDetails, {
      data: () => ({
        tabs: [
          { id: 0, name: "Awaiting Submission" },
          { id: 1, name: "Review Pending" },
          { id: 2, name: "Live Data" },
        ],
      }),
      router,
    });
    await flushPromises();

    let updateSelected = vi.fn();
    component.vm.updateSelected = updateSelected;
    component.vm.loadAdminViewFormDetails();

    await flushPromises();

    updateSelected.mockReturnValue({
      id: 0,
      name: "Awaiting Submission",
    });

    expect(component.vm.allData).to.equal(responseData);
    expect(component.vm.$el).toMatchSnapshot();
  });

  it("should call getTabData when updateSelected is called", async () => {
    axiosGetSpy.mockResolvedValue({ data: responseData });

    component = mount(adminViewFormDetails, {
      data: () => ({
        tabs: [
          { id: 0, name: "Awaiting Submission" },
          { id: 1, name: "Review Pending" },
          { id: 2, name: "Live Data" },
        ],
      }),
      router,
    });
    await flushPromises();

    let getTabData = vi.fn();
    component.vm.getTabData = getTabData;
    component.vm.updateSelected({ id: 0, name: "Awaiting Submission" });
    getTabData.mockReturnValue({
      id: 0,
      name: "Awaiting Submission",
    });

    expect(component.vm.selectedTab).to.equal(0);
  });

  it("should set error value when the API call is failed", async () => {
    const errResp = {
      response: { message: "problem" },
    };
    axiosGetSpy.mockRejectedValue(errResp);
    component = mount(adminViewFormDetails, {
      data: () => ({
        tabs: [
          { id: 0, name: "Awaiting Submission" },
          { id: 1, name: "Review Pending" },
          { id: 2, name: "Live Data" },
        ],
      }),
      router,
    });
    await flushPromises();

    expect(component.vm.error).to.equal(errResp.response.message);
  });

  it("should call openUrl when actionHandler is invoked", async () => {
    axiosGetSpy.mockResolvedValue({ data: responseData });

    component = mount(adminViewFormDetails, {
      data: () => ({
        tabs: [
          { id: 0, name: "Awaiting Submission" },
          { id: 1, name: "Review Pending" },
          { id: 2, name: "Live Data" },
        ],
      }),
      router,
      i18n,
    });
    await flushPromises();
    let openUrl = vi.fn();
    component.vm.openUrl = openUrl;
    openUrl.mockReturnValueOnce(
      location.origin + "/admin/health_indicator_questionnaire/some-uuid/review"
    );

    component.vm.actionHandler("Review", "some-uuid");
    expect(openUrl.mock.calls.length).to.equal(1);
    openUrl.mockReturnValueOnce(
      location.origin + "/admin/health_indicator_questionnaire/some-uuid/review"
    );

    component.vm.actionHandler("View Live Data", "some-uuid");
    expect(openUrl.mock.calls.length).to.equal(2);

    component.vm.actionHandler("Other Text", "some-uuid");
    expect(openUrl.mock.calls.length).to.equal(2);
  });

  it("should call openUrl when editHandler is invoked", async () => {
    axiosGetSpy.mockResolvedValue({ data: responseData });

    component = mount(adminViewFormDetails, {
      data: () => ({
        tabs: [
          { id: 0, name: "Awaiting Submission" },
          { id: 1, name: "Review Pending" },
          { id: 2, name: "Live Data" },
        ],
      }),
      router,
      i18n,
    });
    await flushPromises();
    let openUrl = vi.fn();
    component.vm.openUrl = openUrl;
    openUrl.mockReturnValueOnce(
      location.origin +
        "/admin/health_indicator_questionnaire/some-uuid/editPublished"
    );

    component.vm.editHandler("some-uuid");
    expect(openUrl.mock.calls.length).to.equal(1);
  });

  it("should populate the table rows when getTabData is called ", async () => {
    axiosGetSpy.mockResolvedValue({ data: responseData });

    component = mount(adminViewFormDetails, {
      data: () => ({
        tabs: [
          { id: 0, name: "Awaiting Submission" },
          { id: 1, name: "Review Pending" },
          { id: 2, name: "Live Data" },
        ],
      }),
      router,
    });
    await flushPromises();

    component.vm.allData = responseData;
    component.vm.getTabData(component.vm.tabs[0]);
    expect(component.vm.tableRows).to.deep.equal([
      ...responseData.NEW,
      ...responseData.DRAFT,
    ]);
    expect(component.vm.noRecordsMessage).to.equal("");
    component.vm.getTabData(component.vm.tabs[1]);
    expect(component.vm.tableRows).to.deep.equal(responseData.REVIEW_PENDING);
    expect(component.vm.editLiveData).toBe(false);
    expect(component.vm.noRecordsMessage).to.equal("");
    component.vm.getTabData(component.vm.tabs[2]);
    expect(component.vm.tableRows).to.deep.equal(responseData.PUBLISHED);
    expect(component.vm.noRecordsMessage).to.equal("");
    expect(component.vm.editLiveData).toBe(true);
  });

  it("should return empty tablerows when the value is undefined", async () => {
    axiosGetSpy.mockResolvedValue({ data: responseData });

    component = mount(adminViewFormDetails, {
      data: () => ({
        tabs: [
          { id: 0, name: "Awaiting Submission" },
          { id: 1, name: "Review Pending" },
          { id: 2, name: "Live Data" },
        ],
      }),
      router,
    });
    await flushPromises();

    let updatedResponse = { ...responseData };
    updatedResponse.NEW = undefined;
    component.vm.allData = updatedResponse;
    component.vm.getTabData(component.vm.tabs[0]);
    expect(component.vm.tableRows).to.deep.equal([...responseData.DRAFT]);

    updatedResponse = { ...responseData };
    updatedResponse.DRAFT = undefined;
    component.vm.allData = updatedResponse;
    component.vm.getTabData(component.vm.tabs[0]);
    expect(component.vm.tableRows).to.deep.equal([...responseData.NEW]);

    updatedResponse = { ...responseData };
    updatedResponse.NEW = undefined;
    updatedResponse.DRAFT = undefined;
    component.vm.allData = updatedResponse;
    component.vm.getTabData(component.vm.tabs[0]);
    expect(component.vm.tableRows).to.deep.equal([]);
    expect(component.vm.noRecordsMessage).to.equal("No Records Found");

    updatedResponse = { ...responseData };
    updatedResponse.REVIEW_PENDING = undefined;
    component.vm.allData = updatedResponse;
    component.vm.getTabData(component.vm.tabs[1]);
    expect(component.vm.tableRows).to.deep.equal([]);
    expect(component.vm.noRecordsMessage).to.equal("No Records Found");

    updatedResponse = { ...responseData };
    updatedResponse.PUBLISHED = undefined;
    component.vm.allData = updatedResponse;
    component.vm.getTabData(component.vm.tabs[2]);
    expect(component.vm.tableRows).to.deep.equal([]);
    expect(component.vm.noRecordsMessage).to.equal("No Records Found");

    component.vm.allData = {};
    component.vm.getTabData(component.vm.tabs[2]);
    expect(component.vm.tableRows).to.deep.equal([]);
    expect(component.vm.noRecordsMessage).to.equal("No Records Found");
  });

  it("should set the tablerows to [] when getTab data is called for indices greater than 2", async () => {
    axiosGetSpy.mockResolvedValue({ data: responseData });

    component = mount(adminViewFormDetails, {
      data: () => ({
        tabs: [
          { id: 0, name: "Awaiting Submission" },
          { id: 1, name: "Review Pending" },
          { id: 2, name: "Live Data" },
        ],
      }),
      router,
    });
    await flushPromises();

    component.vm.allData = responseData;
    component.vm.getTabData(component.vm.tabs[3]);
    expect(component.vm.tableRows).to.deep.equal([]);
    expect(component.vm.tableColumns).to.deep.equal([]);
  });
});
