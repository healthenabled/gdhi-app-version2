<template>
  <div>
    <canvas id="bar-graph"></canvas>
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
    locale: { type: String, required: true },
  },
  computed: {
    barMetaData() {
      return {
        locale: this.locale,
      };
    },
    barGraphData() {
      return {
        labels: ["Benin", "Ethiopia", "Ghana", "Mali", "Nigeria"],
        datasets: [
          {
            barPercentage: 1,
            categoryPercentage: 0.5,
            backgroundColor: "#CED4DA",
            label: "Previous year Data",
            data: [1, 2, 3, 2, 1],
          },
          {
            barPercentage: 1,
            categoryPercentage: 0.5,
            label: "CountryData",
            data: [1, 2, 3, 4, 5],
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
            family: "Inter",
            weight: 400,
            size: 14,
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
          //   beginAtZero: true,
          //   stepSize: 1,
          font: {
            family: "Inter",
            weight: 400,
            size: 14,
            lineHeight: "16.94px",
          },
          //   min: 1,
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
        animation: false,
        plugins: {
          tooltip: pluginTooltipOptions,
          legend: {
            display: false,
          },
        },
        responsive: true,
        maintainAspectRatio: true,
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
    },
  },
});
</script>
