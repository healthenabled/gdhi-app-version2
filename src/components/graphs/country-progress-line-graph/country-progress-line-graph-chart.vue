<template>
  <div class="line-chart-container">
    <canvas id="line-chart"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import Vue from "vue";
import { i18n, LayoutDirectionConfig } from "../../../plugins/i18n";

let lineChartInstance = null;
export default Vue.extend({
  name: "CountryProgressLineGraphChart",
  props: {
    yearOnYearData: { type: Array, required: true },
    currentYear: { type: String, required: true },
    categoryFilter: { type: Number, required: true },
    locale: { type: String, required: true },
    xAxisLabels: { type: Array, required: true },
    countryName: { type: String, required: true },
    displayText: {
      type: String,
      required: false,
    },
    regionName: { type: String, required: false, default: "" },
  },

  computed: {
    chartMetaData() {
      return {
        yearOnYearData: this.yearOnYearData,
        currentYear: this.currentYear,
        categoryFilter: this.categoryFilter,
        locale: this.locale,
        xAxisLabels: this.xAxisLabels,
        countryName: this.countryName,
        averageText: this.averageText,
      };
    },
    averageText() {
      return this.displayText || this.regionName == ""
        ? i18n.t("countryProfile.countryProgressLineChart.globalAverage")
        : this.regionName + " " + i18n.t("countryProfile.benchmark.average");
    },
    countryData() {
      let val = [];
      let yearPhaseMap = new Map();
      this.yearOnYearData.map(({ data, year }) => {
        if (this.categoryFilter < 0 && data.country.categories.length) {
          if (data.country.countryPhase > 0)
            yearPhaseMap.set(year, data.country.countryPhase);
          else if (data.country.countryPhase === -1) {
            yearPhaseMap.set(year, 0);
          }
        } else if (data.country.categories.length) {
          const categoryPhaseValue =
            data.country.categories[this.categoryFilter].phase;
          if (categoryPhaseValue >= 0)
            yearPhaseMap.set(year, categoryPhaseValue);
          else if (categoryPhaseValue === -1) {
            yearPhaseMap.set(year, 0);
          }
        }
      });
      this.xAxisLabels.map((label) => {
        if (yearPhaseMap.has(label)) {
          val.push(yearPhaseMap.get(label));
        } else {
          val.push(null);
        }
      });
      return val;
    },

    globalData() {
      let val = [];
      let yearPhaseMap = new Map();
      this.yearOnYearData.map(({ data, year }) => {
        if (data.average.overAllScore === -1) yearPhaseMap.set(year, 0);
        else {
          yearPhaseMap.set(year, data.average.overAllScore);
        }
      });
      this.xAxisLabels.map((label) => {
        if (yearPhaseMap.has(label)) {
          val.push(yearPhaseMap.get(label));
        } else {
          val.push(null);
        }
      });
      return val;
    },

    lineChartData() {
      return {
        labels: this.xAxisLabels,
        datasets: [
          {
            label: this.countryName,
            data: this.countryData,
            fill: false,
            borderColor: "black",
            spanGaps: true,
            pointBorderColor: "transparent",
            pointStyle: "rectRot",
            borderWidth: 1.5,
            pointRadius: 14,
            pointHoverRadius: 16,
            pointBackgroundColor: ({ parsed: { y } }) => {
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
          {
            label: this.averageText,
            data: this.globalData,
            fill: false,
            borderColor: "#6C757D",
            tension: 0.1,
            borderDash: [5, 4],
            borderWidth: 1.5,
            pointStyle: "circle",
            pointBackgroundColor: "black",
            pointRadius: 1,
            pointHoverRadius: 8,
            spanGaps: true,
          },
        ],
      };
    },

    lineChartOptions() {
      const self = this;
      let pluginTooltipOptions = {
        rtl: LayoutDirectionConfig[i18n.locale] === "rtl",
      };
      let pluginLegendOptions = {
        rtl: LayoutDirectionConfig[i18n.locale] === "rtl",
        position: "bottom",
        labels: {
          boxHeight: 0,
        },
      };
      let pluginAnnotationOptions = {
        annotations: {
          line: {
            type: "line",
            xMin: this.currentYear,
            xMax: this.currentYear,
            borderColor: "#415BA3",
            borderWidth: 1.5,
            borderDash: [20, 16],
            drawTime: "beforeDatasetsDraw",
          },
        },
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
          width: 1,
        },
        position:
          LayoutDirectionConfig[i18n.locale] === "rtl" ? "right" : "left",
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          beginAtZero: false,
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
          color: "black",
        },
      };
      let scalesXOptions = {
        reverse: LayoutDirectionConfig[i18n.locale] === "rtl",
        border: {
          dash: [2, 4],
          width: 1.5,
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
          beginAtZero: true,
          stepSize: 1,
          min: 1,
          font: {
            weight: "bold",
          },
          color: "black",
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
        animation: false,
        plugins: {
          tooltip: pluginTooltipOptions,
          legend: pluginLegendOptions,
          annotation: pluginAnnotationOptions,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: scalesYOptions,
          x: scalesXOptions,
        },
      };
    },

    lineChartConfig() {
      return {
        type: "line",
        data: this.lineChartData,
        options: this.lineChartOptions,
      };
    },
  },

  mounted() {
    this.drawLineChart();
  },

  watch: {
    chartMetaData() {
      this.drawLineChart();
    },
  },

  methods: {
    drawLineChart() {
      lineChartInstance?.destroy();
      lineChartInstance = new Chart(
        document.getElementById("line-chart"),
        this.lineChartConfig
      );
    },
  },
});
</script>
<style scoped lang="scss">
.line-chart-container {
  height: 85%;
  width: 95%;
}
</style>
