<template>
        <div dir ="ltr" class="content-centered admin-page">
  <div class="clearfix box">
    <div class="header-bold">Generate URL</div>
    <GenerateUrl></GenerateUrl>
  </div>
  <div class="clearfix box">
    <div class="header-bold">Form Details</div>
    <AdminViewFormDetails></AdminViewFormDetails>
  </div>
</div>

</template>

<script>
    import Vue from 'vue';

import GenerateUrl from '../generateUrl/generate-url.vue';
import AdminViewFormDetails from '../adminViewFormDetails/admin-view-form-details.vue';


export default Vue.extend({
  name:'AdminPage',
  components: { GenerateUrl, AdminViewFormDetails },
  
});

</script>