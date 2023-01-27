import { i18n } from "../../plugins/i18n";
import { describe, it, expect } from "vitest";

describe("i18n", () => {
  it("should have default locale as en", () => {
    expect(i18n.locale).to.equal("en");
  });

  it("should have fallback locale as en", () => {
    expect(i18n.fallbackLocale).to.equal("en");
  });

  it("should have messages for english, spanish, portuguese, french, arabic", () => {
    expect(i18n.messages.en).to.exist;
    expect(i18n.messages.es).to.exist;
    expect(i18n.messages.pt).to.exist;
    expect(i18n.messages.fr).to.exist;
    expect(i18n.messages.ar).to.exist;
  });
});
