import Vue from "vue";
import { shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import { describe, beforeEach, it, expect, vi } from "vitest";
import EditQuestionnaire from "../healthIndicatorQuestionnaire/edit-questionare.vue";
import VueRouter from "vue-router";
import sinon from "sinon";
import VeeValidate from "vee-validate";
import { i18n } from "../../plugins/i18n";
import axios from "axios";
import { EventBus } from "../common/event-bus";

describe("EditQuestionaire", () => {
  let component;
  const router = new VueRouter();

  const axiosPostSpy = vi.spyOn(axios, "post");
  const axiosDeleteSpy = vi.spyOn(axios, "delete");

  beforeEach(() => {
    axiosPostSpy.mockReset();
    Vue.use(VeeValidate);
    const $route = {
      path: "test",
      params: { countryUUID: "random-uuid", currentYear: "2023" },
    };
    component = shallowMount(EditQuestionnaire, {
      propsData: {
        showEdit: true,
        hasPreviousYearData: false,
        updatedDate: "March 2023",
        countrySummary: {
          countryName: "India",
          resources: [""],
          countryId: "some-random-uuid",
        },
        questionnaire: [],
        healthIndicators: {},
        status: "status",
        isAdmin: false,
      },
      router,
      i18n,
    });
    component.vm.$route = $route;
  });

  it("should have default value when props are not there", () => {
    component = shallowMount(EditQuestionnaire, {
      router,
      i18n,
    });
    expect(component.vm.questionnaire).to.deep.equal([]);
    expect(component.vm.healthIndicators).to.deep.equal({});
    expect(component.vm.countrySummary).to.deep.equal({ resources: [] });
    expect(component.vm.showEdit).to.deep.equal(true);
    expect(component.vm.status).to.deep.equal("");
    expect(component.vm.isAdmin).to.deep.equal(false);
    expect(component.vm.hasPreviousYearData).to.deep.equal(false);
    expect(component.vm.updatedDate).to.deep.equal("");
  });

  it("should contain the edit-questionnaire component", () => {
    expect(component.contains(".health-indicator-questionnaire")).to.equal(
      true
    );
  });

  it("should save data as draft and emit event", async () => {
    axiosPostSpy.mockResolvedValue({});
    let notifier = sinon.spy();
    vi.spyOn(EventBus, "$emit");

    await flushPromises();

    component.vm.$notify = notifier;
    component.vm.saveData("save");

    expect(axiosPostSpy.mock.calls[0][0]).to.equal("/api/countries/save");
    expect(axiosPostSpy.mock.calls[0][1].countryId).to.equal(
      "some-random-uuid"
    );
    await flushPromises();

    expect(EventBus.$emit.mock.calls[0][0]).to.equal(
      "edit_questionnaire:saved"
    );

    sinon.assert.calledWith(notifier, {
      group: "custom-template",
      title: "Success",
      text: component.vm.successMessages["save"],
      type: "success",
    });
  });

  it("should set showEdit to false when save data is called with action submit", async () => {
    axiosPostSpy.mockResolvedValue({});
    let notifier = sinon.spy();
    await flushPromises();

    component.vm.$notify = notifier;
    component.vm.saveData("submit");

    await flushPromises();

    expect(component.vm.showEdit).to.equal(false);
    sinon.assert.calledWith(notifier, {
      group: "custom-template",
      title: "Success",
      text: component.vm.successMessages["submit"],
      type: "success",
    });
  });

  it("should set showEdit to false when save data is called with action submit and should not have previous data", async () => {
    axiosPostSpy.mockResolvedValue({});
    let notifier = sinon.spy();
    await flushPromises();

    component.vm.$notify = notifier;
    component.vm.saveData("submit");

    await flushPromises();

    expect(component.vm.showEdit).to.equal(false);
    expect(component.vm.hasPreviousYearData).to.equal(false);
    sinon.assert.calledWith(notifier, {
      group: "custom-template",
      title: "Success",
      text: component.vm.successMessages["submit"],
      type: "success",
    });
  });

  it("should send approver fields as empty when checkbox is set to false and the action is submit", async () => {
    axiosPostSpy.mockResolvedValue({});
    let notifier = sinon.spy();
    component.vm.$notify = notifier;
    await flushPromises();

    const checkBoxInput = component.find('input[type="checkbox"]');
    checkBoxInput.setChecked(true);
    component.find("#nameofPersonApprovedData").setValue("hello");
    component.vm.validate("submit");
    expect(axiosPostSpy.mock.calls.length).to.equal(0);
    await flushPromises();
    sinon.assert.calledWith(notifier, {
      group: "custom-template",
      title: "Error",
      text: "Please correct the highlighted fields.",
      type: "error",
    });

    checkBoxInput.setChecked(false);
    await flushPromises();

    component.vm.saveData("submit");
    expect(axiosPostSpy.mock.calls[0][0]).to.equal("/api/countries/submit");
    expect(
      axiosPostSpy.mock.calls[0][1].countrySummary.dataApproverName
    ).to.equal("");
  });

  it("should send approver fields with respective data when checkbox is set to true and the action is submit", async () => {
    axiosPostSpy.mockResolvedValue({});
    let notifier = sinon.spy();
    component.vm.$notify = notifier;
    await flushPromises();

    const checkBoxInput = component.find('input[type="checkbox"]');
    checkBoxInput.setChecked(true);
    component.find("#nameofPersonApprovedData").setValue("name");
    component.find("#roleofPersonApprovedData").setValue("role");
    component.find("#emailofPersonApprovedData").setValue("email");

    await flushPromises();

    component.vm.saveData("submit");
    expect(axiosPostSpy.mock.calls[0][0]).to.equal("/api/countries/submit");
    expect(
      axiosPostSpy.mock.calls[0][1].countrySummary.dataApproverName
    ).to.equal("name");
    expect(
      axiosPostSpy.mock.calls[0][1].countrySummary.dataApproverRole
    ).to.equal("role");
    expect(
      axiosPostSpy.mock.calls[0][1].countrySummary.dataApproverEmail
    ).to.equal("email");
  });
  it("should display warning message when the data is on review and isAdmin is false", async () => {
    axiosPostSpy.mockResolvedValue({});
    await flushPromises();
    component.vm.status = "REVIEW_PENDING";
    component.vm.isAdmin = false;
    expect(component.vm.warningMessage).to.equal(
      "Data is already submitted for the current year on March 2023"
    );
  });

  it("should display warning message when the data is published and isAdmin is false", async () => {
    axiosPostSpy.mockResolvedValue({});
    await flushPromises();
    component.vm.status = "PUBLISHED";
    component.vm.isAdmin = false;
    expect(component.vm.warningMessage).to.equal(
      "Data for current year is already published on March 2023"
    );
  });

  it("should display warning message when the data is prefilled for a questionnaire from a previous year", async () => {
    axiosPostSpy.mockResolvedValue({});
    await flushPromises();
    component.vm.hasPreviousYearData = true;
    expect(component.vm.warningMessage).to.equal(
      "Data has been pre-populated in the questionnaire from year March 2023. Please update the data for current year and provide relevant justification"
    );
  });

  it("should display approver fields when is government approved checkbox is set to true", async () => {
    axiosPostSpy.mockResolvedValue({});
    await flushPromises();
    const checkBoxInput = component.find('input[type="checkbox"]');
    checkBoxInput.setChecked(true);
    await flushPromises();
    expect(checkBoxInput.element.checked).toBeTruthy();
    expect(component.find("#nameofPersonApprovedData").isVisible()).toBe(true);
    expect(component.find("#roleofPersonApprovedData").isVisible()).toBe(true);
    expect(component.find("#emailofPersonApprovedData").isVisible()).toBe(true);
  });

  it("should not display approver fields when is government approved checkbox is set to false", async () => {
    axiosPostSpy.mockResolvedValue({});
    await flushPromises();
    const checkBoxInput = component.find('input[type="checkbox"]');
    checkBoxInput.setChecked(false);
    await flushPromises();
    expect(checkBoxInput.element.checked).toBeFalsy();
    expect(component.find("#nameofPersonApprovedData").isVisible()).toBe(false);
    expect(component.find("#roleofPersonApprovedData").isVisible()).toBe(false);
    expect(component.find("#emailofPersonApprovedData").isVisible()).toBe(
      false
    );
  });

  it("should display error notifier  when save data call is failed with error 400", async () => {
    axiosPostSpy.mockRejectedValue({
      response: {
        status: 400,
        data: { message: "problem", status: 400 },
      },
    });

    let notifier = sinon.spy();
    await flushPromises();

    component.vm.$notify = notifier;
    component.vm.saveData("submit");

    await flushPromises();

    sinon.assert.calledWith(notifier, {
      group: "custom-template",
      title: "Error",
      text: "Invalid Data",
      type: "error",
    });
  });

  it("should display error notifier  when save data call is failed with error other than 400", async () => {
    axiosPostSpy.mockRejectedValue({
      response: {
        status: 402,
        data: { message: "problem", status: 402 },
      },
    });

    let notifier = sinon.spy();
    await flushPromises();

    component.vm.$notify = notifier;

    component.vm.saveData("submit");
    await flushPromises();

    sinon.assert.calledWith(notifier, {
      group: "custom-template",
      title: "Error",
      text: "Something has gone wrong. Please refresh the Page!",
      type: "error",
    });
  });

  it("should show publish confirm after validation is done", async () => {
    component.vm.questionnaire = [
      {
        categoryId: 1,
        categoryName: "some category",
        showCategory: false,
      },
      {
        categoryId: 2,
        categoryName: "some other category",
        showCategory: false,
      },
    ];

    let getConfirmationDialog = sinon.spy();
    component.vm.getConfirmationDialog = getConfirmationDialog;
    let publishData = sinon.spy();
    component.vm.publish = publishData;

    sinon
      .stub(component.vm.$validator, "validateAll")
      .returns(new Promise((resolve, reject) => resolve(true)));
    component.vm.validate("publish");

    await flushPromises();
    expect(component.vm.questionnaire[0].showCategory).to.be.true;
    expect(component.vm.questionnaire[1].showCategory).to.be.true;
    sinon.assert.calledWith(getConfirmationDialog, {
      message:
        "You are about to publish digital health index form for India. This cannot be reverted. Do you want" +
        " to continue?",
      callBackMethod: publishData,
      callBackArgs: [],
    });
  });

  it("should not show publish confirm if data is not valid", async () => {
    let getConfirmationDialog = sinon.spy();
    component.vm.getConfirmationDialog = getConfirmationDialog;
    let notifier = sinon.spy();
    component.vm.$notify = notifier;

    sinon
      .stub(component.vm.$validator, "validateAll")
      .returns(new Promise((resolve) => resolve(false)));
    component.vm.validate("publish");

    await flushPromises();

    sinon.assert.notCalled(getConfirmationDialog);
    sinon.assert.calledWith(notifier, {
      group: "custom-template",
      title: "Error",
      text: "Please correct the highlighted fields.",
      type: "error",
    });
  });

  it("should show submit confirmation dialog when submit is pressed", async () => {
    let getConfirmationDialog = sinon.spy();
    let saveData = sinon.spy();
    component.vm.saveData = saveData;
    component.vm.getConfirmationDialog = getConfirmationDialog;

    sinon
      .stub(component.vm.$validator, "validateAll")
      .returns(new Promise((resolve) => resolve(true)));
    component.vm.validate("submit");
    await flushPromises();

    sinon.assert.calledWith(getConfirmationDialog, {
      message:
        "Are you sure you want to submit the data for India? Please check the options selected by you are reflecting Country's current year digital health maturity",
      callBackMethod: saveData,
      callBackArgs: ["submit"],
    });
  });

  it("should not submit data when data is invalid", async () => {
    let saveData = sinon.spy();
    component.vm.saveData = saveData;
    let notifier = sinon.spy();
    component.vm.$notify = notifier;

    sinon
      .stub(component.vm.$validator, "validateAll")
      .returns(new Promise((resolve) => resolve(false)));
    component.vm.validate("submit");
    await flushPromises();
    sinon.assert.notCalled(saveData);
    sinon.assert.calledWith(notifier, {
      group: "custom-template",
      title: "Error",
      text: "Please correct the highlighted fields.",
      type: "error",
    });
  });

  it("should call getConfirmationDialog on click of Reject with the given params", () => {
    let getConfirmationDialog = sinon.spy();
    let deleteData = sinon.spy();
    component.vm.deleteData = deleteData;
    component.vm.getConfirmationDialog = getConfirmationDialog;
    component.vm.reject();

    sinon.assert.calledWith(getConfirmationDialog, {
      message:
        "You are about to reject digital health index form for India. This cannot be reverted. Do you want to continue?",
      callBackMethod: deleteData,
      callBackArgs: [],
    });
  });

  it("should call delete api and redirect to admin page", async () => {
    let notifier = sinon.spy();
    component.vm.$notify = notifier;
    axiosDeleteSpy.mockResolvedValue({});
    component.vm.deleteData();

    await flushPromises();
    expect(axiosDeleteSpy.mock.calls[0][0]).to.equal(
      `/api/countries/random-uuid/delete/2023`
    );
    // TODO: Check the below
    // await flushPromises();
    // sinon.assert.calledWith(routerPush, { path: `/admin` });
  });

  it("should call publish api and redirect to admin page", async () => {
    let notifier = sinon.spy();
    const mockPush = vi.fn();
    axiosPostSpy.mockResolvedValue({});
    component.vm.$notify = notifier;
    component.vm.$router = { push: mockPush };
    component.vm.saveData("publish");

    await flushPromises();

    expect(axiosPostSpy.mock.calls[0][0]).to.equal(
      `/api/countries/publish/2023`
    );
    expect(mockPush.mock.calls[0][0].path).to.equal("/admin");
  });

  it("should call delete api and notify with error message on server error", async () => {
    axiosDeleteSpy.mockRejectedValue({});
    let notifier = sinon.spy();

    component.vm.$notify = notifier;

    component.vm.deleteData();

    await flushPromises();

    expect(axiosDeleteSpy.mock.calls[0][0]).to.equal(
      `/api/countries/random-uuid/delete/2023`
    );

    await flushPromises();
    sinon.assert.calledWith(notifier, {
      group: "custom-template",
      title: "Error",
      text: "Something has gone wrong. Please refresh the Page!",
      type: "error",
    });
  });
});
