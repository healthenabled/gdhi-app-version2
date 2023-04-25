import { worldMap } from "./world-map/french";
import { methodology } from "./methodology/french";
import { countryList } from "./country-list/french";
import { countryProfile } from "./country-profile/french";
import { indicators } from "./indicators/french";
import { date } from "./date/french";
import { healthIndicatorQuestionnaire } from "./health-indicator-questionnaire/french";

export const fr = {
  worldMap,
  methodology,
  countryList,
  countryProfile,
  indicators,
  date,
  healthIndicatorQuestionnaire,
  headers: {
    worldMap: "Carte du monde",
    indicators: "Indicateurs",
    searchBoxPlaceholder: "Recherche par nom de pays",
  },
  mixed: {
    textOverAll: "Dans l'ensemble",
    phase: "Phase",
    phaseN: "Phase {number}",
    all: "Toutes",
    noDataAvailable: "Pas de données disponibles",
    noData: "Aucune donnée",
    serverErrorTitle: "Erreur de serveur",
    loading: "Chargement",
    selectYear:
      "Sélectionnez l'année pour laquelle la date doit être affichée sur la page d'accueil",
  },
  footer: {
    contactEmail: "Contact: info@digitalhealthindex.org",
  },
  scoreCardPDF: {
    title: "{country} - Tableau de Bord National de la Santé Numérique ",
    benchMarkPhaseValue: "Phase {benchmarkPhase} pays",
    benchmarkAgainstBenchmarkValue: "RÉFÉRENCE Against {benchMarkPhaseValue}",
    noteForBenchmark:
      "L'indicateur principal de chaque catégorie est utilisé pour calculer la moyenne nationale globale. Chaque pays peut " +
      "être comparé à la moyenne mondiale ou à des pays dans une phase donnée.",
    spiderGraphTitle: "Aperçu des phases",
    lineChartTitle: "Comparaison des pays pour l'année",
  },
  regionDropDown: {
    textSelectRegion: "Choisissez une région",
  },
};
