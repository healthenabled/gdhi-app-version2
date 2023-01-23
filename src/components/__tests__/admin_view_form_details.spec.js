import { mount } from "@vue/test-utils";
import adminViewFormDetails from "../adminViewFormDetails/admin-view-form-details.vue";
import VueRouter from "vue-router";
import moxios from "moxios";
import sinon from "sinon";
import { i18n } from "../../plugins/i18n";

describe("AdminViewFormDetails", () => {
  let component;
  const router = new VueRouter();

  let responseData = {
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
  beforeEach(() => {
    moxios.install();
    component = mount(adminViewFormDetails, {
      data: {
        tabs: [
          { id: 0, name: "Awaiting Submission" },
          { id: 1, name: "Review Pending" },
          { id: 2, name: "Live Data" },
        ],
      },
      router,
    });
  });
  it("should get admin view form details data", (done) => {
    let updateSelected = sinon.spy();
    component.vm.updateSelected = updateSelected;
    component.vm.loadAdminViewFormDetails();

    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request
        ?.respondWith({
          status: 200,
          response: responseData,
        })
        .then(() => {
          sinon.assert.calledWith(updateSelected, {
            id: 0,
            name: "Awaiting Submission",
          });
          expect(component.vm.allData).to.equal(responseData);
          done();
        });
    });
  });

  it("should call getTabData when updateSelected is called", (done) => {
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request
        ?.respondWith({
          status: 200,
          response: responseData,
        })
        .then(() => {
          let getTabData = sinon.spy();
          component.vm.getTabData = getTabData;
          component.vm.updateSelected({ id: 0, name: "Awaiting Submission" });
          sinon.assert.calledWith(getTabData, {
            id: 0,
            name: "Awaiting Submission",
          });
          expect(component.vm.selectedTab).to.equal(0);
          done();
        });
    });
    moxios.uninstall();
  });

  it("should set error value when the API call is failed", (done) => {
    let errResp = {
      status: 500,
      response: { message: "problem" },
    };
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.reject(errResp);
      moxios.wait(() => {
        expect(component.vm.error).to.equal(errResp.response.message);
        done();
      });
    });
    moxios.uninstall();
  });

  it("should call openUrl when actionHandler is invoked", () => {
    component = mount(adminViewFormDetails, {
      data: {
        tabs: [
          { id: 0, name: "Awaiting Submission" },
          { id: 1, name: "Review Pending" },
          { id: 2, name: "Live Data" },
        ],
      },
      router,
      i18n,
    });
    let openUrl = sinon.spy();
    component.vm.openUrl = openUrl;

    component.vm.actionHandler("Review", "some-uuid");
    sinon.assert.calledWith(
      openUrl,
      location.origin + "/admin/health_indicator_questionnaire/some-uuid/review"
    );
    sinon.assert.calledOnce(openUrl);

    component.vm.actionHandler("View Live Data", "some-uuid");
    sinon.assert.calledWith(
      openUrl,
      location.origin +
        "/admin/health_indicator_questionnaire/some-uuid/viewPublished"
    );
    sinon.assert.calledTwice(openUrl);

    component.vm.actionHandler("Other Text", "some-uuid");
    sinon.assert.calledTwice(openUrl);
  });

  it("should populate the table rows when getTabData is called ", () => {
    component = mount(adminViewFormDetails, {
      data: {
        tabs: [
          { id: 0, name: "Awaiting Submission" },
          { id: 1, name: "Review Pending" },
          { id: 2, name: "Live Data" },
        ],
      },
      router,
    });
    component.vm.allData = responseData;
    component.vm.getTabData(component.vm.tabs[0]);
    expect(component.vm.tableRows).to.deep.equal([
      ...responseData.NEW,
      ...responseData.DRAFT,
    ]);
    expect(component.vm.noRecordsMessage).to.equal("");
    component.vm.getTabData(component.vm.tabs[1]);
    expect(component.vm.tableRows).to.deep.equal(responseData.REVIEW_PENDING);
    expect(component.vm.noRecordsMessage).to.equal("");
    component.vm.getTabData(component.vm.tabs[2]);
    expect(component.vm.tableRows).to.deep.equal(responseData.PUBLISHED);
    expect(component.vm.noRecordsMessage).to.equal("");
  });

  it("should return empty tablerows when the value is undefined", () => {
    component = mount(adminViewFormDetails, {
      data: {
        tabs: [
          { id: 0, name: "Awaiting Submission" },
          { id: 1, name: "Review Pending" },
          { id: 2, name: "Live Data" },
        ],
      },
      router,
    });
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

  it("should set the tablerows to [] when getTab data is called for indices greater than 2", () => {
    component = mount(adminViewFormDetails, {
      data: {
        tabs: [
          { id: 0, name: "Awaiting Submission" },
          { id: 1, name: "Review Pending" },
          { id: 2, name: "Live Data" },
        ],
      },
      router,
    });
    component.vm.allData = responseData;
    component.vm.getTabData(component.vm.tabs[3]);
    expect(component.vm.tableRows).to.deep.equal([]);
    expect(component.vm.tableColumns).to.deep.equal([]);
  });

  afterEach(() => {
    moxios.uninstall();
  });
});
