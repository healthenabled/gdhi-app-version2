import { worldMap } from "./world-map/portuguese";
import { methodology } from "./methodology/portuguese";
import { countryList } from "./country-list/portuguese";
import { countryProfile } from "./country-profile/portuguese";
import { indicators } from "./indicators/portuguese";
import { date } from "./date/portuguese";
import { healthIndicatorQuestionnaire } from "./health-indicator-questionnaire/portuguese";

export const pt = {
  worldMap,
  methodology,
  countryList,
  countryProfile,
  indicators,
  date,
  healthIndicatorQuestionnaire,
  headers: {
    worldMap: "Mapa do Mundo",
    indicators: "Indicadores",
    searchBoxPlaceholder: "Pesquisar por nome do país",
  },
  mixed: {
    textOverAll: "Total",
    phase: "Fase",
    phaseN: "Fase {number}",
    all: "Todos",
    noDataAvailable: "Nenhum dado disponível",
    noData: "Nenhum dado",
    serverErrorTitle: "Erro do servidor",
    loading: "Carregando",
    selectYear:
      "Selecione o ano para o qual a data deve ser exibida na página inicial",
  },
  footer: {
    contactEmail: "Contacto: info@digitalhealthindex.org",
  },
  scoreCardPDF: {
    title: "{country} - Quadro de Pontuação Nacional de Saúde Digital",
    benchMarkPhaseValue: "Fase {benchmarkPhase} Países",
    benchmarkAgainstBenchmarkValue: "Referência contra {benchMarkPhaseValue}",
    noteForBenchmark:
      "O indicador principal em cada categoria é utilizado para calcular a média global do país. Cada país pode ser " +
      "comparado com a média global ou com países dentro de uma fase selecionada.",
    spiderGraphTitle: "Visão geral da fase",
    lineChartTitle: "Comparação de países",
  },
  regionDropDown: {
    textSelectRegion: "Selecione a região",
  },
};
