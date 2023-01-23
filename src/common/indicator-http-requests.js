import axios from "axios";

export default {
  getGNIPerCapitaInKilo(gniPerCapita) {
    return gniPerCapita ? `${gniPerCapita / 1000}K` : "NA";
  },

  getTotalPopulationInMillion(population) {
    const populationInMillion = population
      ? Number((population / 1000000).toFixed(2))
      : null;
    return populationInMillion ? `${populationInMillion}M` : "NA";
  },

  getInPercenatge(value) {
    return value ? `${Number(value.toFixed(1))}%` : "NA";
  },

  getValue(value) {
    return !value ? "NA" : value;
  },

  getMinimalDevelopmentIndicatorsData(response) {
    let self = this;
    const developmentIndicatorsData = [
      {
        CONTEXT: {
          gniPerCapita: self.getGNIPerCapitaInKilo(response.gniPerCapita),
          totalPopulation: self.getTotalPopulationInMillion(
            response.totalPopulation
          ),
        },
      },
      {
        HEALTH: {
          lifeExpectancy: self.getValue(response.lifeExpectancy),
          healthExpenditure: self.getInPercenatge(response.healthExpenditure),
        },
      },
    ];
    return developmentIndicatorsData;
  },

  getDevelopmentIndicatorsData(response) {
    let self = this;
    const developmentIndicatorsData = [
      {
        CONTEXT: {
          gniPerCapita: self.getGNIPerCapitaInKilo(response.gniPerCapita),
          totalPopulation: self.getTotalPopulationInMillion(
            response.totalPopulation
          ),
          adultLiteracyRate: this.getInPercenatge(response.adultLiteracy),
          easeOfDoingBusinessIndex: self.getValue(response.doingBusinessIndex),
        },
      },
      {
        HEALTH: {
          lifeExpectancy: self.getValue(response.lifeExpectancy),
          healthExpenditure: self.getInPercenatge(response.healthExpenditure),
          causeOfDeath: self.getInPercenatge(response.totalNcdDeathsPerCapita),
          mortalityRate: self.getValue(response.under5Mortality),
        },
      },
    ];
    return developmentIndicatorsData;
  },

  getDevelopmentIndicators(countryId, isMinimal) {
    const developmentIndicatorsUrl = `/api/countries/${countryId}/development_indicators`;
    const self = this;
    return axios
      .get(developmentIndicatorsUrl)
      .then((response) => {
        return isMinimal
          ? self.getMinimalDevelopmentIndicatorsData(response.data)
          : self.getDevelopmentIndicatorsData(response.data);
      })
      .catch((e) => {
        return e;
      });
  },
};
