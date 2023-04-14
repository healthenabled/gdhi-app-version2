<script>
import Vue from "vue";
import Papa from "papaparse";
import { generatePayloadFromParsedJSON, validateFields } from "./uploadUtils";

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
                validateFields(data[i])
                  .then((response) => {
                    console.log("Success");
                    generatePayloadFromParsedJSON(data[i]);
                    console.log(response);
                  })
                  .catch((response) => {
                    self.wrongData = true;
                    console.log("Error", response.toString());
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
