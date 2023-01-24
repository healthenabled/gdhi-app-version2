<script>
import Vue from "vue";
import common from "../../common/common";

export default Vue.extend({
  data() {
    return {
      errorMessage: "Page Not Found!.",
    };
  },
  mounted() {
    common.hideLoading();
  },
  name: "ErrorComp",
});
</script>

<template>
  <div class="content-centered">
    <div class="errorMessage page-title text-center error-info">
      {{ errorMessage }} Please click <a href="/" class="link-blue">here</a> to
      go to Homepage
    </div>
  </div>
</template>
