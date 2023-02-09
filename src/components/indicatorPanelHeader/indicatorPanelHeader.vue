<script>
import Vue from "vue";
import MapLegend from "../legend/legend.vue";

export default Vue.extend({
  props: {
    showCountryDetail: {
      type: Boolean,
      default() {
        return true;
      },
    },
    countryName: {
      type: String,
      default() {
        return "";
      },
    },
    indicatorPanelTitle: {
      type: String,
      default() {
        return "";
      },
    },
    phaseTitle: {
      type: String,
      default() {
        return "";
      },
    },
    indicatorDescription: {
      type: String,
      default() {
        return "";
      },
    }
  },
    components: {
    MapLegend,
  },
  name: "IndicatorPanelHeader",
});
</script>

<template>
   <div class="indicatorPanelHeader">
    <div v-if="!showCountryDetail">
      <p>{{ indicatorPanelTitle }}</p>
      <p>{{ phaseTitle }}</p>
      <p>{{$t (indicatorDescription) }}</p>
    </div>
    <div v-else>
      {{ countryName }}
    </div>
    <MapLegend></MapLegend>
   </div> 
</template>
<style>
.indicatorPanelHeader {
    display: flex;
    flex-direction: row;
    height: 100px;
    width: 100%;
    background-color: #6C757D;
}
</style>