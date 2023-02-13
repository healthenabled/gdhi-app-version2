<script>
import Vue from "vue";
import axios from "axios";
import common from "../../common/common";
import { EventBus } from "../common/event-bus";

export default Vue.extend({
    name:"phaseFilter",
    data() {
        return {
            phaseValue: "",
            phases: [],
        };
    },

    created() {
        this.phaseValue = window.appProperties.getPhaseFilter();
        this.fetchPhases();
    },

    methods: {
        filter: function () {
        window.appProperties.setPhaseFilter({ phaseId: this.phaseValue });
        EventBus.$emit("Map:filtered");
        EventBus.$emit("Panel:filtered");
        },

        resetFilters: function () {
        this.phaseValue = "";
        this.filter();
        },

        fetchPhases: function () {
            const self = this;
            axios.get("/api/phases").then((response) => {
                self.phases = response.data;
            });
        },
    }
});
</script>
<template>
    <div class="phase-indicator">
        <select
            class="filter-2"
            v-model="phaseValue"
            @change="filter()"
            name="test_select2"
            >
            <option value="">{{ $t("mixed.all") }}</option>
            <option v-for="phase in phases" v-bind:value="phase.phaseValue">
            {{ $t("mixed.phase") }} {{ phase.phaseValue }}
            </option>
        </select>
    </div>
</template>