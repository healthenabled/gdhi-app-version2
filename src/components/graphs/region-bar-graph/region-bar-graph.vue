<template>
  <div class="graph">
    <div class="graph-container2">
      <div class="graph-container" :style="cssProps">
        <canvas id="bar-graph"></canvas>
      </div>
    </div>
    <canvas id="axis-Test" height="550" width="0"></canvas>
  </div>
</template>
<script>
import Chart from "chart.js/auto";
import Vue from "vue";
import common from "../../../common/common";
import { i18n, LayoutDirectionConfig } from "../../../plugins/i18n";

let barGraphInstance = null;
export default Vue.extend({
  props: {
    labels: {
      type: Array,
      required: true,
    },
    defaultYearData: {
      type: Map,
      required: true,
    },
    selectedYearData: {
      type: Map,
      required: true,
    },
    categoryFilter: {
      type: Number,
      required: true,
    },
  },
  computed: {
    cssProps() {
      let multiplier = this.labels.length <= 5 ? 0.5 : 140;
      return {
        "--width": 1500 + this.labels.length * multiplier + "px",
        // "--width": this.labels.length * 250 + "px",
        "--height": 550 + "px",
      };
    },
    barMetaData() {
      return {
        labels: this.labels,
        defaultYearData: this.defaultYearData,
        selectedYearData: this.selectedYearData,
        categoryFilter: this.categoryFilter,
      };
    },
    defaultYearCountriesData() {
      let val = [];
      this.labels.map((country) => {
        if (this.defaultYearData.get(country)) {
          if (this.isOverallIndicatorSelected(this.categoryFilter)) {
            val.push(this.defaultYearData.get(country).countryPhase);
          } else {
            val.push(
              this.defaultYearData.get(country).categories[this.categoryFilter]
                .phase
            );
          }
        } else {
          val.push(0);
        }
      });
      return val;
    },
    selectedYearCountriesData() {
      let val = [];
      this.labels.map((country) => {
        if (this.selectedYearData.get(country)) {
          if (this.isOverallIndicatorSelected(this.categoryFilter)) {
            val.push(this.selectedYearData.get(country).countryPhase);
          } else {
            val.push(
              this.selectedYearData.get(country).categories[this.categoryFilter]
                .phase
            );
          }
        } else {
          val.push(0);
        }
      });
      return val;
    },
    barGraphData() {
      return {
        labels: this.labels,
        datasets: [
          {
            barPercentage: 1,
            categoryPercentage: 0.5,
            label: i18n.t("regionalOverview.selectedYear"),
            data: this.selectedYearCountriesData,
            barThickness: 40,
            backgroundColor: "#CED4DA",
          },
          {
            barPercentage: 1,
            categoryPercentage: 0.5,
            label: i18n.t("regionalOverview.defaultYear"),
            data: this.defaultYearCountriesData,
            barThickness: 40,
            backgroundColor: ({ parsed: { y } }) => {
              const phaseToColorMap = {
                1: "#FCAB9C",
                2: "#FFCA82",
                3: "#FFE180",
                4: "#80E1CC",
                5: "#01C975",
                0: "#e9ecef",
              };
              return phaseToColorMap[y];
            },
          },
        ],
      };
    },
    barGraphOptions() {
      const self = this;
      let pluginTooltipOptions = {
        rtl: LayoutDirectionConfig[i18n.locale] === "rtl",
      };
      let scalesYOptions = {
        grid: {
          lineWidth: 1,
          tickLength: 16,
          tickColor: "white",
          drawTicks: true,
        },
        border: {
          dash: [2, 2],
          color: "#ced4da",
          width: 0,
        },
        position:
          LayoutDirectionConfig[i18n.locale] === "rtl" ? "right" : "left",
        min: 0,
        max: 5,
        ticks: {
          callback: function (value) {
            const labels = [
              "",
              `${self.$i18n.t("mixed.phase")} 1`,
              `${self.$i18n.t("mixed.phase")} 2`,
              `${self.$i18n.t("mixed.phase")} 3`,
              `${self.$i18n.t("mixed.phase")} 4`,
              `${self.$i18n.t("mixed.phase")} 5`,
            ];
            return labels[value];
          },
          color: "#0A0A0A",
          font: {
            weight: 400,
            size: 16,
          },
        },
      };
      let scalesXOptions = {
        reverse: LayoutDirectionConfig[i18n.locale] === "rtl",
        border: {
          dash: [2, 4],
          width: 1,
          color: "#ced4da",
        },
        grid: {
          display: true,
          tickWidth: 1.5,
          tickLength: 16,
          tickColor: "white",
          drawTicks: true,
          lineWidth: 0,
        },
        ticks: {
          font: {
            weight: 400,
            size: 16,
            lineHeight: "16.94px",
          },
          color: "#0A0A0A",
        },
      };
      return {
        clip: false,
        layout: {
          padding: {
            left: 60,
            right: 80,
            top: 60,
            bottom: 0,
          },
        },
        animation: {
          onComplete: function () {
            var sourceCanvas = barGraphInstance.canvas;
            var scale = window.devicePixelRatio;
            var copyWidth = barGraphInstance.scales["y"].width - 10;
            var copyHeight =
              barGraphInstance.scales["y"].height +
              barGraphInstance.scales["y"].top +
              10;

            var targetCtx = document
              .getElementById("axis-Test")
              .getContext("2d");

            targetCtx.scale(scale, scale);
            targetCtx.canvas.width = copyWidth * scale;
            targetCtx.canvas.height = copyHeight * scale;

            targetCtx.canvas.style.width = `${copyWidth}px`;
            targetCtx.canvas.style.height = `${copyHeight}px`;
            targetCtx.drawImage(
              sourceCanvas,
              0,
              0,
              copyWidth * scale,
              copyHeight * scale,
              0,
              0,
              copyWidth * scale,
              copyHeight * scale
            );

            var sourceCtx = sourceCanvas.getContext("2d");

            sourceCtx.clearRect(0, 0, copyWidth * scale, copyHeight * scale);
          },
        },
        onProgress: function () {
          // if (rectangleSet === true) {
          var copyWidth = barGraphInstance.scales["y"].width;
          var copyHeight =
            barGraphInstance.scales["y"].height +
            barGraphInstance.scales["y"].top +
            10;

          var sourceCtx = barGraphInstance.chart.canvas.getContext("2d");
          sourceCtx.clearRect(0, 0, copyWidth, copyHeight);
          // }
        },
        plugins: {
          tooltip: pluginTooltipOptions,
          legend: {
            display: false,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: scalesYOptions,
          x: scalesXOptions,
        },
      };
    },
    barGraphConfig() {
      return {
        type: "bar",
        data: this.barGraphData,
        options: this.barGraphOptions,
      };
    },
  },
  mounted() {
    common.hideLoading();
    this.drawBarGraph();
  },
  watch: {
    barMetaData() {
      this.drawBarGraph();
    },
  },
  methods: {
    drawBarGraph() {
      barGraphInstance?.destroy();
      barGraphInstance = new Chart(
        document.getElementById("bar-graph"),
        this.barGraphConfig
      );
      console.log(barGraphInstance);
    },
    isOverallIndicatorSelected(categoryFilter) {
      if (categoryFilter === -1 || categoryFilter === null) {
        return true;
      }
      return false;
    },
  },
});
</script>

<style scoped lang="scss">
@import "region-bar-graph";
</style>
