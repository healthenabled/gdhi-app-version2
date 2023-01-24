<template>
  <div class="footer">
    <div class="footer-width">
      <span>
        <span class="ft-element sub-header">
          <router-link :to="{ path: '/methodology' }" class="text-underline"
            >{{ $t("methodology.text") }}
          </router-link>
          <span class="ft-element-pipe"> | </span>
        </span>
        <span class="ft-element sub-header">
          <router-link :to="{ path: '/indicators_info' }" class="text-underline"
            >{{ $t("headers.indicators") }}
          </router-link>
        </span>
      </span>
      <span class="ft-element float-right contact">
        <span class="">{{ $t("footer.contactEmail") }}</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
};
</script>
