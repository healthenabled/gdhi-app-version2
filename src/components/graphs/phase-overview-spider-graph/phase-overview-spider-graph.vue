<template>
  <div class="canvas-container">
    <canvas id="phase-overview-spider-graph"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import Vue from "vue";
import { i18n, LayoutDirectionConfig } from "../../../plugins/i18n";

let graphInstance = null;
export default Vue.extend({
  name: "phase-overview-spider-graph",

  props: {
    countryDataCategories: { type: Array, required: true },
    regionalDataCategories: { type: Array, required: true },
    countryName: { type: String, required: true },
  },

  data() {
    return {
      chart: null,
    };
  },

  computed: {
    chartMetaData() {
      return {
        countryDataCategories: this.countryDataCategories,
        regionalDataCategories: this.regionalDataCategories,
      };
    },
    labels() {
      let val = [];
      this.countryDataCategories.forEach((category) => {
        val.push(category.name);
      });
      return val;
    },
    countryPhaseData() {
      let val = [];
      this.countryDataCategories.forEach((category) => {
        if (Number(category.phase) >= 0) val.push(category.phase);
        else {
          val.push(0);
        }
      });
      return val;
    },
    regionalPhaseData() {
      let val = [];
      this.regionalDataCategories.forEach((category) => {
        if (Number(category.phase) >= 0) val.push(category.phase);
        else {
          val.push(0);
        }
      });
      return val;
    },
    graphConfig() {
      return {
        type: "radar",
        options: {
          elements: {
            point: {
              borderWidth: 10,
              radius: 10,
            },
          },
          scales: {
            r: {
              angleLines: {
                display: true,
              },
              grid: {
                color: "#CED4DA",
                lineWidth: 1,
              },
              suggestedMax: 5,
              suggestedMin: -1,
              alignToPixels: true,
              beginAtZero: true,
              ticks: {
                display: false,
                format: "",
                precision: 0,
              },
              pointLabels: {
                font: {
                  size: 10,
                  family: "'InterRegularN', sans-serif",
                  weight: 600,
                },
                backdropPadding: 0,
                padding: 2,
                callback: (args) => {
                  return args.replaceAll(" ", "\n");
                },
              },
            },
          },
          layout: {
            autoPadding: false,
            padding: 0,
          },
          // animation: false,
          plugins: {
            tooltip: {
              rtl: LayoutDirectionConfig[i18n.locale] === "rtl",
              // TODO: Check customizations on Tooltip Labels
              // callbacks: {
              //   title: function (args) {
              //     console.log(args);
              //     return "";
              //   },
              //   label: function (args) {
              //     console.log(args);
              //     return "";
              //   },
              // },
            },
            legend: {
              // TODO: Change Legend display to false and add an HTML Legend
              display: true,
              position: "bottom",
              align: "center",
              rtl: LayoutDirectionConfig[i18n.locale] === "rtl",
              fullSize: false,
              labels: {
                padding: 10,
                boxWidth: 20,
                boxHeight: 20,
                font: {
                  size: 12,
                  family: "'InterRegular', sans-serif",
                  weight: 900,
                },
              },
            },
          },
        },
      };
    },

    graphData() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: this.countryName,
            data: this.countryPhaseData,
            fill: true,
            borderWidth: 1,
            backgroundColor: "rgba(65,91,163,0.5)",
            borderColor: "rgba(65,91,163,0.5)",
            pointBackgroundColor: "rgba(65,91,163,0.5)",
            pointBorderColor: "#fff",
            pointRadius: 5,
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(65,91,163,0.5)",
            spanGaps: true,
          },
          {
            label: i18n.t(
              "countryProfile.benchmark.benchmarkValues.globalAverage"
            ),
            data: this.regionalPhaseData,
            fill: true,
            borderWidth: 1,
            backgroundColor: "rgba(108,117,125,0.5)",
            borderColor: "rgba(108,117,125,0.5)",
            pointBackgroundColor: "rgba(108,117,125,0.5)",
            pointBorderColor: "#fff",
            pointRadius: 5,
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(108,117,125,0.5)",
            spanGaps: true,
          },
        ],
      };
    },
  },

  mounted() {
    Chart.defaults.font.size = 16;
    Chart.defaults.font.family = "'InterRegular', sans-serif";
    this.drawChart();
  },

  watch: {
    chartMetaData() {
      graphInstance?.destroy();

      setTimeout(() => {
        this.drawChart();
      }, 700);
    },
  },

  methods: {
    drawChart() {
      try {
        graphInstance = new Chart(
          document.getElementById("phase-overview-spider-graph"),
          {
            ...this.graphConfig,
            ...{ data: this.graphData },
          }
        );
      } catch (e) {
        /* empty */
      }
    },
  },
});
</script>

<style scoped lang="scss">
@import "../../../assets/stylesheets/_rtl-support.scss";

.canvas-container {
  height: 60vh;
  width: 110%;
}
canvas {
  margin-top: -8vh;
  @include margin-left(10px);
}
</style>
