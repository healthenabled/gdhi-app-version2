<template>
  <div class="canvas-container">
    <canvas id="phase-overview-spider-graph"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import { i18n } from "../../../plugins/i18n";

const graphConfig = {
  type: "radar",
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
          format: "",
          precision: 0,
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
        align: "start",
        labels: {
          padding: 10,
          boxWidth: 20,
          boxHeight: 20,
          font: {
            size: 12,
          },
        },
      },
    },
  },
};

export default {
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
        val.push(category.phase);
      });
      return val;
    },
    regionalPhaseData() {
      let val = [];
      this.regionalDataCategories.forEach((category) => {
        val.push(category.phase);
      });
      return val;
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
    countryDataCategories() {
      this.chart.destroy();
      this.drawChart();
    },
  },

  methods: {
    drawChart() {
      this.chart = new Chart(
        document.getElementById("phase-overview-spider-graph"),
        { ...graphConfig, ...{ data: this.graphData } }
      );
    },
  },
};
</script>

<style scoped>
.canvas-container {
  height: 65vh;
}
</style>
