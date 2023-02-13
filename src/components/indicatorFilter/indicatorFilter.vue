<script>
import Vue from "vue";
import axios from "axios";
import common from "../../common/common";
import { EventBus } from "../common/event-bus";

export default Vue.extend({
    name:"IndicatorFilter",
    data() {
        return {
            categoryValue: "",
            categories: [],
        };
    },

    created() {
        this.categoryValue = window.appProperties.getCategoryFilter();
        this.fetchCategoricalIndicators();
    },

    methods: {
        filter: function () {
        window.appProperties.setCategoryFilter({
            categoryId: this.categoryValue,
        });
        EventBus.$emit("Map:filtered");
        EventBus.$emit("Panel:filtered");
        },

        resetFilters: function () {
        this.categoryValue = "";
        this.filter();
        },

        fetchCategoricalIndicators: function() {
            const self = this;
            return axios
            .get(
            "/api/health_indicator_options",
            common.configWithUserLanguageAndNoCacheHeader(this.$i18n.locale)
            )
            .then((categories) => {
            self.categories = categories.data;
            });
        },
    }
});
</script>
<template>
    <div class="filter-indicator">
        <select
            class="filter-1"
            v-model="categoryValue"
            @change="filter()"
            name="test_select1"
          >
            <option value="">{{ $t("mixed.textOverAll") }}</option>
            <option
              v-for="category in categories"
              v-bind:value="category.categoryId"
            >
              {{ category.categoryName }}
            </option>
        </select>
     </div>
</template>