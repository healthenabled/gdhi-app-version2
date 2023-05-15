<script>
import Vue from "vue";

import AdminTable from "../displayTable/admin-table.vue";
import axios from "axios";
import isEmpty from "lodash/isEmpty";

export default Vue.extend({
  name: "AdminViewFormDetails",
  components: { AdminTable },
  data() {
    return {
      selectedTab: 0,
      tableColumns: [],
      tableRows: [],
      allData: {},
      action: "",
      shouldEditLiveData: false,
      noRecordsMessage: "",
      url: location.origin + "/admin/health_indicator_questionnaire/",
      error: "",
      tabs: [
        { id: 0, name: "Awaiting Submission" },
        { id: 1, name: "Review Pending" },
        { id: 2, name: "Live Data" },
      ],
    };
  },
  mounted() {
    this.loadAdminViewFormDetails();
  },
  computed: {
    currentYear() {
      return this.allData.currentYear;
    },
  },

  methods: {
    updateSelected(tab) {
      this.getTabData(tab);
      this.selectedTab = tab.id;
    },
    loadAdminViewFormDetails() {
      axios
        .get("/api/countries/country_status_summaries")
        .then((response) => {
          this.allData = response.data;
          this.updateSelected(this.tabs[0]);
        })
        .catch((e) => {
          this.error = e.response.message;
        });
    },
    editHandler(countryUUID) {
      this.openHealthIndicatorQuestionnaire(countryUUID, "/editPublished/");
    },
    actionHandler(action, countryUUID) {
      if (action === "Review") {
        this.openHealthIndicatorQuestionnaire(countryUUID, "/review/");
      } else if (action === "View Live Data") {
        this.openHealthIndicatorQuestionnaire(countryUUID, "/viewPublished/");
      }
    },
    openHealthIndicatorQuestionnaire(countryUUID, route) {
      window.open(
        location.origin +
          "/admin/health_indicator_questionnaire/" +
          countryUUID +
          route +
          this.currentYear
      );
    },
    wrapperOnTableRows(rows) {
      rows.forEach(function (row) {
        row.url =
          location.origin +
          "/health_indicator_questionnaire/" +
          row.countryUUID;
      });
    },
    getTabData(tab) {
      this.tableColumns = [];
      this.tableRows = [];
      this.noRecordsMessage = "";
      if (isEmpty(this.allData)) {
        this.noRecordsMessage = "No Records Found";
        return;
      }
      switch (tab) {
        case this.tabs[0]:
          this.tableColumns = [
            { propName: "countryName", displayName: "Country" },
            { propName: "status", displayName: "Status" },
          ];

          this.tableRows = [];
          if (this.allData.NEW !== undefined)
            this.tableRows = [...this.tableRows, ...this.allData.NEW];
          if (this.allData.DRAFT !== undefined)
            this.tableRows = [...this.tableRows, ...this.allData.DRAFT];
          this.wrapperOnTableRows(this.tableRows);
          this.action = "View Data";
          this.shouldEditLiveData = false;
          break;
        case this.tabs[1]:
          this.tableColumns = [
            { propName: "countryName", displayName: "Country" },
            { propName: "contactName", displayName: "Country Contact Name" },
            { propName: "contactEmail", displayName: "Country Contact Email" },
          ];
          this.action = "Review";
          this.shouldEditLiveData = false;
          this.tableRows = [];
          if (this.allData.REVIEW_PENDING !== undefined) {
            this.tableRows = this.allData.REVIEW_PENDING;
          }
          break;
        case this.tabs[2]:
          this.tableColumns = [
            { propName: "countryName", displayName: "Country" },
            { propName: "contactName", displayName: "Country Contact Name" },
            { propName: "contactEmail", displayName: "Country Contact Email" },
          ];
          this.action = "View Live Data";
          this.shouldEditLiveData = true;
          this.tableRows = [];
          if (this.allData.PUBLISHED !== undefined) {
            this.tableRows = this.allData.PUBLISHED;
          }
          break;
      }
      if (this.tableRows.length <= 0) {
        this.noRecordsMessage = "No Records Found";
      }
    },
  },
});
</script>

<template>
  <div>
    <div class="header-bold">Form Details for {{ currentYear }} year</div>
    <div class="tabs">
      <ul class="tablist">
        <li
          v-for="tab in tabs"
          v-on:click="updateSelected(tab)"
          :class="{ current: selectedTab == tab.id }"
        >
          {{ tab.name }}
        </li>
      </ul>
      <div
        class="tab-content"
        v-for="tab in tabs"
        v-show="selectedTab == tab.id"
      >
        <AdminTable
          :noRecordsMessage="noRecordsMessage"
          :columns="tableColumns"
          :rows="tableRows"
          :action="action"
          :actionHandler="actionHandler"
          :shouldEditLiveData="shouldEditLiveData"
          :editHandler="editHandler"
        ></AdminTable>
      </div>
    </div>
  </div>
</template>
