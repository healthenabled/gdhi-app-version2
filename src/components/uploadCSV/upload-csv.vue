<script>
import Vue from "vue";
import Papa from "papaparse";
import { generatePayloadFromParsedJSON, validateFields } from "./uploadUtils";
import common from "../../common/common";
import axios from "axios";

const status = Object.freeze({
  VALID: "valid",
  INVALID: "inValid",
  DEFAULT: null,
});

export default Vue.extend({
  data() {
    return {
      selectedFile: "",
      validationStatus: status.DEFAULT,
      description: "",
      payload: [],
      status,
      countryStatuses: [],
      importedToServer: false,
    };
  },
  methods: {
    uploadFile(event) {
      common.showLoading();
      const self = this;
      const files = event.target.files;
      this.selectedFile = event.target.files[0].name;
      Papa.parse(files[0], {
        worker: true,
        header: true,
        complete: function ({ data }) {
          if (!data.length) {
            self.wrongData = true;
          } else {
            for (let i = 0; i < data.length; i++) {
              validateFields(data[i])
                .then((response) => {
                  self.payload.push(generatePayloadFromParsedJSON(response));
                  self.validationStatus = status.VALID;
                })
                .catch((error) => {
                  self.description =
                    "On row " + (i + 1) + " " + error.toString();
                  self.validationStatus = status.INVALID;
                })
                .finally(() => {
                  common.hideLoading();
                });
            }
          }
        },
      });
    },
    submitData() {
      common.showLoading();
      const url = "/api/bff/countries/submit";
      axios
        .post(url, {
          gdhiQuestionnaires: this.payload,
        })
        .then(({ data: { countryStatuses } }) => {
          this.importedToServer = true;
          this.countryStatuses = countryStatuses;
        })
        .catch(() => {
          this.message = "Error While Importing Data To Server ";
          this.notifier({
            group: "custom-template",
            title: "Error",
            text: this.message,
            type: "error",
          });
        })
        .finally(() => {
          common.hideLoading();
        });
    },
    notifier(props) {
      this.$notify({
        group: props.group,
        title: props.title,
        text: props.text,
        type: props.type,
      });
    },
  },
  name: "UploadCSV",
});
</script>

<template>
  <div>
    <div class="download-section">
      <div class="header-bold">Template</div>
      <button
        class="btn btn-primary"
        onclick="location.href = 'https://docs.google.com/spreadsheets/d/1AZ_5oYOCokiI4xosVPCZU3jSZUYjt4MB/edit?usp=sharing&ouid=105807527850921178070&rtpof=true&sd=true';"
      >
        <i class="fa fa-download" aria-hidden="true"></i>Download
      </button>
    </div>
    <div class="header-bold">Upload File</div>
    <div class="file-name-and-error">
      <p>{{ selectedFile }}</p>
      <p class="error-message" v-if="validationStatus === status.INVALID">
        {{ description }}
      </p>
    </div>
    <div class="button-section">
      <input
        type="file"
        @change="uploadFile"
        width="100"
        height="100"
        accept="text/csv"
        class="upload-file"
      />
      <button
        class="btn btn-primary"
        onclick="document.getElementsByClassName('upload-file')[0].click();"
      >
        Select File
      </button>
      <button
        class="btn btn-primary"
        :class="
          validationStatus === status.INVALID ||
          validationStatus === status.DEFAULT
            ? 'disabled '
            : ''
        "
        :disabled="
          validationStatus === status.INVALID ||
          validationStatus === status.DEFAULT
        "
        @click="submitData"
        data-testid="import-button"
      >
        Import to server
      </button>
    </div>
    <div class="header-bold" v-if="importedToServer">Import Status</div>
    <table v-if="importedToServer" class="import-status-table">
      <thead>
        <tr>
          <th>Country</th>
          <th>Success</th>
          <th>Status</th>
          <th>Failure Reason</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(countryStatus, id) in countryStatuses" :key="id">
          <td v-for="(countryDetails, id) in countryStatus" :key="id">
            {{ countryDetails }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
@import "upload-csv";
</style>
