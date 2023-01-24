<template>
  <div class="full-height">
    <router-view name="header" />
    <router-view name="container" />
    <router-view name="footer" />
  </div>
</template>

<script>
export default {
  name: "Layout",
};
</script>
