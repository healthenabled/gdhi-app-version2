<template>
  <div class="footer">
    <div class="footer-width">
      <span>
        <span class="ft-element sub-header contact">
          <span class="">{{ $t("footer.contactEmail") }}</span>
        </span>
      </span>
      <span class="ft-element float-right">
        <router-view name="languageSelect"></router-view>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
};
</script>
