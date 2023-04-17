<script>
import Vue from "vue";
import Papa from "papaparse";
import { generatePayloadFromParsedJSON, validateFields } from "./uploadUtils";
import common from "../../common/common";

export default Vue.extend({
  data() {
    return {
      wrongData: {
        isWrong: false,
        description: "",
      },
      validData: {
        isValid: false,
        payload: null,
      },
      selectedFile: "",
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
                    self.validData.payload = generatePayloadFromParsedJSON(
                      data[i]
                    );
                    self.validData.isValid = true;
                    self.wrongData.isWrong = false;
                    console.log(response);
                  })
                  .catch((error) => {
                    self.wrongData.isWrong = true;
                    self.validData.isValid = false;
                    self.wrongData.description = error.toString();
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
      <p class="error-message" v-if="wrongData.isWrong">
        {{ wrongData.description }}
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
        :class="!validData.isValid ? 'disabled ' : ''"
        :disabled="!validData.isValid"
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
