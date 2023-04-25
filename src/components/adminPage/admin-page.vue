<template>
  <div dir="ltr" class="content-centered admin-page">
    <div class="clearfix box">
      <defaultYearSelector />
    </div>
    <div class="clearfix box">
      <div class="header-bold">Generate URL</div>
      <GenerateUrl></GenerateUrl>
    </div>
    <div class="clearfix box">
      <AdminViewFormDetails></AdminViewFormDetails>
    </div>
    <div class="clearfix box">
      <UploadCsv></UploadCsv>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

import GenerateUrl from "../generateUrl/generate-url.vue";
import AdminViewFormDetails from "../adminViewFormDetails/admin-view-form-details.vue";
import defaultYearSelector from "../defaultYearSelector/default-year-selector.vue";
import UploadCsv from "../uploadCSV/upload-csv.vue";

export default Vue.extend({
  name: "AdminPage",
  components: {
    GenerateUrl,
    AdminViewFormDetails,
    defaultYearSelector,
    UploadCsv,
  },
});
</script>
