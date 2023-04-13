<script>
import Vue from "vue";
import Papa from "papaparse";
import { object, string, array } from "yup";

let schema = object({
  "Country Name": string(),
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
  "Resources Link": array().of(
    string()
      .trim()
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        "Enter correct url!"
      )
      .required()
  ),
  "Indicator 1 Score": string().required(),
  "Enter Indicator 1 justification": string().required(),
  "Indicator 2 Score": string().required(),
  "Enter Indicator 2 justification": string().required(),
  "Indicator 2a Score": string(),
  "Enter Indicator 2a justification": string(),
  "Indicator 3 Score": string().required(),
  "Enter Indicator 3 justification": string().required(),
  "Indicator 4 Score": string().required(),
  "Enter Indicator 4 justification": string().required(),
  "Indicator 4a Score": string().required(),
  "Enter Indicator 4a justification": string().required(),
  "Indicator 5 Score": string().required(),
  "Enter Indicator 5 justification": string().required(),
  "Indicator 5a Score": string().required(),
  "Enter Indicator 5a justification": string().required(),
  "Indicator 6 Score": string().required(),
  "Enter Indicator 6 justification": string().required(),
  "Indicator 6a Score": string().required(),
  "Enter Indicator 6a justification": string().required(),
  "Indicator 7 Score": string().required(),
  "Enter Indicator 7 justification": string().required(),
  "Indicator 8 Score": string().required(),
  "Enter Indicator 8 justification": string().required(),
  "Indicator 9 Score": string().required(),
  "Enter Indicator 9 justification": string().required(),
  "Indicator 9a Score": string().required(),
  "Enter Indicator 9a justification": string().required(),
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
  "Indicator 20 Score": string().required(),
  "Enter Indicator 20 justification": string().required(),
  "Indicator 21 Score": string().required(),
  "Enter Indicator 21 justification": string().required(),
  "Indicator 21a Score": string().required(),
  "Enter Indicator 21a justification": string().required(),
  "Indicator 21b Score": string().required(),
  "Enter Indicator 21b justification": string().required(),
  "Indicator 21c Score": string().required(),
  "Enter Indicator 21c justification": string().required(),
  "Indicator 22 Score": string().required(),
  "Enter Indicator 22 justification": string().required(),
  "Indicator 23 Score": string().required(),
  "Enter Indicator 23 justification": string().required(),
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
      countryName: formCSVRow["Country Name"],
      countryAlpha2Code: "",
      summary: formCSVRow["Country Summary"],
      contactName: formCSVRow["Country Contact Name"],
      contactDesignation: formCSVRow["Country Contact Role"],
      contactOrganization: formCSVRow["Country Contact Org"],
      contactEmail: formCSVRow["Country Contact Email"],
      dataFeederName: formCSVRow["Contact Person Name"],
      dataFeederRole: formCSVRow["Contact Person Role"],
      dataFeederEmail: formCSVRow["Contact Person Email"],
      dataApproverName: formCSVRow["Data Approver Name"],
      dataApproverRole: formCSVRow["Data Approver Role"],
      dataApproverEmail: formCSVRow["Data Approver Email"],
      govtApproved: formCSVRow["Is the data approved by the government"],
      resources: formCSVRow["Resources Link"],
    },
    healthIndicators: [
      {
        categoryId: 1,
        indicatorId: 1,
        status: "",
        score: formCSVRow["Indicator 1 Score"],
        supportingText: formCSVRow["Enter Indicator 1 justification"],
      },
      {
        categoryId: 1,
        indicatorId: 2,
        status: "",
        score: formCSVRow["Indicator 1 Score"],
        supportingText: formCSVRow["Enter Indicator 1 justification"],
      },
      {
        categoryId: 1,
        indicatorId: 30,
        status: "",
        score: formCSVRow["Indicator 2a Score"],
        supportingText: formCSVRow["Enter Indicator 2a justification"],
      },
      {
        categoryId: 1,
        indicatorId: 31,
        status: "",
        score: formCSVRow["Indicator 3 Score"],
        supportingText: formCSVRow["Enter Indicator 3 justification"],
      },
      {
        categoryId: 1,
        indicatorId: 32,
        status: "",
        score: formCSVRow["Indicator 4 Score"],
        supportingText: formCSVRow["Enter Indicator 4 justification"],
      },
      {
        categoryId: 1,
        indicatorId: 33,
        status: "",
        score: formCSVRow["Indicator 4a Score"],
        supportingText: formCSVRow["Enter Indicator 4a justification"],
      },
      {
        categoryId: 2,
        indicatorId: 3,
        status: "",
        score: formCSVRow["Indicator 5 Score"],
        supportingText: formCSVRow["Enter Indicator 5 justification"],
      },
      {
        categoryId: 2,
        indicatorId: 37,
        status: "",
        score: formCSVRow["Indicator 5a Score"],
        supportingText: formCSVRow["Enter Indicator 5a justification"],
      },
      {
        categoryId: 2,
        indicatorId: 4,
        status: "",
        score: formCSVRow["Indicator 6 Score"],
        supportingText: formCSVRow["Enter Indicator 6 justification"],
      },
      {
        categoryId: 2,
        indicatorId: 38,
        status: "",
        score: formCSVRow["Indicator 6a Score"],
        supportingText: formCSVRow["Enter Indicator 6a justification"],
      },
      {
        categoryId: 3,
        indicatorId: 5,
        status: "",
        score: formCSVRow["Indicator 7 Score"],
        supportingText: formCSVRow["Enter Indicator 7 justification"],
      },
      {
        categoryId: 3,
        indicatorId: 6,
        status: "",
        score: formCSVRow["Indicator 8 Score"],
        supportingText: formCSVRow["Enter Indicator 8 justification"],
      },
      {
        categoryId: 3,
        indicatorId: 7,
        status: "",
        score: formCSVRow["Indicator 9 Score"],
        supportingText: formCSVRow["Enter Indicator 9 justification"],
      },
      {
        categoryId: 3,
        indicatorId: 36,
        status: "",
        score: formCSVRow["Indicator 9a Score"],
        supportingText: formCSVRow["Enter Indicator 9a justification"],
      },
      {
        categoryId: 3,
        indicatorId: 8,
        status: "",
        score: formCSVRow["Indicator 10 Score"],
        supportingText: formCSVRow["Enter Indicator 10 justification"],
      },
      {
        categoryId: 4,
        indicatorId: 9,
        status: "",
        score: formCSVRow["Indicator 11 Score"],
        supportingText: formCSVRow["Enter Indicator 11 justification"],
      },
      {
        categoryId: 4,
        indicatorId: 10,
        status: "",
        score: formCSVRow["Indicator 12 Score"],
        supportingText: formCSVRow["Enter Indicator 12 justification"],
      },
      {
        categoryId: 4,
        indicatorId: 11,
        status: "",
        score: formCSVRow["Indicator 13 Score"],
        supportingText: formCSVRow["Enter Indicator 13 justification"],
      },
      {
        categoryId: 4,
        indicatorId: 12,
        status: "",
        score: formCSVRow["Indicator 14 Score"],
        supportingText: formCSVRow["Enter Indicator 14 justification"],
      },
      {
        categoryId: 5,
        indicatorId: 13,
        status: "",
        score: formCSVRow["Indicator 15 Score"],
        supportingText: formCSVRow["Enter Indicator 15 justification"],
      },
      {
        categoryId: 5,
        indicatorId: 14,
        status: "",
        score: formCSVRow["Indicator 16 Score"],
        supportingText: formCSVRow["Enter Indicator 16 justification"],
      },
      {
        categoryId: 6,
        indicatorId: 15,
        status: "",
        score: formCSVRow["Indicator 17 Score"],
        supportingText: formCSVRow["Enter Indicator 17 justification"],
      },
      {
        categoryId: 6,
        indicatorId: 16,
        status: "",
        score: formCSVRow["Indicator 18 Score"],
        supportingText: formCSVRow["Enter Indicator 18 justification"],
      },
      {
        categoryId: 7,
        indicatorId: 17,
        status: "",
        score: formCSVRow["Indicator 19 Score"],
        supportingText: formCSVRow["Enter Indicator 19 justification"],
      },
      {
        categoryId: 7,
        indicatorId: 18,
        status: "",
        score: formCSVRow["Indicator 20 Score"],
        supportingText: formCSVRow["Enter Indicator 20 justification"],
      },
      {
        categoryId: 7,
        indicatorId: 19,
        status: "",
        score: formCSVRow["Indicator 21 Score"],
        supportingText: formCSVRow["Enter Indicator 21 justification"],
      },
      {
        categoryId: 7,
        indicatorId: 27,
        status: "",
        score: formCSVRow["Indicator 21a Score"],
        supportingText: formCSVRow["Enter Indicator 21a justification"],
      },
      {
        categoryId: 7,
        indicatorId: 28,
        status: "",
        score: formCSVRow["Indicator 21b Score"],
        supportingText: formCSVRow["Enter Indicator 21b justification"],
      },
      {
        categoryId: 7,
        indicatorId: 29,
        status: "",
        score: formCSVRow["Indicator 21c Score"],
        supportingText: formCSVRow["Enter Indicator 21c justification"],
      },
      {
        categoryId: 7,
        indicatorId: 34,
        status: "",
        score: formCSVRow["Indicator 22 Score"],
        supportingText: formCSVRow["Enter Indicator 22 justification"],
      },
      {
        categoryId: 7,
        indicatorId: 35,
        status: "",
        score: formCSVRow["Indicator 23 Score"],
        supportingText: formCSVRow["Enter Indicator 23 justification"],
      },
    ],
  };
  console.log(targetObject);
  return targetObject;
};
export default Vue.extend({
  data() {
    return {
      wrongData: false,
    };
  },
  created() {
    this.wrongData = false;
  },
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
              if (data[i]["Resources Link"]) {
                data[i]["Resources Link"] =
                  data[i]["Resources Link"].split(",");
              }
              console.log(data[i]);
              self
                .validateFields(data[i])
                .then((response) => {
                  console.log("Success");
                  mapCSVToSchemaFields(data[i]);
                  console.log(response);
                })
                .catch((response) => {
                  self.wrongData = true;
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
      <p v-if="wrongData">There is something wrong with csv data</p>
    </fieldset>
  </div>
</template>
