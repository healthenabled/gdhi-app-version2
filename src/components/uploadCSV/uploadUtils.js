import { object, string, number, boolean } from "yup";

const csvDataMap = {
  CountryName: "Country Name",
  CountrySummary: "Country Summary",
  CountryContactName: "Country Contact Name",
  CountryContactRole: "Country Contact Role",
  CountryContactOrg: "Country Contact Org",
  CountryContactEmail: "Country Contact Email",
  ContactPersonName: "Contact Person Name",
  ContactPersonRole: "Contact Person Role",
  ContactPersonEmail: "Contact Person Email",
  IsTheDataApprovedByTheGovernment: "Is the data approved by the government",
  DataApproverName: "Data Approver Name",
  DataApproverRole: "Data Approver Role",
  DataApproverEmail: "Data Approver Email",
  ResourcesLink: "Resources Link",
  Indicator1Score: "Indicator 1 Score",
  EnterIndicator1Justification: "Enter Indicator 1 justification",
  Indicator2Score: "Indicator 2 Score",
  EnterIndicator2Justification: "Enter Indicator 2 justification",
  Indicator2aScore: "Indicator 2a Score",
  EnterIndicator2aJustification: "Enter Indicator 2a justification",
  Indicator3Score: "Indicator 3 Score",
  EnterIndicator3Justification: "Enter Indicator 3 justification",
  Indicator4Score: "Indicator 4 Score",
  EnterIndicator4Justification: "Enter Indicator 4 justification",
  Indicator4aScore: "Indicator 4a Score",
  EnterIndicator4aJustification: "Enter Indicator 4a justification",
  Indicator5Score: "Indicator 5 Score",
  EnterIndicator5Justification: "Enter Indicator 5 justification",
  Indicator5aScore: "Indicator 5a Score",
  EnterIndicator5aJustification: "Enter Indicator 5a justification",
  Indicator6Score: "Indicator 6 Score",
  EnterIndicator6Justification: "Enter Indicator 6 justification",
  Indicator6aScore: "Indicator 6a Score",
  EnterIndicator6aJustification: "Enter Indicator 6a justification",
  Indicator7Score: "Indicator 7 Score",
  EnterIndicator7Justification: "Enter Indicator 7 justification",
  Indicator8Score: "Indicator 8 Score",
  EnterIndicator8Justification: "Enter Indicator 8 justification",
  Indicator9Score: "Indicator 9 Score",
  EnterIndicator9Justification: "Enter Indicator 9 justification",
  Indicator9aScore: "Indicator 9a Score",
  EnterIndicator9aJustification: "Enter Indicator 9a justification",
  Indicator10Score: "Indicator 10 Score",
  EnterIndicator10Justification: "Enter Indicator 10 justification",
  Indicator11Score: "Indicator 11 Score",
  EnterIndicator11Justification: "Enter Indicator 11 justification",
  Indicator12Score: "Indicator 12 Score",
  EnterIndicator12Justification: "Enter Indicator 12 justification",
  Indicator13Score: "Indicator 13 Score",
  EnterIndicator13Justification: "Enter Indicator 13 justification",
  Indicator14Score: "Indicator 14 Score",
  EnterIndicator14Justification: "Enter Indicator 14 justification",
  Indicator15Score: "Indicator 15 Score",
  EnterIndicator15Justification: "Enter Indicator 15 justification",
  Indicator16Score: "Indicator 16 Score",
  EnterIndicator16Justification: "Enter Indicator 16 justification",
  Indicator17Score: "Indicator 17 Score",
  EnterIndicator17Justification: "Enter Indicator 17 justification",
  Indicator18Score: "Indicator 18 Score",
  EnterIndicator18Justification: "Enter Indicator 18 justification",
  Indicator19Score: "Indicator 19 Score",
  EnterIndicator19Justification: "Enter Indicator 19 justification",
  Indicator20Score: "Indicator 20 Score",
  EnterIndicator20Justification: "Enter Indicator 20 justification",
  Indicator21Score: "Indicator 21 Score",
  EnterIndicator21Justification: "Enter Indicator 21 justification",
  Indicator21aScore: "Indicator 21a Score",
  EnterIndicator21aJustification: "Enter Indicator 21a justification",
  Indicator21bScore: "Indicator 21b Score",
  EnterIndicator21bJustification: "Enter Indicator 21b justification",
  Indicator21cScore: "Indicator 21c Score",
  EnterIndicator21cJustification: "Enter Indicator 21c justification",
  Indicator22Score: "Indicator 22 Score",
  EnterIndicator22Justification: "Enter Indicator 22 justification",
  Indicator23Score: "Indicator 23 Score",
  EnterIndicator23Justification: "Enter Indicator 23 justification",
};

