import { mount } from "@vue/test-utils";
import { describe, beforeEach, it, expect } from "vitest";
import ErrorComp from "../errorHandler/404-error.vue";

describe("Error Page", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(ErrorComp);
  });
  it(" should have errorMessage in the component", () => {
    expect(wrapper.vm.errorMessage).to.equal("Page Not Found!.");
  });
  it(" should contain the error message in the HTML", () => {
    expect(wrapper.find(".errorMessage").text()).to.include(
      wrapper.vm.errorMessage
    );
  });
});
