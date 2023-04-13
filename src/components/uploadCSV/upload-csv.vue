<script>
import Vue from "vue";
import Papa from "papaparse";
import { object, string } from "yup";

const csvSchema = object({
  "Country Name": string().trim(),
  "Country Summary": string().trim().required(),
  "Country Contact Name": string().trim(),
  "Country Contact Role": string().trim(),
  "Country Contact Org": string().trim(),
  "Country Contact Email": string().trim().email(),
  "Contact Person Name": string().trim().required(),
  "Contact Person Role": string().trim().required(),
  "Contact Person Email": string().trim().email().required(),
  "Is the data approved by the government": string()
    .trim()
    .lowercase()
    .matches(/(true|false)/),
  "Data Approver Name": string().trim(),
  "Data Approver Role": string().trim(),
  "Data Approver Email": string().trim().email(),
  "Resources Link": string()
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

          isValid = isValid && !!urlPattern.test(a);
        });
        return isValid;
      }
    ),
  "Indicator 1 Score": string().trim().required(),
  "Enter Indicator 1 justification": string().trim().required(),
  "Indicator 2 Score": string().trim().required(),
  "Enter Indicator 2 justification": string().trim().required(),
  "Indicator 2a Score": string().trim(),
  "Enter Indicator 2a justification": string().trim(),
  "Indicator 3 Score": string().trim().required(),
  "Enter Indicator 3 justification": string().trim().required(),
  "Indicator 4 Score": string().trim().required(),
  "Enter Indicator 4 justification": string().trim().required(),
  "Indicator 4a Score": string().trim().required(),
  "Enter Indicator 4a justification": string().trim().required(),
  "Indicator 5 Score": string().trim().required(),
  "Enter Indicator 5 justification": string().trim().required(),
  "Indicator 5a Score": string().trim().required(),
  "Enter Indicator 5a justification": string().trim().required(),
  "Indicator 6 Score": string().trim().required(),
  "Enter Indicator 6 justification": string().trim().required(),
  "Indicator 6a Score": string().trim().required(),
  "Enter Indicator 6a justification": string().trim().required(),
  "Indicator 7 Score": string().trim().required(),
  "Enter Indicator 7 justification": string().trim().required(),
  "Indicator 8 Score": string().trim().required(),
  "Enter Indicator 8 justification": string().trim().required(),
  "Indicator 9 Score": string().trim().required(),
  "Enter Indicator 9 justification": string().trim().required(),
  "Indicator 9a Score": string().trim().required(),
  "Enter Indicator 9a justification": string().trim().required(),
  "Indicator 10 Score": string().trim().required(),
  "Enter Indicator 10 justification": string().trim().required(),
  "Indicator 11 Score": string().trim().required(),
  "Enter Indicator 11 justification": string().trim().required(),
  "Indicator 12 Score": string().trim().required(),
  "Enter Indicator 12 justification": string().trim().required(),
  "Indicator 13 Score": string().trim().required(),
  "Enter Indicator 13 justification": string().trim().required(),
  "Indicator 14 Score": string().trim().required(),
  "Enter Indicator 14 justification": string().trim().required(),
  "Indicator 15 Score": string().trim().required(),
  "Enter Indicator 15 justification": string().trim().required(),
  "Indicator 16 Score": string().trim().required(),
  "Enter Indicator 16 justification": string().trim().required(),
  "Indicator 17 Score": string().trim().required(),
  "Enter Indicator 17 justification": string().trim().required(),
  "Indicator 18 Score": string().trim().required(),
  "Enter Indicator 18 justification": string().trim().required(),
  "Indicator 19 Score": string().trim().required(),
  "Enter Indicator 19 justification": string().trim().required(),
  "Indicator 20 Score": string().trim().required(),
  "Enter Indicator 20 justification": string().trim().required(),
  "Indicator 21 Score": string().trim().required(),
  "Enter Indicator 21 justification": string().trim().required(),
  "Indicator 21a Score": string().trim().required(),
  "Enter Indicator 21a justification": string().trim().required(),
  "Indicator 21b Score": string().trim().required(),
  "Enter Indicator 21b justification": string().trim().required(),
  "Indicator 21c Score": string().trim().required(),
  "Enter Indicator 21c justification": string().trim().required(),
  "Indicator 22 Score": string().trim().required(),
  "Enter Indicator 22 justification": string().trim().required(),
  "Indicator 23 Score": string().trim().required(),
  "Enter Indicator 23 justification": string().trim().required(),
});

const generatePayloadFromParsedJSON = (formCSVRow) => {
  return {
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
      resources: formCSVRow["Resources Link"].split(","),
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
        score: formCSVRow["Indicator 2 Score"],
        supportingText: formCSVRow["Enter Indicator 2 justification"],
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
};

export default Vue.extend({
  data() {
    return {
      wrongData: false,
    };
  },

  methods: {
    uploadFile(event) {
      const self = this;
      const files = event.target.files;
      if (files.length === 1) {
        Papa.parse(files[0], {
          worker: true,
          header: true,
          complete: function (object) {
            const { data } = object;
            if (!data.length) {
              self.wrongData = true;
            } else {
              for (let i = 0; i < data.length; i++) {
                self
                  .validateFields(data[i])
                  .then((response) => {
                    console.log("Success");
                    generatePayloadFromParsedJSON(data[i]);
                    console.log(response);
                  })
                  .catch((response) => {
                    self.wrongData = true;
                    console.log("Error");
                    console.log(response);
                  });
              }
            }
          },
        });
      }
    },
    async validateFields(data) {
      return await csvSchema.validate(data);
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
