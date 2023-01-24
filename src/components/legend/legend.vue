<script>
import Vue from "vue";
import colors from "../common/color-codes.js";

export default Vue.extend({
  data() {
    this.object = {
      scoreToColor: colors.getColorCodes(),
    };
    return this.object;
  },
  name: "MapLegend",
});
</script>

<template>
  <ul id="v-for-object" class="legend">
    <li class="legend-desc">{{ $t("mixed.phase") }}</li>
    <li
      class="l-box"
      v-for="value in object.scoreToColor"
      :id="'phase' + value.score"
      :title="value.description"
    >
      {{ value.score }}
    </li>
  </ul>
</template>
