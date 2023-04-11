<template>
  <div class="canvas-container">
    <canvas id="phase-overview-spider-graph"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  name: "phase-overview-spider-graph",

  props: {
    countryData: {
      type: Object,
      default() {
        return {};
      },
    },
    regionalData: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  computed: {
    labels() {
      let val = [];
      this.countryData.categories.forEach((category) => {
        val.push(category.name);
      });
      return val;
    },
    countryPhaseData() {
      let val = [];
      this.countryData.categories.forEach((category) => {
        val.push(category.phase);
      });
      return val;
    },
    regionalPhaseData() {
      let val = [];
      this.regionalData.categories.forEach((category) => {
        val.push(category.phase);
      });
      return val;
    },
    graphData() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: this.countryData.countryName,
            data: this.countryPhaseData,
            fill: true,
            borderWidth: 1,
            backgroundColor: "rgba(65,91,163,0.5)",
            borderColor: "rgba(65,91,163,0.5)",
            pointBackgroundColor: "rgba(65,91,163,0.5)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(65,91,163,0.5)",
            spanGaps: true,
          },
          {
            label: "Overall",
            data: this.regionalPhaseData,
            fill: true,
            borderWidth: 1,
            backgroundColor: "rgba(108,117,125,0.5)",
            borderColor: "rgba(108,117,125,0.5)",
            pointBackgroundColor: "rgba(108,117,125,0.5)",
            pointBorderColor: "#fff",
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
    new Chart(document.getElementById("phase-overview-spider-graph"), {
      type: "radar",
      data: this.graphData,
      options: {
        elements: {
          line: {
            borderWidth: 1,
          },
        },
        scales: {
          r: {
            angleLines: {
              display: true,
            },
            suggestedMin: 0,
            alignToPixels: true,
            beginAtZero: true,
            ticks: {
              count: 5,
              format: "",
            },
            pointLabels: {
              font: {
                size: 9,
                family: "'InterRegular', sans-serif",
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
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
        },
      },
    });
  },
};
</script>

<style scoped>
.canvas-container {
  height: 65vh;
}
</style>
