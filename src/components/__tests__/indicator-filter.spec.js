import { shallowMount } from "@vue/test-utils";
import indicatorFilter from "../indicatorFilter/indicator-filter.vue";
import sinon from "sinon";
import { describe, it, expect, beforeEach, vi } from "vitest";
import axios from "axios";
import { i18n } from "../../plugins/i18n";
import flushPromises from "flush-promises";

const axiosGetSpy = vi.spyOn(axios, "get");

describe("indicator-filter", () => {
  let wrapper;
  let setCategoryFilterMock = sinon.spy();
  window.appProperties = {
    getCategoryFilter: () => {
      return "";
    },
    setCategoryFilter: setCategoryFilterMock,
  };

  let healthIndicatorData = [
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
      ],
    },
  ];

  beforeEach(async () => {
    axiosGetSpy.mockImplementation(async (url) => {
      if (url.includes("health_indicator_options")) {
        return new Promise((resolve) => {
          resolve({ data: healthIndicatorData });
        });
      }
    });
    wrapper = shallowMount(indicatorFilter, {
      i18n,
    });
    await flushPromises();
  });

  it("should update the value for categories when fetchCategoricalIndicators is called ", async () => {
    wrapper.vm.fetchCategoricalIndicators();
    await flushPromises();

    expect(wrapper.vm.categories).to.deep.equal(healthIndicatorData);
  });
});
