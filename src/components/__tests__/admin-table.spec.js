import { mount } from "@vue/test-utils";
import AdminTable from "../displayTable/admin-table.vue";
import sinon from "sinon";

describe("Admin Table", () => {
  let wrapper;
  const columns = [
    { propName: "countryName", displayName: "Country" },
    { propName: "status", displayName: "Status" },
  ];
  const rows = [
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
  ];
  const action = "View Data";
  const noRecordsMessage = "No Records Found";
  const actionHandler = sinon.spy();
  it("should set the default values if the props are not set", () => {
    wrapper = mount(AdminTable);
    expect(wrapper.props().columns).to.deep.equal([]);
    expect(wrapper.props().rows).to.deep.equal([]);
    expect(wrapper.props().action).to.deep.equal("");
    expect(wrapper.props().noRecordsMessage).to.deep.equal("");
  });
  it("Should render the table when the values are passed to the component", () => {
    const wrapper = mount(AdminTable, {
      propsData: {
        columns: columns,
        rows: rows,
        action: action,
        actionHandler: actionHandler,
        noRecordsMessage: noRecordsMessage,
      },
    });
    expect(wrapper.props().columns).to.deep.equal(columns);
    expect(wrapper.props().rows).to.deep.equal(rows);
    expect(wrapper.props().action).to.deep.equal(action);
    expect(wrapper.props().noRecordsMessage).to.deep.equal(noRecordsMessage);
    expect(wrapper.findAll("#fifthTable tr").length).to.equal(rows.length + 1);
    expect(wrapper.findAll("#fifthTable th").at(0).text()).to.equal(
      columns[0].displayName
    );
    expect(wrapper.findAll("#fifthTable td").at(0).text()).to.equal(
      rows[0][columns[0].propName]
    );
  });

  it("Should render the Error Message if there are no rows", () => {
    const wrapper = mount(AdminTable, {
      propsData: {
        columns: columns,
        rows: [],
        action: action,
        actionHandler: actionHandler,
        noRecordsMessage: noRecordsMessage,
      },
    });
    expect(wrapper.contains("#fifthTable")).to.equal(false);
    expect(wrapper.contains(".error-info")).to.equal(true);
    expect(wrapper.find(".error-info").text()).to.equal(noRecordsMessage);
  });
});
