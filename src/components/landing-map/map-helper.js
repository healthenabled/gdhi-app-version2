import colors from "../common/color-codes.js";

export default {
  getColorCodeFor(score) {
    const colorCodes = colors.getColorCodes();
    const scoreValue =
      score === null || score === undefined ? "NA" : score.toString();
    const colorHashArray = colorCodes.filter(
      (colorVal) => colorVal.score === scoreValue
    );
    return colorHashArray.length !== 0 ? colorHashArray[0].color : "#606060";
  },
  getColorCodeOf(country, countryIndices) {
    const matchedCountry = this.getMatchedCountry(country, countryIndices);
    return matchedCountry ? matchedCountry.colorCode : "#606060";
  },
  getMatchedCountry(countryCode, countryIndices) {
    const matchedCountry = countryIndices.filter(
      (countryObj) => countryObj.countryId === countryCode
    );
    return matchedCountry && matchedCountry.length > 0
      ? matchedCountry[0]
      : null;
  },
};
