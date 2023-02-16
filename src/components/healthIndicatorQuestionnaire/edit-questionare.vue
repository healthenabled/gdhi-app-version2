<template>
  <div class="health-indicator-questionnaire content-centered">
    <div class="clearfix fixed-sub-header">
      <div class="page-title">
        <div
          v-if="countrySummary.countryAlpha2Code"
          class="flag"
          :style="{
            backgroundImage:
              'url(' +
              `/static/img/flags/${this.countrySummary.countryAlpha2Code.toLowerCase()}.svg` +
              ')',
          }"
        ></div>
        {{ countrySummary.countryName }}
      </div>
      <div class="pdf-title">
        {{
          $t("healthIndicatorQuestionnaire.pdfTitle", {
            country: countrySummary.countryName,
          })
        }}
      </div>
      <span class="copy-italics copy-grey questionnaire-title">{{
        $t("healthIndicatorQuestionnaire.digitalHeathQuestionnaire")
      }}</span>
      <div class="float-right button-container">
        <span
          ><button class="submit-btn btn btn-primary" @click="generatePDF()">
            <i class="fa fa-download" aria-hidden="true"></i
            >{{ $t("healthIndicatorQuestionnaire.downloadPDF") }}
          </button></span
        >
        <span v-if="status === 'REVIEW_PENDING' && isAdmin">
          <span v-if="showEdit"
            ><button
              class="submit-btn btn btn-primary"
              @click="saveData('saveCorrection')"
            >
              <i class="fa fa-floppy-o" aria-hidden="true"></i
              >{{ $t("healthIndicatorQuestionnaire.save") }}
            </button></span
          >
          <span v-if="showEdit"
            ><button
              class="submit-btn btn btn-green"
              @click="validate('publish')"
            >
              <i class="fa fa-check" aria-hidden="true"></i
              >{{ $t("healthIndicatorQuestionnaire.publish") }}
            </button></span
          >
          <span v-if="showEdit"
            ><button class="submit-btn btn btn-red" @click="reject()">
              <i class="fa fa-times" aria-hidden="true"></i
              >{{ $t("healthIndicatorQuestionnaire.reject") }}
            </button></span
          >
          <v-dialog />
        </span>
        <span v-else>
          <span v-if="showEdit"
            ><button
              class="submit-btn btn btn-primary"
              @click="saveData('save')"
            >
              <i class="fa fa-floppy-o" aria-hidden="true"></i
              >{{ $t("healthIndicatorQuestionnaire.saveAsDraft") }}
            </button></span
          >
          <span v-if="showEdit"
            ><button
              class="submit-btn btn btn-green"
              @click="validate('submit')"
            >
              <i class="fa fa-check" aria-hidden="true"></i
              >{{ $t("healthIndicatorQuestionnaire.submit") }}
            </button></span
          >
        </span>
      </div>
    </div>
    <form
      class="health-indicator-questionnaire-contact-info clearfix sub-content"
    >
      <div class="copy-small-italics copy-blue note">
        {{ $t("healthIndicatorQuestionnaire.note") }}
      </div>
      <div
        class="health-indicator-questionnaire-contact-info-heading header-bold"
      >
        {{ $t("healthIndicatorQuestionnaire.contactForm.contactInformation") }}
      </div>
      <div class="box contact-info">
        <div class="row">
          <div class="collected-date column-33percent">
            <label for="date">{{
              $t(
                "healthIndicatorQuestionnaire.contactForm.dateOnWhichDataWasCollected"
              )
            }}</label>
            <span class="mandatory-field">*</span>
            <span
              class="fa fa-eye publish"
              :title="$t('healthIndicatorQuestionnaire.note1')"
            ></span>
            <input
              type="text"
              :disabled="!showEdit"
              :class="
                errors.has('collectedDate')
                  ? 'has-error form-control'
                  : 'form-control'
              "
              name="collectedDate"
              id="date"
              :placeholder="
                $t('healthIndicatorQuestionnaire.contactForm.dateFormat')
              "
              v-model="countrySummary.collectedDate"
              v-validate.disable="
                'required|date_format:DD-MM-YYYY|date_between:01-01-2010,' +
                today +
                ',true'
              "
              :title="
                $t('healthIndicatorQuestionnaire.contactForm.hoverText.date')
              "
            />
            <div v-if="errors.has('collectedDate')" class="error-info">
              {{
                $t("healthIndicatorQuestionnaire.contactForm.error.wrongDate")
              }}
            </div>
          </div>
          <div class="column-33percent"></div>
          <div class="column-33percent"></div>
        </div>
        <div class="row">
          <div class="form-group column-33percent">
            <label for="nameofPersonEnteringData">{{
              $t(
                "healthIndicatorQuestionnaire.contactForm.nameOfPersonEnteringData"
              )
            }}</label>
            <span class="mandatory-field">*</span>
            <span
              class="fa fa-eye-slash publish"
              :title="$t('healthIndicatorQuestionnaire.note2')"
            ></span>
            <input
              type="text"
              :disabled="!showEdit"
              name="feederName"
              :class="
                errors.has('feederName')
                  ? 'has-error form-control'
                  : 'form-control'
              "
              id="nameofPersonEnteringData"
              v-validate.disable="'required'"
              v-model="countrySummary.dataFeederName"
              :title="
                errors.has('feederName')
                  ? $t(
                      'healthIndicatorQuestionnaire.contactForm.error.nameOfPersonEnteringData'
                    )
                  : $t(
                      'healthIndicatorQuestionnaire.contactForm.hoverText.nameOfPersonEnteringData'
                    )
              "
            />
          </div>
          <div class="form-group column-33percent">
            <label for="roleOfPersonEnteringData">{{
              $t(
                "healthIndicatorQuestionnaire.contactForm.roleOfThePersonEnteringData"
              )
            }}</label>
            <span class="mandatory-field">*</span>
            <span
              class="fa fa-eye-slash publish"
              :title="$t('healthIndicatorQuestionnaire.note2')"
            ></span>
            <input
              type="text"
              :disabled="!showEdit"
              name="feederRole"
              :class="
                errors.has('feederRole')
                  ? 'has-error form-control'
                  : 'form-control'
              "
              id="roleOfPersonEnteringData"
              v-validate.disable="'required'"
              v-model="countrySummary.dataFeederRole"
              :title="
                errors.has('feederRole')
                  ? $t(
                      'healthIndicatorQuestionnaire.contactForm.error.roleOfThePersonEnteringData'
                    )
                  : $t(
                      'healthIndicatorQuestionnaire.contactForm.hoverText.roleOfThePersonEnteringData'
                    )
              "
            />
          </div>
          <div class="form-group column-33percent">
            <label for="emailOfPersonEnteringData">{{
              $t(
                "healthIndicatorQuestionnaire.contactForm.emailOfThePersonEnteringData"
              )
            }}</label>
            <span class="mandatory-field">*</span>
            <span
              class="fa fa-eye-slash publish"
              :title="$t('healthIndicatorQuestionnaire.note2')"
            ></span>
            <input
              type="email"
              :disabled="!showEdit"
              name="feederEmail"
              :class="
                errors.has('feederEmail')
                  ? 'has-error form-control'
                  : 'form-control'
              "
              id="emailOfPersonEnteringData"
              v-validate.disable="'required|email'"
              v-model="countrySummary.dataFeederEmail"
              :title="
                $t('healthIndicatorQuestionnaire.contactForm.hoverText.email')
              "
            />
            <div v-show="errors.has('feederEmail')" class="error-info">
              {{ $t("healthIndicatorQuestionnaire.contactForm.error.email") }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="form-group column-33percent">
            <label for="nameofPersonApprovedData">{{
              $t("healthIndicatorQuestionnaire.contactForm.nameOfTheApprover")
            }}</label>
            <span class="mandatory-field">*</span>
            <span
              class="fa fa-eye-slash publish"
              :title="$t('healthIndicatorQuestionnaire.note2')"
            ></span>
            <input
              type="text"
              :disabled="!showEdit"
              class="form-control"
              id="nameofPersonApprovedData"
              name="approvername"
              v-model="countrySummary.dataApproverName"
              :class="
                errors.has('approvername')
                  ? 'has-error form-control'
                  : 'form-control'
              "
              v-validate.disable="'required'"
              :title="
                errors.has('approvername')
                  ? $t(
                      'healthIndicatorQuestionnaire.contactForm.error.nameOfTheApprover'
                    )
                  : $t(
                      'healthIndicatorQuestionnaire.contactForm.hoverText.nameOfTheApprover'
                    )
              "
            />
          </div>
          <div class="form-group column-33percent">
            <label for="roleofPersonApprovedData">{{
              $t("healthIndicatorQuestionnaire.contactForm.roleOfTheApprover")
            }}</label>
            <span class="mandatory-field">*</span>
            <span
              class="fa fa-eye-slash publish"
              :title="$t('healthIndicatorQuestionnaire.note2')"
            ></span>
            <input
              type="text"
              :disabled="!showEdit"
              class="form-control"
              id="roleofPersonApprovedData"
              name="approverrole"
              v-model="countrySummary.dataApproverRole"
              :class="
                errors.has('approverrole')
                  ? 'has-error form-control'
                  : 'form-control'
              "
              v-validate.disable="'required'"
              :title="
                errors.has('approverrole')
                  ? $t(
                      'healthIndicatorQuestionnaire.contactForm.error.roleOfTheApprover'
                    )
                  : $t(
                      'healthIndicatorQuestionnaire.contactForm.hoverText.roleOfTheApprover'
                    )
              "
            />
          </div>
          <div class="form-group column-33percent">
            <label for="emailofPersonApprovedData">{{
              $t("healthIndicatorQuestionnaire.contactForm.emailOfTheApprover")
            }}</label>
            <span class="mandatory-field">*</span>
            <span
              class="fa fa-eye-slash publish"
              :title="$t('healthIndicatorQuestionnaire.note2')"
            ></span>
            <input
              type="email"
              :disabled="!showEdit"
              class="form-control"
              id="emailofPersonApprovedData"
              name="approveremail"
              v-model="countrySummary.dataApproverEmail"
              :class="
                errors.has('approveremail')
                  ? 'has-error form-control'
                  : 'form-control'
              "
              v-validate.disable="'required|email'"
              :title="
                $t('healthIndicatorQuestionnaire.contactForm.hoverText.email')
              "
            />
            <div v-show="errors.has('approveremail')" class="error-info">
              {{ $t("healthIndicatorQuestionnaire.contactForm.error.email") }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="form-group column-33percent">
            <label for="nameofCountryContact">{{
              $t(
                "healthIndicatorQuestionnaire.contactForm.nameOfTheCountryContact"
              )
            }}</label>
            <span class="mandatory-field">*</span>
            <span
              class="fa fa-eye publish"
              :title="$t('healthIndicatorQuestionnaire.note1')"
            ></span>
            <input
              type="text"
              :disabled="!showEdit"
              name="countryContact"
              :class="
                errors.has('countryContact')
                  ? 'has-error custom-form-control'
                  : 'custom-form-control'
              "
              id="nameofCountryContact"
              v-validate.disable="'required'"
              v-model="countrySummary.contactName"
              :title="
                errors.has('countryContact')
                  ? $t(
                      'healthIndicatorQuestionnaire.contactForm.error.nameOfTheCountryContact'
                    )
                  : $t(
                      'healthIndicatorQuestionnaire.contactForm.hoverText.nameOfTheCountryContact'
                    )
              "
            />
          </div>
          <div class="form-group column-33percent">
            <label for="roleofCountryContact">{{
              $t(
                "healthIndicatorQuestionnaire.contactForm.roleOfTheCountryContact"
              )
            }}</label>
            <span class="mandatory-field">*</span>
            <span
              class="fa fa-eye publish"
              :title="$t('healthIndicatorQuestionnaire.note1')"
            ></span>
            <input
              type="text"
              :disabled="!showEdit"
              name="contactRole"
              :class="
                errors.has('contactRole')
                  ? 'has-error form-control'
                  : 'form-control'
              "
              id="roleofCountryContact"
              v-validate.disable="'required'"
              :title="
                errors.has('contactRole')
                  ? $t(
                      'healthIndicatorQuestionnaire.contactForm.error.roleOfTheCountryContact'
                    )
                  : $t(
                      'healthIndicatorQuestionnaire.contactForm.hoverText.roleOfTheCountryContact'
                    )
              "
              v-model="countrySummary.contactDesignation"
            />
          </div>
          <div class="form-group column-33percent">
            <label for="emailofCountryContact">{{
              $t(
                "healthIndicatorQuestionnaire.contactForm.emailOfTheCountryContact"
              )
            }}</label>
            <span class="mandatory-field">*</span>
            <span
              class="fa fa-eye publish"
              :title="$t('healthIndicatorQuestionnaire.note1')"
            ></span>
            <input
              type="email"
              :disabled="!showEdit"
              name="contactEmail"
              :class="
                errors.has('contactEmail')
                  ? 'has-error form-control'
                  : 'form-control'
              "
              id="emailofCountryContact"
              v-validate.disable="'required|email'"
              v-model="countrySummary.contactEmail"
              :title="
                $t('healthIndicatorQuestionnaire.contactForm.hoverText.email')
              "
            />
            <div v-show="errors.has('contactEmail')" class="error-info">
              {{ $t("healthIndicatorQuestionnaire.contactForm.error.email") }}
            </div>
          </div>
        </div>
        <div class="row">
          <div class="column-66percent">
            <label for="countrySummary">{{
              $t("healthIndicatorQuestionnaire.contactForm.countrySummary")
            }}</label>
            <span class="mandatory-field">*</span>
            <span
              class="fa fa-eye publish"
              :title="$t('healthIndicatorQuestionnaire.note1')"
            ></span>
            <textarea
              name="countrySummary"
              rows="5"
              :disabled="!showEdit"
              :class="
                errors.has('countrySummary')
                  ? 'has-error form-control custom-width'
                  : 'form-control custom-width'
              "
              id="countrySummary"
              v-model="countrySummary.summary"
              v-validate.disable="'required'"
              :title="
                errors.has('countrySummary')
                  ? $t(
                      'healthIndicatorQuestionnaire.contactForm.error.countrySummary'
                    )
                  : $t(
                      'healthIndicatorQuestionnaire.contactForm.error.countrySummary'
                    )
              "
            ></textarea>
          </div>
          <div class="column-33percent">
            <label for="Organisation">{{
              $t(
                "healthIndicatorQuestionnaire.contactForm.organisationOfTheCountryContact"
              )
            }}</label>
            <span class="mandatory-field">*</span>
            <span
              class="fa fa-eye publish"
              :title="$t('healthIndicatorQuestionnaire.note1')"
            ></span>
            <input
              type="text"
              :disabled="!showEdit"
              id="Organisation"
              name="Organisation"
              v-validate.disable="'required'"
              :class="
                errors.has('Organisation')
                  ? 'has-error form-control'
                  : 'form-control'
              "
              v-model="countrySummary.contactOrganization"
              :title="
                errors.has('Organisation')
                  ? $t(
                      'healthIndicatorQuestionnaire.contactForm.error.organisationOfTheCountryContact'
                    )
                  : $t(
                      'healthIndicatorQuestionnaire.contactForm.hoverText.organisationOfTheCountryContact'
                    )
              "
            />
          </div>
        </div>
      </div>
      <div
        class="health-indicator-questionnaire-contact-info-heading header-bold"
      >
        {{
          $t("healthIndicatorQuestionnaire.resourceForm.resourceInformation")
        }}
        <span
          class="fa fa-eye health-indicator-questionnaire-contact-info-publish"
          :title="$t('healthIndicatorQuestionnaire.note1')"
        ></span>
        <div
          class="health-indicator-questionnaire-contact-info-description copy-small"
        >
          {{ $t("healthIndicatorQuestionnaire.resourceForm.note") }}
        </div>
        <div
          class="health-indicator-questionnaire-contact-info-description copy-small-italics"
        >
          {{ $t("healthIndicatorQuestionnaire.resourceForm.exampleFormat") }}
        </div>
      </div>
      <div class="box resources">
        <div class="pdf-resource">
          <p v-for="resource in countrySummary.resources" class="">
            {{ resource }}
          </p>
        </div>
        <div class="row">
          <div class="form-group column-33percent">
            <label for="resource1">{{
              $t("healthIndicatorQuestionnaire.resourceForm.resource", {
                number: 1,
              })
            }}</label
            ><span class="mandatory-field">*</span>
            <input
              type="text"
              :disabled="!showEdit"
              name="resource1"
              id="resource1"
              v-model="countrySummary.resources[0]"
              v-validate.disable="'required|url'"
              :class="
                errors.has('resource1')
                  ? 'has-error form-control'
                  : 'form-control'
              "
            />
            <div v-if="errors.has('resource1')" class="error-info resource">
              {{ $t("healthIndicatorQuestionnaire.resourceForm.errorMessage") }}
            </div>
          </div>
          <div class="form-group column-33percent">
            <label for="resource2">{{
              $t("healthIndicatorQuestionnaire.resourceForm.resource", {
                number: 2,
              })
            }}</label>
            <input
              type="text"
              :disabled="!showEdit"
              :class="
                errors.has('resource2')
                  ? 'has-error form-control'
                  : 'form-control'
              "
              id="resource2"
              name="resource2"
              v-model="countrySummary.resources[1]"
              v-validate.disable="'url'"
            />
            <div v-if="errors.has('resource2')" class="error-info resource">
              {{ $t("healthIndicatorQuestionnaire.resourceForm.errorMessage") }}
            </div>
          </div>
          <div class="form-group column-33percent">
            <label for="resource3">{{
              $t("healthIndicatorQuestionnaire.resourceForm.resource", {
                number: 3,
              })
            }}</label>
            <input
              type="text"
              :disabled="!showEdit"
              :class="
                errors.has('resource3')
                  ? 'has-error form-control'
                  : 'form-control'
              "
              id="resource3"
              name="resource3"
              v-model="countrySummary.resources[2]"
              v-validate.disable="'url'"
            />
            <div v-if="errors.has('resource3')" class="error-info resource">
              {{ $t("healthIndicatorQuestionnaire.resourceForm.errorMessage") }}
            </div>
          </div>
        </div>
        <div class="row column-66percent">
          <div class="form-group column-50percent">
            <label for="resource4">{{
              $t("healthIndicatorQuestionnaire.resourceForm.resource", {
                number: 4,
              })
            }}</label>
            <input
              type="text"
              :disabled="!showEdit"
              :class="
                errors.has('resource4')
                  ? 'has-error form-control'
                  : 'form-control'
              "
              id="resource4"
              name="resource4"
              v-model="countrySummary.resources[3]"
              v-validate.disable="'url'"
            />
            <div v-if="errors.has('resource4')" class="error-info resource">
              {{ $t("healthIndicatorQuestionnaire.resourceForm.errorMessage") }}
            </div>
          </div>
          <div class="form-group column-50percent">
            <label for="resource5">{{
              $t("healthIndicatorQuestionnaire.resourceForm.resource", {
                number: 5,
              })
            }}</label>
            <input
              type="text"
              :disabled="!showEdit"
              :class="
                errors.has('resource5')
                  ? 'has-error form-control'
                  : 'form-control'
              "
              id="resource5"
              name="resource5"
              v-model="countrySummary.resources[4]"
              v-validate.disable="'url'"
            />
            <div v-if="errors.has('resource5')" class="error-info resource">
              {{ $t("healthIndicatorQuestionnaire.resourceForm.errorMessage") }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="health-indicator-questionnaire-contact-info-heading header-bold"
      >
        {{ $t("healthIndicatorQuestionnaire.indicatorDetails") }}
        <span
          :title="$t('healthIndicatorQuestionnaire.note3')"
          class="fa fa-eye health-indicator-questionnaire-contact-info-publish"
        ></span>
      </div>
      <div v-for="category in questionnaire" class="">
        <div class="box" data-header="No.">
          <div
            v-bind:class="
              category.showCategory ? 'accordion expanded' : 'accordion'
            "
          >
            <div class="sub-header" @click="onCategoryExpand(category)">
              {{ category.categoryName }}
            </div>
            <div class="accordion-content">
              <div class="" data-header="Indicators">
                <div
                  v-for="indicator in category.indicators"
                  :class="
                    errors.has(
                      'indicator_' + indicator.indicatorId + '_rationale'
                    ) || errors.has(indicator.indicatorId)
                      ? 'has-error indicator-items'
                      : 'indicator-items'
                  "
                >
                  <div>
                    {{ indicator.indicatorCode }}.
                    {{ indicator.indicatorName }}
                    <span class="mandatory-field">*</span>
                  </div>
                  <div
                    class="copy-small-italics copy-blue indicator-definition"
                  >
                    {{ indicator.indicatorDefinition }}
                  </div>
                  <div v-for="score in indicator.scores" class="scores">
                    <label class="radio-container">
                      <span
                        :class="score.score ? 'score-content' : ''"
                        v-if="score.score >= 0"
                        >{{ score.score }}</span
                      >
                      <span class="score-content" v-if="score.score >= 0"
                        >-</span
                      >
                      <span>{{ score.scoreDefinition }}</span>
                      <input
                        type="radio"
                        :disabled="!showEdit"
                        :name="indicator.indicatorId"
                        v-model="healthIndicators[indicator.indicatorId].score"
                        :value="score.score"
                        v-validate.disable="'required'"
                      />
                      <span class="checkmark"></span>
                    </label>
                  </div>
                  <div class="row description_container">
                    <label>{{
                      $t(
                        "healthIndicatorQuestionnaire.rationaleOrSupportingText"
                      )
                    }}</label>
                    <span class="mandatory-field">&nbsp *</span>
                    <div class="pdf-rationale-or-supporting-text">
                      <p>
                        {{
                          healthIndicators[indicator.indicatorId].supportingText
                        }}
                      </p>
                    </div>
                    <textarea
                      rows="5"
                      class="description"
                      :disabled="!showEdit"
                      :name="
                        'indicator_' + indicator.indicatorId + '_rationale'
                      "
                      v-model="
                        healthIndicators[indicator.indicatorId].supportingText
                      "
                      v-validate.disable="'required'"
                    ></textarea>
                    <div
                      v-show="
                        errors.has(
                          'indicator_' + indicator.indicatorId + '_rationale'
                        ) || errors.has(indicator.indicatorId)
                      "
                      class="error-info"
                    >
                      {{
                        $t("healthIndicatorQuestionnaire.indicatorScoreError")
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="top">
        <a class="arrow" href="#"
          ><span class="fa fa-chevron-circle-up fa-3x"></span
        ></a>
      </div>
    </form>
  </div>
</template>

<script>
import Vue from "vue";

import axios from "axios";
import VeeValidate from "vee-validate";
import VuejsDialog from "vuejs-dialog";
import common from "../../common/common";
import dateFormat from "dateformat";
import { generateFormPDF } from "../pdfHelper/pdf-generate-form.js";

const config = {
  fieldsBagName: "fieldBags",
};
Vue.use(VeeValidate, config);
Vue.use(VuejsDialog);

export default Vue.extend({
  name: "EditQuestionnaire",
  props: {
    questionnaire: {
      type: Array,
      default() {
        return [];
      },
    },
    countrySummary: {
      type: Object,
      default() {
        return {
          resources: [],
        };
      },
    },
    healthIndicators: {
      type: Object,
      default() {
        return {};
      },
    },
    showEdit: {
      type: Boolean,
      default() {
        return true;
      },
    },
    status: {
      type: String,
      default() {
        return "";
      },
    },
    isAdmin: {
      type: Boolean,
      default() {
        return false;
      },
    },
    today: {
      type: String,
      default() {
        return dateFormat(new Date(), "dd-mm-yyyy");
      },
    },
  },
  data() {
    return {
      countryId: "",
      countries: [],
      locale: "en",
      successMessages: this.getSuccessMessages(),
    };
  },
  updated() {
    if (this.locale !== this.$i18n.locale) {
      this.successMessages = this.getSuccessMessages();
      this.locale = this.$i18n.locale;
    }
  },
  methods: {
    getSuccessMessages() {
      return {
        submit: this.$i18n.t(
          "healthIndicatorQuestionnaire.notifications.submit"
        ),
        saveCorrection: this.$i18n.t(
          "healthIndicatorQuestionnaire.notifications.saveCorrection"
        ),
        save: this.$i18n.t("healthIndicatorQuestionnaire.notifications.save"),
        publish: this.$i18n.t(
          "healthIndicatorQuestionnaire.notifications.publish"
        ),
      };
    },
    notifier(props) {
      this.$notify({
        group: "custom-template",
        title: props.title,
        text: props.message,
        type: props.type,
      });
    },
    saveData(action) {
      common.showLoading();
      document.body.scrollTop = document.documentElement.scrollTop = 0;

      let url = "/api/countries/" + action;

      axios
        .post(
          url,
          {
            countryId: this.countrySummary.countryId,
            countrySummary: this.countrySummary,
            healthIndicators: this.getHealthIndicators(),
          },
          common.configWithUserLanguageAndNoCacheHeader(this.$i18n.locale)
        )
        .then(() => {
          if (action === "submit") {
            this.showEdit = false;
          }
          common.hideLoading();
          this.notifier({
            title: "Success",
            message: this.successMessages[action],
            type: "success",
          });
          if (action === "publish") {
            this.$router.push({ path: `/admin` });
          }
        })
        .catch((e) => {
          common.hideLoading();
          if (e.response.status === 400) {
            this.notifier({
              title: "Error",
              message: "Invalid Data",
              type: "error",
            });
          } else {
            this.notifier({
              title: "Error",
              message: this.$i18n.t(
                "healthIndicatorQuestionnaire.notifications.somethingWentWrong"
              ),
              type: "error",
            });
          }
        });
    },
    deleteData() {
      common.showLoading();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      let url = `/api/countries/${this.$route?.params.countryUUID}/delete`;

      axios
        .delete(url)
        .then(() => {
          this.$router.push({ path: `/admin` });
          common.hideLoading();
        })
        .catch(() => {
          this.notifier({
            title: "Error",
            message: this.$i18n.t(
              "healthIndicatorQuestionnaire.notifications.somethingWentWrong"
            ),
            type: "error",
          });
          common.hideLoading();
        });
    },
    getConfirmationDialog(props) {
      let options = {
        okText: this.$i18n.t("healthIndicatorQuestionnaire.confirm"),
        cancelText: this.$i18n.t("healthIndicatorQuestionnaire.cancel"),
      };
      return this.$dialog.confirm(props.message, options).then(() => {
        return props.callBackMethod.apply(this, props.callBackArgs);
      });
    },
    expandAllCategories() {
      this.questionnaire.forEach((category) => {
        this.$set(category, "showCategory", true);
      });
    },
    showValidationError() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.notifier({
        title: "Error",
        message: this.$i18n.t(
          "healthIndicatorQuestionnaire.notifications.correctTheHighlightedFields"
        ),
        type: "error",
      });
    },
    validate(action) {
      this.expandAllCategories();
      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          if (action == "submit") {
            this.saveData(action);
          } else {
            this.checkAndPublish();
          }
        } else {
          this.showValidationError();
        }
      });
    },
    checkAndPublish() {
      this.getConfirmationDialog({
        message: this.$i18n.t(
          "healthIndicatorQuestionnaire.publishConfirmation",
          { country: this.countrySummary.countryName }
        ),
        callBackMethod: this.publish,
        callBackArgs: [],
      });
    },
    publish() {
      this.saveData("publish");
    },
    reject() {
      this.getConfirmationDialog({
        message: this.$i18n.t(
          "healthIndicatorQuestionnaire.rejectConfirmation",
          { country: this.countrySummary.countryName }
        ),
        callBackMethod: this.deleteData,
        callBackArgs: [],
      });
    },
    getHealthIndicators() {
      return Object.entries(this.healthIndicators).map((entry) => entry[1]);
    },
    onCategoryExpand(category) {
      category.showCategory = !category.showCategory;
    },
    generatePDF() {
      if (this.$i18n.locale === "ar") {
        window.print();
      } else {
        this.notifier({
          title: "Success",
          message: this.$i18n.t(
            "healthIndicatorQuestionnaire.notifications.download"
          ),
          type: "success",
        });
        generateFormPDF(
          this.countrySummary,
          this.questionnaire,
          this.healthIndicators,
          this.$i18n
        );
      }
    },
  },
});
</script>

<style>
.mandatory-field {
  margin-left: 3px;
  margin-right: 3px;
}
.score-content {
  margin-left: 2px;
  margin-right: 2px;
}
</style>