export const generatePayloadFromParsedJSON = (formCSVRow) => ({
  countryId: "",
  currentYear: "",
  dataAvailableForYear: "",
  status: "",
  updatedDate: "",
  countrySummary: {
    countryId: "",
    countryName: formCSVRow[csvDataMap.CountryName],
    countryAlpha2Code: "",
    summary: formCSVRow[csvDataMap.CountrySummary],
    contactName: formCSVRow[csvDataMap.CountryContactName],
    contactDesignation: formCSVRow[csvDataMap.CountryContactRole],
    contactOrganization: formCSVRow[csvDataMap.CountryContactOrg],
    contactEmail: formCSVRow[csvDataMap.CountryContactEmail],
    dataFeederName: formCSVRow[csvDataMap.ContactPersonName],
    dataFeederRole: formCSVRow[csvDataMap.ContactPersonRole],
    dataFeederEmail: formCSVRow[csvDataMap.ContactPersonEmail],
    dataApproverName: formCSVRow[csvDataMap.DataApproverName],
    dataApproverRole: formCSVRow[csvDataMap.DataApproverRole],
    dataApproverEmail: formCSVRow[csvDataMap.DataApproverEmail],
    govtApproved: formCSVRow[csvDataMap.IsTheDataApprovedByTheGovernment],
    resources: formCSVRow[csvDataMap.ResourcesLink]
      .split(",")
      .map(function (resourceLink) {
        return resourceLink.trim();
      }),
  },
  healthIndicators: [
    {
      categoryId: 1,
      indicatorId: 1,
      status: "",
      score: formCSVRow[csvDataMap.Indicator1Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator1Justification],
    },
    {
      categoryId: 1,
      indicatorId: 2,
      status: "",
      score: formCSVRow[csvDataMap.Indicator2Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator2Justification],
    },
    {
      categoryId: 1,
      indicatorId: 30,
      status: "",
      score: formCSVRow[csvDataMap.Indicator2aScore],
      supportingText: formCSVRow[csvDataMap.EnterIndicator2aJustification],
    },
    {
      categoryId: 1,
      indicatorId: 31,
      status: "",
      score: formCSVRow[csvDataMap.Indicator3Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator3Justification],
    },
    {
      categoryId: 1,
      indicatorId: 32,
      status: "",
      score: formCSVRow[csvDataMap.Indicator4Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator4Justification],
    },
    {
      categoryId: 1,
      indicatorId: 33,
      status: "",
      score: formCSVRow[csvDataMap.Indicator4aScore],
      supportingText: formCSVRow[csvDataMap.EnterIndicator4aJustification],
    },
    {
      categoryId: 2,
      indicatorId: 3,
      status: "",
      score: formCSVRow[csvDataMap.Indicator5Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator5Justification],
    },
    {
      categoryId: 2,
      indicatorId: 37,
      status: "",
      score: formCSVRow[csvDataMap.Indicator5aScore],
      supportingText: formCSVRow[csvDataMap.EnterIndicator5aJustification],
    },
    {
      categoryId: 2,
      indicatorId: 4,
      status: "",
      score: formCSVRow[csvDataMap.Indicator6Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator6Justification],
    },
    {
      categoryId: 2,
      indicatorId: 38,
      status: "",
      score: formCSVRow[csvDataMap.Indicator6aScore],
      supportingText: formCSVRow[csvDataMap.EnterIndicator6aJustification],
    },
    {
      categoryId: 3,
      indicatorId: 5,
      status: "",
      score: formCSVRow[csvDataMap.Indicator7Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator7Justification],
    },
    {
      categoryId: 3,
      indicatorId: 6,
      status: "",
      score: formCSVRow[csvDataMap.Indicator8Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator8Justification],
    },
    {
      categoryId: 3,
      indicatorId: 7,
      status: "",
      score: formCSVRow[csvDataMap.Indicator9Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator9Justification],
    },
    {
      categoryId: 3,
      indicatorId: 36,
      status: "",
      score: formCSVRow[csvDataMap.Indicator9aScore],
      supportingText: formCSVRow[csvDataMap.EnterIndicator9aJustification],
    },
    {
      categoryId: 3,
      indicatorId: 8,
      status: "",
      score: formCSVRow[csvDataMap.Indicator10Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator10Justification],
    },
    {
      categoryId: 4,
      indicatorId: 9,
      status: "",
      score: formCSVRow[csvDataMap.Indicator11Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator11Justification],
    },
    {
      categoryId: 4,
      indicatorId: 10,
      status: "",
      score: formCSVRow[csvDataMap.Indicator12Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator12Justification],
    },
    {
      categoryId: 4,
      indicatorId: 11,
      status: "",
      score: formCSVRow[csvDataMap.Indicator13Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator13Justification],
    },
    {
      categoryId: 4,
      indicatorId: 12,
      status: "",
      score: formCSVRow[csvDataMap.Indicator14Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator14Justification],
    },
    {
      categoryId: 5,
      indicatorId: 13,
      status: "",
      score: formCSVRow[csvDataMap.Indicator15Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator15Justification],
    },
    {
      categoryId: 5,
      indicatorId: 14,
      status: "",
      score: formCSVRow[csvDataMap.Indicator16Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator16Justification],
    },
    {
      categoryId: 6,
      indicatorId: 15,
      status: "",
      score: formCSVRow[csvDataMap.Indicator17Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator17Justification],
    },
    {
      categoryId: 6,
      indicatorId: 16,
      status: "",
      score: formCSVRow[csvDataMap.Indicator18Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator18Justification],
    },
    {
      categoryId: 7,
      indicatorId: 17,
      status: "",
      score: formCSVRow[csvDataMap.Indicator19Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator19Justification],
    },
    {
      categoryId: 7,
      indicatorId: 18,
      status: "",
      score: formCSVRow[csvDataMap.Indicator20Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator20Justification],
    },
    {
      categoryId: 7,
      indicatorId: 19,
      status: "",
      score: formCSVRow[csvDataMap.Indicator21Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator21Justification],
    },
    {
      categoryId: 7,
      indicatorId: 27,
      status: "",
      score: formCSVRow[csvDataMap.Indicator21aScore],
      supportingText: formCSVRow[csvDataMap.EnterIndicator21aJustification],
    },
    {
      categoryId: 7,
      indicatorId: 28,
      status: "",
      score: formCSVRow[csvDataMap.Indicator21bScore],
      supportingText: formCSVRow[csvDataMap.EnterIndicator21bJustification],
    },
    {
      categoryId: 7,
      indicatorId: 29,
      status: "",
      score: formCSVRow[csvDataMap.Indicator21cScore],
      supportingText: formCSVRow[csvDataMap.EnterIndicator21cJustification],
    },
    {
      categoryId: 7,
      indicatorId: 34,
      status: "",
      score: formCSVRow[csvDataMap.Indicator22Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator22Justification],
    },
    {
      categoryId: 7,
      indicatorId: 35,
      status: "",
      score: formCSVRow[csvDataMap.Indicator23Score],
      supportingText: formCSVRow[csvDataMap.EnterIndicator23Justification],
    },
  ],
});

