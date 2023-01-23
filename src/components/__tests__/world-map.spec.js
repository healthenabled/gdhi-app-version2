import worldMap from "../landing-map/world-map.js";
import eventHandler from "../landing-map/map-event-handler";
import L from "leaflet";
import sinon from "sinon";

const countryIndices = [
  {
    countryId: "AFG",
    countryName: "Afghanistan",
    countryPhase: 5,
    overallScore: 4.75,
    colorCode: "#11184B",
    categories: [
      {
        id: 1,
        name: "Leadership and Governance",
        overallScore: 4.5,
        phase: 5,
        indicators: [
          {
            id: 1,
            indicatorDescription:
              "Does the country have a separate department / agency / " +
              "national working group for digital health?",
            name:
              "Digital health prioritized at the national level through dedicated bodies / " +
              "mechanisms for governance",
            score: 4,
            scoreDescription:
              "Governance structure is fully-functional, government-led, consults" +
              "with other ministries, and monitors implementation of digital health based on a work" +
              "plan.",
            supportingText: null,
          },
        ],
      },
    ],
  },
];

const geoData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: null,
      properties: {
        scalerank: 3,
        featurecla: "Admin-0 country",
        SU_A3: "SGP",
        BRK_DIFF: 0,
        NAME: "Singapore",
        NAME_LONG: "Singapore",
        BRK_A3: "SGP",
        BRK_NAME: "Singapore",
        BRK_GROUP: "",
        ABBREV: "Sing.",
      },
    },
  ],
};

describe("World Map", () => {
  let layer, mockLayer, callback, callBackSpy, mapStub;

  beforeEach(() => {
    mapStub = sinon.stub(worldMap, "drawMap").callsFake(function () {
      this.map = {
        fitBounds: function () {
          console.log("fitting bounds");
        },
        setView: function () {
          console.log("setting view");
        },
      };
    });
    worldMap.drawMap({}, function () {});
    worldMap.lastClickedCountry = {};
    layer = L.geoJSON(geoData);
    mockLayer = sinon.mock(layer);

    callback = function a(arg1) {
      console.log();
    };
    callBackSpy = sinon.spy(callback);
  });

  afterEach(() => {
    sinon.assert.called(mapStub);
    mockLayer.restore();
    mapStub.restore();
  });

  it("should zoom and pass country name on clicking country", () => {
    layer.feature = {
      properties: {
        BRK_A3: "AFG",
        NAME_LONG: "Afghanistan",
      },
    };

    worldMap.handleClick(layer, "AFG", "", countryIndices, callBackSpy);
    sinon.assert.calledOnce(callBackSpy);
    expect(callBackSpy.getCall(0).args[0].type).to.equal("COUNTRY");
    expect(callBackSpy.getCall(0).args[0].countryCode).to.equal("AFG");
    expect(callBackSpy.getCall(0).args[0].countryName).to.equal("Afghanistan");
    expect(worldMap.lastClickedCountry).to.equal(layer);
  });

  it("should reset map and redirect to country page", () => {
    window = {
      location: {
        href: "",
      },
    };
    layer.feature = {
      properties: {
        BRK_A3: "AFG",
        NAME_LONG: "Afghanistan",
      },
    };
    let mockFn = sinon.stub(eventHandler, "resetLayer").callsFake(() => {});
    worldMap.handleClick(layer, "AFG", layer, countryIndices, callBackSpy);
    expect(window.location.href).to.equal("/country_profile/AFG");
    eventHandler.resetLayer.restore();
  });

  it("should not redirect to country page when indices data not found", () => {
    window = {
      location: {
        href: "",
      },
    };
    layer.feature = {
      properties: {
        BRK_A3: "AFG",
        NAME_LONG: "Afghanistan",
      },
    };
    let mockFn = sinon.stub(eventHandler, "resetLayer").callsFake(() => {});
    worldMap.handleClick(layer, "AFG", layer, [], callBackSpy);
    expect(window.location.href).to.equal("");
    eventHandler.resetLayer.restore();
  });

  it("should handleSearch", () => {
    layer.feature = {
      properties: {
        BRK_A3: "AFG",
        NAME_LONG: "Afghanistan",
      },
    };

    worldMap.geoLayer = {
      _layers: { 1: layer },
    };
    let mockFn = sinon.stub(worldMap, "handleClick").callsFake(() => {});
    worldMap.handleSearch("AFG", callBackSpy);
    expect(mockFn.getCall(0).args[0]).to.deep.equal(layer);
    expect(mockFn.getCall(0).args[1]).to.deep.equal("AFG");
    worldMap.handleClick.restore();
  });

  it("should reset map and pass country code on clicking unknown country", () => {
    layer.feature = {
      properties: {
        BRK_A3: "SIA",
        NAME_LONG: "",
      },
    };
    worldMap.lastClickedCountry = layer;
    worldMap.handleClick("", "SIA", layer, countryIndices, callBackSpy);
    sinon.assert.calledOnce(callBackSpy);
    expect(callBackSpy.getCall(0).args[0].type).to.equal("COUNTRY");
    expect(callBackSpy.getCall(0).args[0].countryCode).to.equal("SIA");
    expect(callBackSpy.getCall(0).args[0].countryName).to.equal("");
    expect(worldMap.lastClickedCountry).to.equal("");
  });

  it("should reset the lastClickedCountry when reset is called", () => {
    let mockFn = sinon.stub(eventHandler, "resetLayer").callsFake(() => {});
    worldMap.resetMap(callBackSpy);
    sinon.assert.calledOnce(callBackSpy);

    expect(worldMap.lastClickedCountry).to.equal("");
    eventHandler.resetLayer.restore();
  });
});
