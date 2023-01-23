import eventHandler from "../landing-map/map-event-handler.js";
import L from "leaflet";
import sinon from "sinon";

const countryIndices = [
  {
    countryId: "SGP",
    countryName: "Singapore",
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
  {
    countryId: "IND",
    countryName: "INDIA",
    countryPhase: 1,
    overallScore: 1,
    colorCode: "#BEDCE3",
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
    {
      type: "Feature",
      geometry: null,
      properties: {
        scalerank: 3,
        featurecla: "Admin-0 country",
        SU_A3: "IND",
        BRK_DIFF: 0,
        NAME: "India",
        NAME_LONG: "India",
        BRK_A3: "IND",
        BRK_NAME: "India",
        BRK_GROUP: "",
        ABBREV: "India",
      },
    },
  ],
};

describe("Event Handler", () => {
  let layer, mockLayer;
  beforeEach(() => {
    layer = L.geoJSON(geoData);
    mockLayer = sinon.mock(layer);
  });
  afterEach(() => {
    mockLayer.verify();
    mockLayer.restore();
  });
  it("should reset layer to original color", () => {
    layer.feature = {
      properties: {
        BRK_A3: "SGP",
      },
    };
    mockLayer
      .expects("setStyle")
      .once()
      .withArgs({ fillColor: "#11184B", fillOpacity: 0.95 });
    eventHandler.resetLayer(layer, countryIndices);
  });

  it("clicking a country with no previous country selected", () => {
    layer.feature = {
      properties: {
        BRK_A3: "SGP",
      },
    };
    mockLayer
      .expects("setStyle")
      .once()
      .withArgs({ fillColor: "#CF0A01", fillOpacity: 0.95 });
    const clickState = eventHandler.onCountryClick(layer, "", countryIndices);
    expect(clickState).to.equal("CLICK_ON");
  });

  it("clicking the country with previous selection", () => {
    layer.feature = {
      properties: {
        BRK_A3: "SGP",
      },
    };
    mockLayer
      .expects("setStyle")
      .once()
      .withArgs({ fillColor: "#BEDCE3", fillOpacity: 0.95 });

    mockLayer
      .expects("setStyle")
      .once()
      .withArgs({ fillColor: "#CF0A01", fillOpacity: 0.95 });

    const indLayer = Object.assign({}, layer);
    indLayer.feature = {
      properties: {
        BRK_A3: "IND",
      },
    };

    const clickState = eventHandler.onCountryClick(
      layer,
      indLayer,
      countryIndices
    );

    expect(clickState).to.equal("CLICK_ON");
  });

  it("clicking same country as selected before should return SELECT_COUNTRY", () => {
    layer.feature = {
      properties: {
        BRK_A3: "SGP",
      },
    };
    const clickState = eventHandler.onCountryClick(
      layer,
      layer,
      countryIndices
    );
    expect(clickState).to.equal("SELECT_COUNTRY");
  });

  it("calling onMouseOver should update the fillOpacity", () => {
    layer.feature = {
      properties: {
        BRK_A3: "SGP",
      },
    };
    mockLayer.expects("setStyle").once().withArgs({ fillOpacity: 0.65 });
    eventHandler.onMouseMove(layer);
  });

  it("calling onMouseOver should update the fillOpacity", () => {
    layer.feature = {
      properties: {
        BRK_A3: "SGP",
      },
    };
    mockLayer.expects("setStyle").once().withArgs({ fillOpacity: 0.95 });
    eventHandler.onMouseOut(layer);
  });

  it("Trigerring a country which is not present should reset previous selection", () => {
    layer.feature = {
      properties: {
        BRK_A3: "SGP",
      },
    };
    mockLayer
      .expects("setStyle")
      .once()
      .withArgs({ fillColor: "#11184B", fillOpacity: 0.95 });
    const clickState = eventHandler.onCountryClick("", layer, countryIndices);

    expect(clickState).to.equal("COUNTRY_NOT_FOUND");
  });
});