export async function validateFields(data) {
  const min1Max5RequiredInteger = number()
    .required()
    .transform((originalValue) => {
      if (
        originalValue === 1 ||
        originalValue === 2 ||
        originalValue === 3 ||
        originalValue === 4 ||
        originalValue === 5
      ) {
        return Number(originalValue);
      }
      return -1;
    });
  const requiredString = string().trim().required();
  const requiredEmail = string().trim().email().required();
  const email = string().trim().email();
  const trimString = string().trim();
  return await object({
    [csvDataMap.CountryName]: requiredString,
    [csvDataMap.CountrySummary]: requiredString,
    [csvDataMap.CountryContactName]: trimString,
    [csvDataMap.CountryContactRole]: trimString,
    [csvDataMap.CountryContactOrg]: trimString,
    [csvDataMap.CountryContactEmail]: email,
    [csvDataMap.ContactPersonName]: requiredString,
    [csvDataMap.ContactPersonRole]: requiredString,
    [csvDataMap.ContactPersonEmail]: requiredEmail,
    [csvDataMap.IsTheDataApprovedByTheGovernment]: boolean(),
    [csvDataMap.DataApproverName]: string()
      .trim()
      .when([csvDataMap.IsTheDataApprovedByTheGovernment], {
        is: true,
        then: () => requiredString,
      }),
    [csvDataMap.DataApproverRole]: string()
      .trim()
      .when([csvDataMap.IsTheDataApprovedByTheGovernment], {
        is: true,
        then: () => requiredString,
      }),
    [csvDataMap.DataApproverEmail]: string()
      .trim()
      .when([csvDataMap.IsTheDataApprovedByTheGovernment], {
        is: true,
        then: () => requiredEmail,
      }),
    [csvDataMap.ResourcesLink]: string()
      .trim()
      .lowercase()
      .required()
      .test(
        "validate-csv-urls",
        (d) => `${d.value} are not valid URL's`,
        function (value) {
          let isValid = true;
          value.split(",").forEach((a) => {
            const urlPattern = new RegExp(
              "^(https?:\\/\\/)?" + // validate protocol
                "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
                "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
                "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
                "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
                "(\\#[-a-z\\d_]*)?$",
              "i"
            ); // validate fragment locator

            isValid = isValid && !!urlPattern.test(a.trim());
          });
          return isValid;
        }
      ),
    [csvDataMap.Indicator1Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator1Justification]: requiredString,
    [csvDataMap.Indicator2Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator2Justification]: requiredString,
    [csvDataMap.Indicator2aScore]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator2aJustification]: requiredString,
    [csvDataMap.Indicator3Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator3Justification]: requiredString,
    [csvDataMap.Indicator4Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator4Justification]: requiredString,
    [csvDataMap.Indicator4aScore]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator4aJustification]: requiredString,
    [csvDataMap.Indicator5Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator5Justification]: requiredString,
    [csvDataMap.Indicator5aScore]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator5aJustification]: requiredString,
    [csvDataMap.Indicator6Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator6Justification]: requiredString,
    [csvDataMap.Indicator6aScore]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator6aJustification]: requiredString,
    [csvDataMap.Indicator7Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator7Justification]: requiredString,
    [csvDataMap.Indicator8Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator8Justification]: requiredString,
    [csvDataMap.Indicator9Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator9Justification]: requiredString,
    [csvDataMap.Indicator9aScore]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator9aJustification]: requiredString,
    [csvDataMap.Indicator10Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator10Justification]: requiredString,
    [csvDataMap.Indicator11Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator11Justification]: requiredString,
    [csvDataMap.Indicator12Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator12Justification]: requiredString,
    [csvDataMap.Indicator13Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator13Justification]: requiredString,
    [csvDataMap.Indicator14Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator14Justification]: requiredString,
    [csvDataMap.Indicator15Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator15Justification]: requiredString,
    [csvDataMap.Indicator16Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator16Justification]: requiredString,
    [csvDataMap.Indicator17Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator17Justification]: requiredString,
    [csvDataMap.Indicator18Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator18Justification]: requiredString,
    [csvDataMap.Indicator19Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator19Justification]: requiredString,
    [csvDataMap.Indicator20Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator20Justification]: requiredString,
    [csvDataMap.Indicator21Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator21Justification]: requiredString,
    [csvDataMap.Indicator21aScore]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator21aJustification]: requiredString,
    [csvDataMap.Indicator21bScore]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator21bJustification]: requiredString,
    [csvDataMap.Indicator21cScore]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator21cJustification]: requiredString,
    [csvDataMap.Indicator22Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator22Justification]: requiredString,
    [csvDataMap.Indicator23Score]: min1Max5RequiredInteger,
    [csvDataMap.EnterIndicator23Justification]: requiredString,
  }).validate(data);
}
