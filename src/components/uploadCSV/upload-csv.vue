<script>
import Vue from "vue";
import Papa from "papaparse";
import { object, string, array } from "yup";

let userSchema = object({
  countrySummary: object().shape({
    countryName: string(),
    summary: string().required(),
    contactName: string(),
    contactDesignation: string(),
    contactOrganization: string(),
    contactEmail: string().email(),
    dataFeederName: string().required(),
    dataFeederRole: string().required(),
    dataFeederEmail: string().email().required(),
    dataApproverName: string(),
    dataApproverRole: string(),
    dataApproverEmail: string().email(),
    govtApproved: string(),
    resources: array().of(
      string()
        .matches(
          /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
          "Enter correct url!"
        )
        .required()
    ),
  }),
  healthIndicators: array().of(
    object().shape({
      score: string().required(),
      supportingText: string().required(),
    })
  ),
});

let schema = object({
  countryName: string(),
  "Country Summary": string().required(),
  "Country Contact Name": string(),
  "Country Contact Role": string(),
  "Country Contact Org": string(),
  "Country Contact Email": string().email(),
  "Contact Person Name": string().required(),
  "Contact Person Role": string().required(),
  "Contact Person Email": string().email().required(),
  "Is the data approved by the government": string()
    .lowercase()
    .matches(/(true|false)/),
  "Data Approver Name": string(),
  "Data Approver Role": string(),
  "Data Approver Email": string().email(),
  "Resources Link": string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "Enter correct url!"
    )
    .required(),
  "Indicator 1 Score": string().required(),
  "Enter Indicator 1 justification": string().required(),
  "Indicator 2 Score": string().required(),
  "Enter Indicator 2 justification": string().required(),
  "Indicator 2a Score": string(),
  "Enter Indicator 2a justification": string(),
  "Indicator 3 Score": string().required(),
  "Enter Indicator 3 justification": string().required(),
  "Indicator 3a Score": string().required(),
  "Enter Indicator 3a justification": string().required(),
  "Indicator 4 Score": string().required(),
  "Enter Indicator 4 justification": string().required(),
  "Indicator 4a Score": string().required(),
  "Enter Indicator 4a justification": string().required(),
  "Indicator 5 Score": string().required(),
  "Enter Indicator 5 justification": string().required(),
  // "Indicator 5a Score": string().required(),
  // "Enter Indicator 5a justification": string().required(),
  "Indicator 6 Score": string().required(),
  "Enter Indicator 6 justification": string().required(),
  // "Indicator 6a Score": string().required(),
  // "Enter Indicator 6a justification": string().required(),
  "Indicator 7 Score": string().required(),
  "Enter Indicator 7 justification": string().required(),
  "Indicator 7a Score": string().required(),
  "Enter Indicator 7a justification": string().required(),
  "Indicator 8 Score": string().required(),
  "Enter Indicator 8 justification": string().required(),
  "Indicator 9 Score": string().required(),
  "Enter Indicator 9 justification": string().required(),
  "Indicator 10 Score": string().required(),
  "Enter Indicator 10 justification": string().required(),
  "Indicator 11 Score": string().required(),
  "Enter Indicator 11 justification": string().required(),
  "Indicator 12 Score": string().required(),
  "Enter Indicator 12 justification": string().required(),
  "Indicator 13 Score": string().required(),
  "Enter Indicator 13 justification": string().required(),
  "Indicator 14 Score": string().required(),
  "Enter Indicator 14 justification": string().required(),
  "Indicator 15 Score": string().required(),
  "Enter Indicator 15 justification": string().required(),
  "Indicator 16 Score": string().required(),
  "Enter Indicator 16 justification": string().required(),
  "Indicator 17 Score": string().required(),
  "Enter Indicator 17 justification": string().required(),
  "Indicator 18 Score": string().required(),
  "Enter Indicator 18 justification": string().required(),
  "Indicator 19 Score": string().required(),
  "Enter Indicator 19 justification": string().required(),
  "Indicator 19a Score": string().required(),
  "Enter Indicator 19a justification": string().required(),
  "Indicator 19b Score": string().required(),
  "Enter Indicator 19b justification": string().required(),
  "Indicator 19c Score": string().required(),
  "Enter Indicator 19c justification": string().required(),
  "Indicator 20 Score": string().required(),
  "Enter Indicator 20 justification": string().required(),
  "Indicator 21 Score": string().required(),
  "Enter Indicator 21 justification": string().required(),
  "Indicator 22 Score": string().required(),
  "Enter Indicator 22 justification": string().required(),
  "Indicator 23 Score": string().required(),
  "Enter Indicator 23 justification": string().required(),
  "Indicator 23a Score": string().required(),
  "Enter Indicator 23a justification": string().required(),
});

