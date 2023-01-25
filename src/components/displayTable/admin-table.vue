<script>
import Vue from "vue";

export default Vue.extend({
  props: {
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
    rows: {
      type: Array,
      default() {
        return [];
      },
    },
    action: {
      type: String,
      default() {
        return "";
      },
    },
    actionHandler: {
      type: Function,
      default() {
        return () => {};
      },
    },
    noRecordsMessage: {
      type: String,
      default() {
        return "";
      },
    },
  },
  name: "AdminTable",
});
</script>

<template>
  <div>
    <div class="error-info text-center subheader" v-if="!rows.length">
      {{ noRecordsMessage }}
    </div>
    <table id="fifthTable" v-if="rows.length">
      <thead>
        <tr>
          <th v-for="(col, id) in columns" :key="id">{{ col.displayName }}</th>
          <th v-if="rows.length > 0">
            <span v-if="action !== 'View Data'">Action</span
            ><span v-else>URL</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, id) in rows" :key="id">
          <td v-for="(col, id) in columns" :key="id">
            {{ row[col.propName] }}
          </td>
          <td v-if="action !== 'View Data'">
            <button
              class="btn btn-primary"
              @click="actionHandler(action, row.countryUUID)"
            >
              {{ action }}
            </button>
          </td>
          <td v-else>{{ row.url }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
