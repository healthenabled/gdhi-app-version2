import Vue from "vue";
import VueI18n from "vue-i18n";
import { ar, en, es, fr, pt } from "../static-content/index";

Vue.use(VueI18n);
const messages = {
  en,
  es,
  fr,
  pt,
  ar,
};

const english = "en";
export const i18n = new VueI18n({
  locale: "en",
  fallbackLocale: english,
  messages,
});

const LTR = "ltr";
const RTL = "rtl";

export const LayoutDirectionConfig = {
  en: LTR,
  es: LTR,
  fr: LTR,
  pt: LTR,
  ar: RTL,
};
