import { mount } from "@vue/test-utils";
import MapLegend from "../legend/legend.vue";
import colorCodes from "../common/color-codes.js";
import { i18n } from "../../plugins/i18n";

describe("legends", () => {
  let wrapper;
  let colorCodesValues = colorCodes.getColorCodes();

  beforeEach(() => {
    wrapper = mount(MapLegend, { i18n });
  });
  it("should return the color codes object", () => {
    expect(wrapper.findAll(".l-box").length).to.equal(colorCodesValues.length);
  });
  it("should display the correct phase in the li", () => {
    expect(wrapper.findAll(".l-box").at(0).text()).to.equal(
      colorCodesValues[0].score
    );
  });
});