const mapCSVToSchemaFields = (formCSVRow) => {
  const targetObject = {
    countryId: "",
    currentYear: "",
    dataAvailableForYear: "",
    status: "",
    updatedDate: "",
    countrySummary: {
      countryId: "",
      countryName: formCSVRow.countryName,
      countryAlpha2Code: "",
      summary: formCSVRow.summary,
      contactName: formCSVRow.contactName,
      contactDesignation: formCSVRow.contactDesignation,
      contactOrganization: formCSVRow.contactOrganization,
      contactEmail: formCSVRow.contactEmail,
      dataFeederName: formCSVRow.dataFeederName,
      dataFeederRole: formCSVRow.dataFeederRole,
      dataFeederEmail: formCSVRow.dataFeederEmail,
      dataApproverName: formCSVRow.dataApproverName,
      dataApproverRole: formCSVRow.dataApproverRole,
      dataApproverEmail: formCSVRow.dataApproverEmail,
      govtApproved: formCSVRow.govtApproved,
      resources: formCSVRow.resources.split(","),
    },
    healthIndicators: [
      {
        categoryId: 1,
        indicatorId: 1,
        status: "",
        score: formCSVRow.indicatorId1_Score,
        supportingText: formCSVRow.indicatorId1_supportingText,
      },
      {
        categoryId: 1,
        indicatorId: 2,
        status: "",
        score: formCSVRow.indicatorId2_Score,
        supportingText: formCSVRow.indicatorId2_supportingText,
      },
      {
        categoryId: 1,
        indicatorId: 30,
        status: "",
        score: formCSVRow.indicatorId30_Score,
        supportingText: formCSVRow.indicatorId30_supportingText,
      },
      {
        categoryId: 1,
        indicatorId: 31,
        status: "",
        score: formCSVRow.indicatorId31_Score,
        supportingText: formCSVRow.indicatorId31_supportingText,
      },
      {
        categoryId: 1,
        indicatorId: 32,
        status: "",
        score: formCSVRow.indicatorId32_Score,
        supportingText: formCSVRow.indicatorId32_supportingText,
      },
      {
        categoryId: 1,
        indicatorId: 33,
        status: "",
        score: formCSVRow.indicatorId33_Score,
        supportingText: formCSVRow.indicatorId33_supportingText,
      },
      {
        categoryId: 2,
        indicatorId: 3,
        status: "",
        score: formCSVRow.indicatorId3_Score,
        supportingText: formCSVRow.indicatorId3_supportingText,
      },
      {
        categoryId: 2,
        indicatorId: 37,
        status: "",
        score: formCSVRow.indicatorId37_Score,
        supportingText: formCSVRow.indicatorId37_supportingText,
      },
      {
        categoryId: 2,
        indicatorId: 4,
        status: "",
        score: formCSVRow.indicatorId4_Score,
        supportingText: formCSVRow.indicatorId4_supportingText,
      },
      {
        categoryId: 2,
        indicatorId: 38,
        status: "",
        score: formCSVRow.indicatorId38_Score,
        supportingText: formCSVRow.indicatorId38_supportingText,
      },
      {
        categoryId: 3,
        indicatorId: 5,
        status: "",
        score: formCSVRow.indicatorId5_Score,
        supportingText: formCSVRow.indicatorId5_supportingText,
      },
      {
        categoryId: 3,
        indicatorId: 6,
        status: "",
        score: formCSVRow.indicatorId6_Score,
        supportingText: formCSVRow.indicatorId6_supportingText,
      },
      {
        categoryId: 3,
        indicatorId: 7,
        status: "",
        score: formCSVRow.indicatorId7_Score,
        supportingText: formCSVRow.indicatorId7_supportingText,
      },
      {
        categoryId: 3,
        indicatorId: 36,
        status: "",
        score: formCSVRow.indicatorId36_Score,
        supportingText: formCSVRow.indicatorId36_supportingText,
      },
      {
        categoryId: 3,
        indicatorId: 8,
        status: "",
        score: formCSVRow.indicatorId8_Score,
        supportingText: formCSVRow.indicatorId8_supportingText,
      },
      {
        categoryId: 4,
        indicatorId: 9,
        status: "",
        score: formCSVRow.indicatorId9_Score,
        supportingText: formCSVRow.indicatorId9_supportingText,
      },
      {
        categoryId: 4,
        indicatorId: 10,
        status: "",
        score: formCSVRow.indicatorId10_Score,
        supportingText: formCSVRow.indicatorId10_supportingText,
      },
      {
        categoryId: 4,
        indicatorId: 11,
        status: "",
        score: formCSVRow.indicatorId11_Score,
        supportingText: formCSVRow.indicatorId11_supportingText,
      },
      {
        categoryId: 4,
        indicatorId: 12,
        status: "",
        score: formCSVRow.indicatorId12_Score,
        supportingText: formCSVRow.indicatorId12_supportingText,
      },
      {
        categoryId: 5,
        indicatorId: 13,
        status: "",
        score: formCSVRow.indicatorId13_Score,
        supportingText: formCSVRow.indicatorId13_supportingText,
      },
      {
        categoryId: 5,
        indicatorId: 14,
        status: "",
        score: formCSVRow.indicatorId14_Score,
        supportingText: formCSVRow.indicatorId14_supportingText,
      },
      {
        categoryId: 6,
        indicatorId: 15,
        status: "",
        score: formCSVRow.indicatorId15_Score,
        supportingText: formCSVRow.indicatorId15_supportingText,
      },
      {
        categoryId: 6,
        indicatorId: 16,
        status: "",
        score: formCSVRow.indicatorId16_Score,
        supportingText: formCSVRow.indicatorId16_supportingText,
      },
      {
        categoryId: 7,
        indicatorId: 17,
        status: "",
        score: formCSVRow.indicatorId17_Score,
        supportingText: formCSVRow.indicatorId17_supportingText,
      },
      {
        categoryId: 7,
        indicatorId: 18,
        status: "",
        score: formCSVRow.indicatorId18_Score,
        supportingText: formCSVRow.indicatorId18_supportingText,
      },
      {
        categoryId: 7,
        indicatorId: 19,
        status: "",
        score: formCSVRow.indicatorId19_Score,
        supportingText: formCSVRow.indicatorId19_supportingText,
      },
      {
        categoryId: 7,
        indicatorId: 27,
        status: "",
        score: formCSVRow.indicatorId27_Score,
        supportingText: formCSVRow.indicatorId27_supportingText,
      },
      {
        categoryId: 7,
        indicatorId: 28,
        status: "",
        score: formCSVRow.indicatorId28_Score,
        supportingText: formCSVRow.indicatorId28_supportingText,
      },
      {
        categoryId: 7,
        indicatorId: 29,
        status: "",
        score: formCSVRow.indicatorId29_Score,
        supportingText: formCSVRow.indicatorId29_supportingText,
      },
      {
        categoryId: 7,
        indicatorId: 34,
        status: "",
        score: formCSVRow.indicatorId34_Score,
        supportingText: formCSVRow.indicatorId34_supportingText,
      },
      {
        categoryId: 7,
        indicatorId: 35,
        status: "",
        score: formCSVRow.indicatorId35_Score,
        supportingText: formCSVRow.indicatorId35_supportingText,
      },
    ],
  };
  console.log(targetObject);
  return targetObject;
};
export default Vue.extend({
  methods: {
    uploadFile(event) {
      const self = this;
      const files = event.target.files;
      if (files.length === 1) {
        Papa.parse(files[0], {
          worker: true,
          header: true,
          complete: function ({ data, error }) {
            for (let i = 0; i < data.length; i++) {
              console.log(data[i]);

              self
                .validateFields(data[i])
                .then((response) => {
                  console.log("Success");
                  console.log(response);
                })
                .catch((response) => {
                  console.log("Error");
                  console.log(response);
                });
            }
          },
          error: function ({ error }) {
            console.log(error);
          },
        });
      }
    },
    async validateFields(data) {
      return await schema.validate(data);
    },
  },
  name: "UploadCSV",
});
</script>

<template>
  <div>
    <fieldset>
      <div class="header-bold">Upload file</div>
      <input
        type="file"
        @change="uploadFile"
        width="100"
        height="100"
        accept="text/csv"
      />
    </fieldset>
  </div>
</template>
