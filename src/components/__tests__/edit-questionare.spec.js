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
  });

  it("should contain the edit-questionnaire component", () => {
    expect(component.contains(".health-indicator-questionnaire")).to.equal(
      true
    );
  });

  it("should save data as draft", async () => {
    axiosPostSpy.mockResolvedValue({});
    let notifier = sinon.spy();

    await flushPromises();

    component.vm.$notify = notifier;
    component.vm.saveData("save");

    expect(axiosPostSpy.mock.calls[0][0]).to.equal("/api/countries/save");
    expect(axiosPostSpy.mock.calls[0][1].countryId).to.equal(
      "some-random-uuid"
    );
    await flushPromises();

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

  it("should submit data when data is valid", async () => {
    let saveData = sinon.spy();
    component.vm.saveData = saveData;

    sinon
      .stub(component.vm.$validator, "validateAll")
      .returns(new Promise((resolve) => resolve(true)));
    component.vm.validate("submit");
    await flushPromises();

    sinon.assert.calledOnce(saveData);
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
    let routerPush = sinon.spy(router, "push");
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
