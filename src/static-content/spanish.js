import { worldMap } from "./world-map/spanish";
import { methodology } from "./methodology/spanish";
import { countryList } from "./country-list/spanish";
import { countryProfile } from "./country-profile/spanish";
import { indicators } from "./indicators/spanish";
import { date } from "./date/spanish";
import { healthIndicatorQuestionnaire } from "./health-indicator-questionnaire/spanish";
import { regionalOverview } from "./regional-overview/spanish";

export const es = {
  worldMap,
  methodology,
  countryList,
  countryProfile,
  indicators,
  date,
  healthIndicatorQuestionnaire,
  headers: {
    worldMap: "Mapa del mundo",
    indicators: "Indicadores",
    searchBoxPlaceholder: "Búsqueda por nombre de país",
    regionalOverview: "Resumen regional",
    countries: "Países",
  },
  mixed: {
    textOverAll: "En general",
    phase: "Fase",
    phaseN: "Fase {number}",
    all: "Todos",
    noDataAvailable: "No hay datos disponibles",
    noData: "Sin datos",
    serverErrorTitle: "Error del servidor",
    loading: "Cargando",
    selectYear:
      "Seleccione el año para el que se mostrará la fecha en la página de inicio",
  },
  footer: {
    contactEmail: "Contacto: info@digitalhealthmonitor.org",
  },
  scoreCardPDF: {
    title: "{country} - Cuadro de Mando de la Salud Digital Nacional",
    benchMarkPhaseValue: "Fase {benchmarkPhase} Países",
    benchmarkAgainstBenchmarkValue:
      "Punto de referencia contra {benchMarkPhaseValue}",
    noteForBenchmark:
      "El indicador principal de cada categoría se utiliza para calcular el promedio general del país. Cada país puede ser " +
      "comparado con el promedio mundial o con los países dentro de una fase seleccionada.",
    spiderGraphTitle: "Resumen de fases",
    lineChartTitle: "Progreso del país a lo largo de los años",
    govtApprovedTrue: "Aprobada por el gobierno: Verdadera",
    govtApprovedFalse: "Aprobado por el gobierno: Falso",
  },
  regionDropDown: {
    textSelectRegion: "Seleccione región",
  },
  regionalOverview,
};
