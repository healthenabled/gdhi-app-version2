<template>
  <div>
    <canvas id="myChart"></canvas>
  </div>
</template>
<script>
import Chart from "chart.js/auto";
import { i18n, LayoutDirectionConfig } from "../../plugins/i18n";
import indicatorFilter from "../indicatorFilter/indicator-filter.vue";
import Vue from "vue";

let lineChartInstance = null;
export default Vue.extend({
  components: {
    indicatorFilter,
  },
  name: "LineGraphChart",
  props: {
    yearOnYearData: { type: Array, required: true },
    currentYear: { type: String, required: true },
    defaultYear: { type: String, required: true },
    categoryFilter: { type: Number, required: true },
    locale: { type: String, required: true },
    labels: { type: Array, required: true },
  },

  computed: {
    countryData() {
      let val = [];
      let yearPhaseMap = new Map();
      this.yearOnYearData.map((element) => {
        if (this.categoryFilter === 0 || this.categoryFilter === -1) {
          yearPhaseMap.set(element.year, element.data.country.countryPhase);
        } else {
          yearPhaseMap.set(
            element.year,
            element.data.country.categories[this.categoryFilter].phase
          );
        }
      });
      this.labels.map((label) => {
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
      this.yearOnYearData.map((element) => {
        yearPhaseMap.set(element.year, element.data.average.overAllScore);
      });
      this.labels.map((label) => {
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
        labels: this.labels,
        datasets: [
          {
            label: this.yearOnYearData[0].data.country.countryName,
            data: this.countryData,
            fill: false,
            borderColor: "black",
            spanGaps: true,
            pointBorderColor: "rgba(0,0,0,0)",
            pointStyle: "rectRot",
            borderWidth: 1.5,
            pointRadius: 14,
            pointHoverRadius: 16,
            pointBackgroundColor: function (context) {
              if (context.parsed.y === 1) {
                return "red";
              } else if (context.parsed.y === 2) {
                return "orange";
              } else if (context.parsed.y === 3) {
                return "yellow";
              } else if (context.parsed.y === 4) {
                return "green";
              } else if (context.parsed.y === 5) {
                return "darkGreen";
              } else {
                return "silver";
              }
            },

            // segment: {
            //   borderColor: (ctx) => {
            //     const skipped = (ctx, value) =>
            //       ctx.p0.skip || ctx.p1.skip ? value : undefined;
            //     const down = (ctx, value) =>
            //       ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
            //     skipped(ctx, "rgb(0,0,0,0.2)") || down(ctx, "rgb(192,75,75)");
            //   },
            //   borderDash: (ctx) => {
            //     const skipped = (ctx, value) =>
            //       ctx.p0.skip || ctx.p1.skip ? value : undefined;
            //     const down = (ctx, value) =>
            //       ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
            //     skipped(ctx, [4, 4]);
            //   },
            // },
          },
          {
            label: "Global average",
            data: this.globalData,
            fill: false,
            borderColor: "grey",
            tension: 0.1,
            borderDash: [5, 4],
            borderWidth: 1.5,
            pointStyle: false,
            pointRadius: 14,
            spanGaps: true,
          },
        ],
      };
    },

    lineChartOptions() {
      return {
        clip: false,
        layout: {
          padding: {
            left: 40,
            right: 40,
            top: 60,
            bottom: 0,
          },
        },
        animation: false,
        plugins: {
          tooltip: {
            rtl: LayoutDirectionConfig[i18n.locale] === "rtl",
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";

                if (label) {
                  label += " ::Phase: ";
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y;
                }
                return label;
              },
            },
          },
          legend: {
            rtl: LayoutDirectionConfig[i18n.locale] === "rtl",
            position: "bottom",
            labels: {
              boxHeight: 0,
            },
          },
          annotation: {
            annotations: {
              line: {
                type: "line",
                xMin: this.currentYear,
                xMax: this.currentYear,
                backgroundColor: "yellow",
                borderColor: "darkblue",
                borderWidth: 1.5,
                borderDash: [20, 16],
                drawTime: "beforeDatasetsDraw",
              },
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            position:
              LayoutDirectionConfig[i18n.locale] === "rtl" ? "right" : "left",
            grid: {
              borderDash: [4, 4],
            },
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1,
              beginAtZero: false,
              callback: function (value, index, values) {
                const labels = [
                  "",
                  "Phase 1",
                  "Phase 2",
                  "Phase 3",
                  "Phase 4",
                  "Phase 5",
                ];
                return labels[value];
              },
            },
          },
          x: {
            reverse: LayoutDirectionConfig[i18n.locale] === "rtl",
            grid: {
              display: false,
            },
            ticks: {
              beginAtZero: true,
              stepSize: 1,
              min: 1,
            },
          },
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
    yearOnYearData() {
      this.drawLineChart();
    },
    locale() {
      console.log("Chart destroyed due to language change");
      this.drawLineChart();
    },
    categoryFilter() {
      this.drawLineChart();
    },
  },

  methods: {
    drawLineChart() {
      lineChartInstance?.destroy();
      lineChartInstance = new Chart(
        document.getElementById("myChart"),
        this.lineChartConfig
      );
    },
    getLabels() {
      this.yearOnYearData.map((element) => {
        this.labels.push(element.year);
      });
    },
  },
});
</script>
<style scoped lang="scss">
div {
  height: 85%;
}
</style>
