import { createLocalVue, shallow } from "@vue/test-utils";
import VueRouter from "vue-router";
import CountryProfile from "../countryProfile/country-profile.vue";
import moxios from "moxios";
// import * as pdfHelper from "../../src/components/pdfHelper/pdf-generate-scorecard.js";
import sinon from "sinon";
import { i18n } from "../../plugins/i18n";

describe.todo("Country Profile ", () => {
  let wrapper;
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  let healthIndicatorData = {
    countryId: "IND",
    countryName: "India",
    countryAlpha2Code: "IN",
    overallScore: 3.226190476190476,
    categories: [
      {
        id: 1,
        name: "Leadership and Governance",
        overallScore: 3.0,
        phase: 3,
        indicators: [
          {
            id: 1,
            code: "1",
            name: "Digital health prioritized at the national level through dedicated bodies / mechanisms for governance",
            indicatorDescription:
              "Does the country have a separate department / agency / national working group for digital health?",
            score: 4,
            supportingText: "sdg",
            scoreDescription:
              "Governance structure is fully-functional, government-led, consults with other ministries, and monitors implementation of digital health based on a work plan.",
          },
          {
            id: 2,
            code: "1",
            name: "Digital health prioritized at the national level through dedicated bodies / mechanisms for governance",
            indicatorDescription:
              "Does the country have a separate department / agency / national working group for digital health?",
            score: 4,
            supportingText: "sdg",
            scoreDescription:
              "Governance structure is fully-functional, government-led, consults with other ministries, and monitors implementation of digital health based on a work plan.",
          },
          {
            id: 3,
            code: "1",
            name: "Digital health prioritized at the national level through dedicated bodies / mechanisms for governance",
            indicatorDescription:
              "Does the country have a separate department / agency / national working group for digital health?",
            score: 4,
            supportingText: "sdg",
            scoreDescription:
              "Governance structure is fully-functional, government-led, consults with other ministries, and monitors implementation of digital health based on a work plan.",
          },
        ],
      },
    ],
    countryPhase: 4,
    collectedDate: "January 2018",
  };

  let benchmarkData = {
    1: {
      benchmarkScore: 5,
      benchmarkValue: "above",
    },
    2: {
      benchmarkScore: 3,
      benchmarkValue: "Below",
    },
    3: {
      benchmarkScore: 4,
      benchmarkValue: "At",
    },
  };

  let phaseData = [
    {
      phaseName: "phase1",
      phaseValue: 1,
    },
    {
      phaseName: "phase2",
      phaseValue: 2,
    },
  ];

  beforeEach(() => {
    moxios.install();
    wrapper = shallow(CountryProfile, {
      localVue,
      router,
      i18n,
    });
    moxios.stubRequest(/\/api\/countries\/.*\/health_indicators/, {
      status: 200,
      response: healthIndicatorData,
    });
    moxios.stubRequest("/api/phases", {
      status: 200,
      response: phaseData,
    });
  });

  it("should populate the data after successfull API call", (done) => {
    moxios.wait(() => {
      expect(wrapper.vm.healthIndicatorData).to.deep.equal(healthIndicatorData);
      expect(wrapper.vm.flagSrc).to.deep.equal(
        `/static/img/flags/${healthIndicatorData.countryAlpha2Code.toLowerCase()}.svg`
      );
      wrapper.vm.initialise();
      wrapper.vm.healthIndicatorData.categories.forEach((category) => {
        expect(category["showCategory"]).to.equal(false);
      });
      done();
    });
  });

  it("should have the appropriate html elements based on the data", (done) => {
    moxios.wait(() => {
      expect(wrapper.find(".country-name").text()).to.equal(
        healthIndicatorData.countryName
      );
      expect(wrapper.find("#collected-date").text()).to.equal(
        `As on: January 2018`
      );
      expect(wrapper.find(".export a").attributes().href).to.equal(
        wrapper.vm.countryDataSheetUrl()
      );
      expect(wrapper.find(".score").text()).to.equal(
        healthIndicatorData.countryPhase.toString()
      );
      expect(wrapper.findAll(".category-bar").length).to.equal(
        healthIndicatorData.categories.length
      );
      const firstCategory = wrapper.findAll(".category-bar").at(0);
      expect(firstCategory.find(".sub-header").text()).to.equal(
        healthIndicatorData.categories[0].name
      );
      expect(firstCategory.findAll(".indicator").length).to.equal(
        healthIndicatorData.categories[0].indicators.length
      );
      const firstIndicator = firstCategory.findAll(".indicator").at(0);
      expect(firstIndicator.find(".indicator-name-value").text()).to.equal(
        healthIndicatorData.categories[0].indicators[0].name
      );
      expect(
        firstIndicator.findAll(".indicator-score-desc").at(0).text()
      ).to.equal(
        healthIndicatorData.categories[0].indicators[0].indicatorDescription
      );
      expect(
        firstIndicator.findAll(".indicator-score-desc").at(1).text()
      ).to.equal(
        healthIndicatorData.categories[0].indicators[0].scoreDescription
      );
      expect(firstIndicator.find(".indicator-score").text()).to.equal(
        healthIndicatorData.categories[0].indicators[0].score.toString()
      );
      done();
    });
  });

  it("should updated the showCategory when the category is clicked", (done) => {
    moxios.wait(() => {
      const firstCategory = wrapper.findAll(".category-bar").at(0);
      firstCategory.find(".sub-header").trigger("click");
      expect(
        wrapper.vm.healthIndicatorData.categories[0].showCategory
      ).to.equal(true);
      firstCategory.find(".sub-header").trigger("click");
      expect(
        wrapper.vm.healthIndicatorData.categories[0].showCategory
      ).to.equal(false);
      done();
    });
  });

  it("should call generateScorecard with the healthindicator data", (done) => {
    wrapper.vm.countrySummary = "Country Summary";
    wrapper.vm.benchmarkPhase = "Global";
    wrapper.vm.benchmarkData = benchmarkData;
    moxios.wait(() => {
      let mockFn = sinon
        .stub(pdfHelper, "generateScorecard")
        .callsFake(() => {});
      wrapper.find(".download-btn").trigger("click");
      expect(mockFn.getCall(0).args).to.deep.equal([
        healthIndicatorData,
        wrapper.vm.countrySummary,
        benchmarkData,
        wrapper.vm.benchmarkPhase,
        wrapper.vm.hasBenchmarkData,
        i18n,
      ]);
      done();
    });
  });

  it("should load the benchmark data when the benchmark dropdown is changed when data is present", (done) => {
    moxios.wait(() => {
      wrapper
        .findAll(".benchmarkDropDown option")
        .at(1).element.selected = true;
      wrapper.find(".benchmarkDropDown").trigger("change");
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request
          .respondWith({
            status: 200,
            response: benchmarkData,
          })
          .then(() => {
            expect(wrapper.vm.benchmarkData).to.deep.equal(benchmarkData);
            expect(wrapper.findAll(".benchmark-score").length).to.equal(
              Object.keys(benchmarkData).length
            );
            expect(wrapper.findAll(".benchmark-score").at(0).html()).equal(
              '<div class="benchmark-score"><span>Benchmark: 5</span></div>'
            );
            expect(wrapper.findAll(".benchmark-score").at(0).text()).to.equal(
              "Benchmark: " + benchmarkData["1"].benchmarkScore.toString()
            );

            expect(wrapper.findAll(".benchmarkCompare").at(0).text()).to.equal(
              "ABOVE AVG."
            );
            expect(wrapper.findAll(".benchmarkCompare").at(1).text()).to.equal(
              "BELOW AVG."
            );
            expect(wrapper.findAll(".benchmarkCompare").at(2).text()).to.equal(
              "AT AVG."
            );
            done();
          });
      });
    });
  });

  it("should reset the benchmark data to empty object when no value is selected", (done) => {
    moxios.wait(() => {
      wrapper
        .findAll(".benchmarkDropDown option")
        .at(0).element.selected = true;
      wrapper.find(".benchmarkDropDown").trigger("change");
      moxios.wait(() => {
        expect(wrapper.vm.benchmarkData).to.deep.equal({});
        expect(wrapper.findAll(".benchmark-score").length).to.equal(0);
        done();
      });
    });
  });

  it("should load the benchmark data when the benchmark dropdown is changed when no data for country is present", (done) => {
    let notifier = sinon.spy();
    wrapper.vm.$notify = notifier;
    moxios.wait(() => {
      wrapper
        .findAll(".benchmarkDropDown option")
        .at(1).element.selected = true;
      wrapper.find(".benchmarkDropDown").trigger("change");
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request
          .respondWith({
            status: 200,
            response: {},
          })
          .then(() => {
            expect(wrapper.vm.benchmarkData).to.deep.equal({});
            expect(wrapper.findAll(".benchmark-score").length).to.equal(0);
            sinon.assert.calledWith(notifier, {
              group: "custom-template",
              title: "No Data",
              text: "No countries in the selected phase for benchmarking",
              type: "warn",
            });
            done();
          });
      });
    });
  });

  it("should call error notifier when the benchmark API call is failed", (done) => {
    let errResp = {
      status: 500,
      response: { message: "problem" },
    };
    let notifier = sinon.spy();
    wrapper.vm.$notify = notifier;
    moxios.wait(() => {
      wrapper
        .findAll(".benchmarkDropDown option")
        .at(1).element.selected = true;
      wrapper.find(".benchmarkDropDown").trigger("change");
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.reject(errResp);
        moxios.wait(() => {
          expect(wrapper.vm.benchmarkData).to.deep.equal({});
          expect(wrapper.findAll(".benchmark-score").length).to.equal(0);
          sinon.assert.calledWith(notifier, {
            group: "custom-template",
            title: "Server Error",
            text: "Unable to load benchmark data. Please try after sometime",
            type: "error",
          });
          done();
        });
      });
    });
  });

  it(" should fetch phases", (done) => {
    wrapper.vm.fetchPhases();

    moxios.wait(() => {
      expect(wrapper.vm.phases).to.deep.equal(phaseData);
      done();
    });
  });

  it(" Update the countries summary on the function call", () => {
    wrapper.vm.onSummaryLoaded("Demo Text");
    expect(wrapper.vm.countrySummary).to.equal("Demo Text");
  });

  it("should render collected on date", (done) => {
    moxios.wait(() => {
      expect(wrapper.vm.collectedDate).to.equal("As on: January 2018");
      done();
    });
  });

  it("should render localization texts properly", (done) => {
    moxios.wait(() => {
      expect(wrapper.find(".export").find("a").text()).equal(
        i18n.messages.en.countryProfile.exportCountryDataButton
      );

      expect(wrapper.find(".download-btn").text()).equal(
        i18n.messages.en.countryProfile.downloadScorecard
      );

      expect(wrapper.findAll(".title .sub-header").at(0).text()).equal(
        i18n.messages.en.countryProfile.overallDigitalHealthPhase
      );

      expect(wrapper.findAll(".phase-desc").at(0).find("p").text()).equal(
        i18n.messages.en.countryProfile.overallDigitalHealthPhaseDescription
      );

      expect(wrapper.find(".benchmark-dropdown-container").text()).equal(
        i18n.messages.en.countryProfile.benchmark.text
      );

      expect(
        wrapper.find(".benchmarkDropDown").findAll("option").at(1).text()
      ).equal(
        i18n.messages.en.countryProfile.benchmark.benchmarkValues.globalAverage
      );

      expect(
        wrapper.find(".benchmarkDropDown").findAll("option").at(2).text()
      ).equal("Phase 1");

      expect(wrapper.findAll(".phase-desc").at(1).find("p").text()).equal(
        i18n.messages.en.countryProfile.benchmark.benchmarkDescription
      );

      expect(
        wrapper
          .findAll(".indicator-panel-container-category-section-phase")
          .at(0)
          .element.attributes.getNamedItem("data-phase").value
      ).equal("Phase 3");

      expect(wrapper.find(".indicator-name").text()).equal(
        i18n.messages.en.countryProfile.indicator
      );

      done();
    });
  });

  it("should render localization benchmark error text", (done) => {
    moxios.wait(() => {
      wrapper.setData({ hasBenchmarkData: false });
      expect(wrapper.findAll(".phase-desc").at(1).find("span").text()).equal(
        i18n.messages.en.countryProfile.benchmark
          .benchmarkNoCountryForSelectedPhase
      );
      done();
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });
});
