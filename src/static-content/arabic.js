import { worldMap } from "./world-map/arabic";
import { methodology } from "./methodology/arabic";
import { countryList } from "./country-list/arabic";
import { countryProfile } from "./country-profile/arabic";
import { indicators } from "./indicators/arabic";
import { date } from "./date/arabic";
import { healthIndicatorQuestionnaire } from "./health-indicator-questionnaire/arabic";

export const ar = {
  worldMap,
  methodology,
  countryList,
  countryProfile,
  indicators,
  date,
  healthIndicatorQuestionnaire,
  headers: {
    worldMap: "خريطة العالم",
    indicators: "المؤشرات",
    searchBoxPlaceholder: "البحث عن طريق اسم البلد",
  },
  mixed: {
    textOverAll: "المؤشر العام",
    phase: "المرحلة",
    phaseN: "المرحلة {number}",
    all: "الكل",
    noDataAvailable: "لا تتوافر بيانات",
    noData: "لايوجد بيانات",
    serverErrorTitle: "خطأ في خادم الكمبيوتر",
    loading: "جارٍ تحميل",
    selectYear: "حدد السنة التي سيتم عرض التاريخ فيها على الصفحة الرئيسية",
  },
  footer: {
    contactEmail: "الاتصال: info@digitalhealthindex.org",
  },
  scoreCardPDF: {
    title: "{country} - بطاقة نتائج الصحة الرقمية الوطنية",
    benchMarkPhaseValue: "المرحلة {benchmarkPhase} بلدان",
    benchmarkAgainstBenchmarkValue: "المعيار ضد {benchMarkPhaseValue}",
    noteForBenchmark:
      "يستخدم المؤشر الرئيسي في كل فئة لحساب المتوسط العام للبلد. يمكن قياس كل بلد مقابل المتوسط العالمي أو البلدان ضمن مرحلة محددة.",
  },
};
