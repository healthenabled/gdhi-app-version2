import { createLocalVue, shallowMount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import HealthIndicatorQuestionnaire from "../healthIndicatorQuestionnaire/health-indicator-questionnare.vue";
import moxios from "moxios";
import VueRouter from "vue-router";
import { i18n } from "../../plugins/i18n";

describe("Health Indicator Questionnaire", () => {
  let wrapper;
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  const healthIndicatorOptions = [
    {
      categoryId: 1,
      categoryName: "Leadership and Governance",
      indicators: [
        {
          indicatorId: 1,
          indicatorCode: "1",
          indicatorName:
            "Digital health prioritized at the national level through dedicated bodies / mechanisms for governance",
          indicatorDefinition:
            "Does the country have a separate department / agency / national working group for digital health?",
          scores: [
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
            {
              score: 1,
              scoreDefinition:
                "No coordinating body exists and/or nascent governance structure for digital health is constituted on a case-by-case basis.",
            },
            {
              score: 2,
              scoreDefinition:
                "Governance structure is formally constituted though not fully-functional or meeting regularly.",
            },
            {
              score: 3,
              scoreDefinition:
                "Governance structure and any related working groups have a scope of work (SOW) and conduct regular meetings with stakeholder participation and/or consultation.",
            },
            {
              score: 4,
              scoreDefinition:
                "Governance structure is fully-functional, government-led, consults with other ministries, and monitors implementation of digital health based on a work plan.",
            },
            {
              score: 5,
              scoreDefinition:
                "The digital health governance structure is institutionalized, consults with other ministries, and monitors implementation of digital health. It is relatively protected from interference or organizational changes. It is nationally recognized as the lead for digital health.The governance structure and its technical working groups emphasize gender balance in membership.",
            },
          ],
        },
        {
          indicatorId: 2,
          indicatorCode: "2",
          indicatorName:
            "Digital Health prioritized at the national level through planning",
          indicatorDefinition:
            "Is digital health included and budgeted for in national health or relevant national strategies and/or plan(s)?",
          scores: [
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
            {
              score: 1,
              scoreDefinition:
                "Digital health is not included in the national health strategy. It is being implemented in an ad hoc fashion in health programs.",
            },
            {
              score: 2,
              scoreDefinition:
                "There is some discussion of inclusion of digital health in national health or other relevant national strategies or plans. Proposed language for inclusion of digital health in national health or relevant national strategies and/or plans has been made and is under review.",
            },
            {
              score: 3,
              scoreDefinition:
                "Digital health is included in national health or relevant national strategies and/or plans.",
            },
            {
              score: 4,
              scoreDefinition:
                "Digital health is being implemented as part of national health or other relevant national strategies and/or plans.",
            },
            {
              score: 5,
              scoreDefinition:
                "Digital health is implemented and periodically evaluated and optimized in national health or other relevant national strategies and/or plans.",
            },
          ],
        },
      ],
    },
  ];
  let countryData = {
    countryId: "AFG",
    status: "NEW",
    countrySummary: {
      countryId: "AFG",
      countryName: "Afghanistan",
      countryAlpha2Code: "AF",
      summary: null,
      contactName: null,
      contactDesignation: null,
      contactOrganization: null,
      contactEmail: null,
      dataFeederName: null,
      dataFeederRole: null,
      dataFeederEmail: null,
      dataApproverName: null,
      dataApproverRole: null,
      dataApproverEmail: null,
      collectedDate: null,
      resources: [],
    },
    healthIndicators: [],
  };

  let draftCountryData = {
    countryId: "AFG",
    status: "NEW",
    countrySummary: {
      countryId: "AFG",
      countryName: "Afghanistan",
      countryAlpha2Code: "AF",
      summary: null,
      contactName: null,
      contactDesignation: null,
      contactOrganization: null,
      contactEmail: null,
      dataFeederName: null,
      dataFeederRole: null,
      dataFeederEmail: null,
      dataApproverName: null,
      dataApproverRole: null,
      dataApproverEmail: null,
      collectedDate: null,
      resources: [],
    },
    healthIndicators: [
      {
        categoryId: 1,
        indicatorId: 1,
        status: "DRAFT",
        score: 1,
        supportingText: "xcvxcv",
      },
    ],
  };
  describe(" New Form Data", () => {
    beforeEach(() => {
      moxios.install();
      moxios.stubRequest(/\/api\/countries\/*/, {
        status: 200,
        response: countryData,
      });

      moxios.stubRequest("/api/health_indicator_options", {
        status: 200,
        response: healthIndicatorOptions,
      });
      wrapper = shallowMount(HealthIndicatorQuestionnaire, {
        localVue,
        router,
        i18n,
      });
    });

    it("should load all data for new form", (done) => {
      moxios.wait(() => {
        expect(wrapper.vm.status).to.equal(countryData.status);
        expect(wrapper.vm.questionnaire).to.deep.equal(healthIndicatorOptions);
        expect(wrapper.vm.countrySummary).to.deep.equal(
          countryData.countrySummary
        );
        expect(Object.keys(wrapper.vm.healthIndicators).length).to.deep.equal(
          healthIndicatorOptions[0].indicators.length
        );
        healthIndicatorOptions.forEach((category) => {
          expect(category.showCategory).to.be.equal(false);
        });
        done();
      });
    });
    afterEach(() => {
      moxios.uninstall();
    });
  });

  describe(" Draft Form Data", () => {
    beforeEach(() => {
      moxios.install();
      moxios.stubRequest(/\/api\/countries\/*/, {
        status: 200,
        response: draftCountryData,
      });

      moxios.stubRequest("/api/health_indicator_options", {
        status: 200,
        response: healthIndicatorOptions,
      });
      wrapper = shallowMount(HealthIndicatorQuestionnaire, {
        localVue,
        router,
        i18n,
      });
    });
    it("should load all data for new form", (done) => {
      moxios.wait(() => {
        expect(wrapper.vm.status).to.equal(countryData.status);
        expect(wrapper.vm.questionnaire).to.deep.equal(healthIndicatorOptions);
        expect(wrapper.vm.countrySummary).to.deep.equal(
          countryData.countrySummary
        );
        healthIndicatorOptions.forEach((category) => {
          expect(category.showCategory).to.be.equal(false);
        });
        done();
      });
    });

    it("should set showEdit based on isViewPublish", (done) => {
      wrapper.vm.isViewPublish = true;
      moxios.wait(() => {
        expect(wrapper.vm.showEdit).to.equal(false);
        done();
      });
    });
    afterEach(() => {
      moxios.uninstall();
    });
  });

  describe(" REVIEW_PENDING Form Data", () => {
    beforeEach(() => {
      draftCountryData.status = "REVIEW_PENDING";
      moxios.install();
      moxios.stubRequest(/\/api\/countries\/*/, {
        status: 200,
        response: draftCountryData,
      });

      moxios.stubRequest("/api/health_indicator_options", {
        status: 200,
        response: healthIndicatorOptions,
      });
      wrapper = shallowMount(HealthIndicatorQuestionnaire, {
        localVue,
        router,
        i18n,
      });
    });

    it("should set showEdit", (done) => {
      moxios.wait(() => {
        expect(wrapper.vm.showEdit).to.equal(false);
        done();
      });
    });
    afterEach(() => {
      moxios.uninstall();
    });
  });
});
