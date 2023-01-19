<template>

<div>
    <div>
        <div class="search-box hd-element">
            <autocomplete
                id="search-box"
                :source="countries"
                resultsValue="uniqueId"
                placeholder="Search by country name"
                input-class="search-box-container"
                @selected="onCountrySelect"
                @clear="onClearCountry"
                />
        
            <div>
                <button class="btn btn-primary" :class="disableGenerateBtn ? 'disabled ' : ''" @click="generateUrl()" :disabled="disableGenerateBtn">Generate URL</button>
            </div>
        </div>
    </div>
    <div>
        <div><input v-model="generatedURL" type="text" id="url-box" readonly></div>
        <div class="float-right"><button class="btn btn-secondary" @click="copyUrl()">Copy url</button></div>
    </div>
    <div>
        <div id="info-box" v-if="warningMessage.length"><i class="fa fa-lg fa-exclamation-triangle"/>{{warningMessage}}</div>
    </div>

</div>


</template>

<script>
   import Vue from "vue";

import common from "../../common/common";
import Autocomplete from "vuejs-auto-complete";
import axios from "axios";
import {sortBy} from "lodash";
import Notifications from 'vue-notification';

Vue.use(Notifications);

export default Vue.extend({

    name: "GenerateUrl",
    components: { Autocomplete, Notifications },
    mounted() {
      this.loadCountries();
      common.hideLoading();
    },
    updated(){
      if(this.locale !== this.$i18n.locale){
         this.loadCountries();
        this.locale = this.$i18n.locale
      }
    },
    data() {
      return {
        success: false,
        error: false,
        disableGenerateBtn: true,
        countries: [],
        countryUUID: "",
        generatedURL:"",
        countryId:"",
        message:"",
        warningMessage: "",
        locale:'en',
      };
    },
    methods: {
      loadCountries() {
        return axios.get('/api/countries', common.configWithUserLanguageAndNoCacheHeader(this.$i18n.locale))
          .then(response => {
            this.countries = sortBy(response.data, ["name"]);
          });
      },
      notifier(props) {
        this.$notify({
          group: props.group,
          title: props.title,
          text: props.text,
          type: props.type
        });
      },
      onCountrySelect(selectedItem) {
        this.generatedURL='';
        this.message='';
        this.warningMessage='';
        this.countryId = selectedItem.selectedObject.id;
        this.countryUUID = selectedItem.value;
        this.disableGenerateBtn = false
      },
      onClearCountry () {
        this.generatedURL='';
        this.message='';
        this.warningMessage='';
        this.countryId = '';
        this.countryUUID = '';
        this.disableGenerateBtn = true
      },
      generateUrl(){
        this.saveURLGenerationStatus();
        this.generatedURL = location.origin + "/health_indicator_questionnaire/" + this.countryUUID;
      },
      copyUrl() {
        document.getElementById("url-box").select();
        document.execCommand("Copy");
        this.notifier({
          group: 'custom-template',
          title: 'Information',
          text: 'URL Copied Successfully',
          type: 'warn'
        });
      },
      saveURLGenerationStatus() {
        common.showLoading();
        let url = "/api/countries/" + this.countryUUID + "/generate_url";
        return axios.post(url, {
          countryId: this.countryId
        }).then((response) => {
          document.body.scrollTop = document.documentElement.scrollTop = 0;
          if(response.data.success) {
            this.message = "URL Generated Successfully";
            if(response.data.existingStatus == "PUBLISHED") {
              this.warningMessage = "Already Published";
            }
            this.notifier({
              group: 'custom-template',
              title: 'Success',
              text: this.message,
              type: 'success'
            });
          } else {
            if(response.data.existingStatus == "NEW" || response.data.existingStatus == "DRAFT") {
              this.warningMessage = "Submission under process";
            } else {
              this.warningMessage = "Review Pending";
            }
          }
          common.hideLoading();
        }).catch(() => {
          document.body.scrollTop = document.documentElement.scrollTop = 0;
          this.success = false;
          this.message = 'Error While Generating URL for Country';
          this.notifier({
            group: 'custom-template',
            title: 'Error',
            text: this.message,
            type: 'error'
          });
          common.hideLoading();
        });
      },

    }
});

</script>