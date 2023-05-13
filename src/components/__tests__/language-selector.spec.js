import { createLocalVue, mount } from "@vue/test-utils";
import LanguageSelector from "../languageSelector/language-selector.vue";
import { describe, it, expect } from "vitest";
import { i18n } from "../../plugins/i18n";
import VueCookies from "vue-cookies";

describe("language selector", () => {
  let wrapper;
  it("should change i18n locale when user change the language to spanish", () => {
    const localVue = createLocalVue();
    localVue.use(VueCookies);
    wrapper = mount(LanguageSelector, {
      i18n,
      localVue,
    });

    expect(wrapper.vm.$i18n.locale).to.equal("en");

    wrapper
      .findAll("select > option")
      .filter((e) => e.element._value === "es")
      .at(0).element.selected = true;
    wrapper.find("select").trigger("change");

    expect(wrapper.vm.$i18n.locale).to.equal("es");
  });
});
