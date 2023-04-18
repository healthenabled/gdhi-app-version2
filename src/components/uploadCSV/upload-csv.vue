<script>
import Vue from "vue";
import Papa from "papaparse";
import { generatePayloadFromParsedJSON, validateFields } from "./uploadUtils";
import common from "../../common/common";

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
      questionnairePayload: [],
    };
  },

  methods: {
    uploadFile(event) {
      common.showLoading();
      const self = this;
      const files = event.target.files;
      this.selectedFile = event.target.files[0].name;
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
                validateFields(data[i])
                  .then((response) => {
                    console.log("Success");
                    self.payload.push(generatePayloadFromParsedJSON(data[i]));
                    self.validationStatus = status.VALID;
                    console.log(generatePayloadFromParsedJSON(data[i]));
                    console.log(response);
                  })
                  .catch((error) => {
                    self.description =
                      "On row " + (i + 1) + " " + error.toString();
                    self.validationStatus = status.INVALID;
                    console.log(error);
                  })
                  .finally(() => {
                    common.hideLoading();
                  });
              }
            }
          },
        });
      }
    },
  },
  name: "UploadCSV",
});
</script>

<template>
  <div>
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
      >
        Import to server
      </button>
      <button class="btn btn-primary">Sample CSV</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "upload-csv";
</style>
