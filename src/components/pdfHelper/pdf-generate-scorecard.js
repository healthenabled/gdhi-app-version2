import blobStream from "blob-stream";
import colorObj from "../common/color-codes.js";
import common from "../../common/common";

export function generateScorecard(
  healthIndicatorData,
  countrySummary,
  benchmarkData,
  benchmarkPhase,
  hasBenchmarkData,
  i18n
) {
  let doc = new PDFDocument({
    margin: 50,
  });
  let stream = doc.pipe(blobStream());
  let yVal = 0;

  const colorCodes = colorObj.getColorCodes();
  const title = i18n.t("scoreCardPDF.title", {
    country: healthIndicatorData.countryName,
  });
  doc.fontSize(20).font("Helvetica-Bold").text(title);

  doc
    .fontSize(14)
    .font("Helvetica-BoldOblique")
    .fillColor("#666")
    .text(common.dateInLocaleFormat(healthIndicatorData.collectedDate, i18n));
  doc.moveDown();
  doc.moveDown();

  doc
    .fontSize(14)
    .fillColor("#000000")
    .font("Helvetica-Bold")
    .text(i18n.t("countryProfile.countrySummary.text"));

  // split each line into an array as PDFKIT having problems in writing huge content
  let countrySummaryArray = countrySummary.split(/\.\n|\. |\.|;/);
  let splittedChar = countrySummary.match(/\.\n|\. |\.|;/g);
  if (countrySummary) {
    for (let i = 0; i < countrySummaryArray.length - 1; i++) {
      yVal = doc.y;

      if (
        countrySummaryArray[i].charAt(0).indexOf("\n") > -1 ||
        countrySummaryArray[i].charAt(0).indexOf("\r") > -1
      ) {
        doc.text("", 50, yVal, {
          continued: false,
        });
        doc.moveDown();
        yVal = doc.y;
      }
      doc
        .fontSize(14)
        .font("Helvetica")
        .fillColor("#000")
        .text(countrySummaryArray[i] + (splittedChar[i] || ""), 50, yVal, {
          width: 480,
          continued: true,
        });
    }
  } else {
    doc.fontSize(14).font("Helvetica").fillColor("#000").text("-", 50, yVal, {
      width: 480,
      continued: false,
    });
  }

  doc.text("", 50, doc.y, {
    continued: false,
  });
  doc.moveDown();
  doc.moveDown();
  yVal = doc.y;
  if (benchmarkPhase) {
    let benchMarkPhaseValue =
      benchmarkPhase < 0
        ? i18n.t("countryProfile.benchmark.benchmarkValues.globalAverage")
        : i18n.t("scoreCardPDF.benchMarkPhaseValue", {
            benchmarkPhase: benchmarkPhase,
          });

    doc
      .fontSize(14)
      .fillColor("#000000")
      .font("Helvetica-Bold")
      .text(
        i18n.t("scoreCardPDF.benchmarkAgainstBenchmarkValue", {
          benchMarkPhaseValue: benchMarkPhaseValue,
        }),
        50,
        yVal,
        {
          width: 500,
        }
      );
    doc
      .fontSize(12)
      .fillColor("#666")
      .font("Helvetica-Oblique")
      .text(i18n.t("scoreCardPDF.noteForBenchmark"), 50, doc.y, {
        width: 500,
      });
    !hasBenchmarkData &&
      doc
        .fontSize(12)
        .fillColor("#ed4c57")
        .font("Helvetica-Oblique")
        .text(
          i18n.t("countryProfile.benchmark.benchmarkNoCountryForSelectedPhase")
        );
    doc.moveDown();
    doc.moveDown();
    doc.text(""); // to move the cursor to the recent yVal
  }
  yVal = doc.y;

  doc
    .fontSize(14)
    .fillColor("#000000")
    .font("Helvetica-Bold")
    .text(i18n.t("countryProfile.overallDigitalHealthPhase"), {
      width: 500,
    });
  const countryPhase = healthIndicatorData.countryPhase
    ? healthIndicatorData.countryPhase.toString()
    : "NA";
  doc
    .roundedRect(500, yVal - 16, 32, 32, 5)
    .fill(getColorCodeForPhase(colorCodes, countryPhase));

  doc.fillColor("#FFF").text(countryPhase, 500, yVal - 6, {
    width: 32,
    align: "center",
  });
  doc.moveDown();
  doc.moveDown();

  doc.lineWidth(2);

  doc.moveTo(50, doc.y).lineTo(560, doc.y).strokeColor("#CCC").stroke();

  healthIndicatorData.categories.forEach((category) => {
    doc.moveDown();
    doc.moveDown();

    if (doc.y + 150 > 840) {
      doc.addPage();
    }
    yVal = doc.y;
    doc
      .fontSize(14)
      .fillColor("#000000")
      .font("Helvetica-Bold")
      .text(category.name, 50, doc.y, {
        width: 500,
      });

    doc.lineWidth(10);

    doc
      .lineCap("round")
      .moveTo(60, doc.y + 10)
      .lineTo(560, doc.y + 10)
      .strokeColor("#CCC")
      .stroke();
    const categoryPhase = category.phase ? category.phase.toString() : "NA";

    if (!category.phase) {
      doc
        .font("Helvetica")
        .fillColor("#FFF")
        .fontSize(12)
        .text(categoryPhase, 60, doc.y + 5, {
          width: 560,
          align: "center",
        });
    } else {
      // total width is 560px, 60 is the starting point
      const progressFillWidth = 60 + ((560 - 60) / 5) * Number(category.phase);
      doc
        .lineCap("round")
        .moveTo(60, doc.y + 10)
        .lineTo(progressFillWidth, doc.y + 10)
        .strokeColor(getColorCodeForPhase(colorCodes, categoryPhase))
        .stroke();
      doc
        .font("Helvetica")
        .fillColor("#FFF")
        .fontSize(12)
        .text(
          i18n.t("mixed.phaseN", { number: categoryPhase }),
          progressFillWidth - 50,
          doc.y + 5
        );
    }

    doc.moveDown(0.5);
    yVal = doc.y;
    let initialYVal = 0;
    let scoreYVal = 0;
    let endYVal = 0;
    category.indicators.forEach((indicator, index) => {
      if (doc.y + 250 > 840) {
        doc.addPage();
      } else {
        doc.moveDown();
      }
      initialYVal = doc.y;
      doc
        .font("Helvetica")
        .fontSize(12)
        .fillColor("#000")
        .text(`${indicator.code}. ${indicator.name}`, 50, doc.y, {
          width: 420,
        });
      doc
        .fillColor("#666")
        .font("Helvetica-Oblique")
        .text(indicator.indicatorDescription, 50, doc.y, {
          width: 420,
        });
      doc.moveDown();
      doc
        .fillColor("#4A90E2")
        .font("Helvetica")
        .text(indicator.scoreDescription, 50, doc.y, {
          width: 420,
        });

      endYVal = doc.y;

      doc.moveDown();
      if (index !== category.indicators.length - 1) {
        doc.lineWidth(0.5);
        doc
          .moveTo(50, endYVal + 15)
          .lineTo(560, endYVal + 15)
          .strokeColor("#CCC")
          .stroke();
      }

      doc.moveDown();

      //score box yValue computation startYVal + ((endYVal - startYVal) / 2) - ((scoreBoxHeight / 2) + (benchmark text height/ 2))

      if (benchmarkData[indicator.id]) {
        //adjust benchmark height to align center (12px)
        scoreYVal = initialYVal + ((endYVal - initialYVal) / 2 - 32);
      } else {
        scoreYVal = initialYVal + ((endYVal - initialYVal) / 2 - 16);
      }
      let indicatorScore =
        indicator.score > 0 ? indicator.score.toString() : "NA";
      doc
        .roundedRect(500, scoreYVal, 32, 32, 5)
        .fill(getColorCodeForPhase(colorCodes, indicatorScore));

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .fillColor("#FFF")
        .text(indicatorScore, 500, scoreYVal + 10, {
          width: 32,
          align: "center",
        });
      if (benchmarkData[indicator.id]) {
        doc.moveDown(0.75);
        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .fillColor("#000")
          .text(
            i18n.t("countryProfile.benchmark.textWithData", {
              data: benchmarkData[indicator.id].benchmarkScore,
            }),
            480,
            doc.y
          );
        switch (benchmarkData[indicator.id].benchmarkValue.toLowerCase()) {
          case "at":
            doc
              .fontSize(10)
              .fillColor("#999999")
              .text(
                i18n.t("countryProfile.benchmark.benchmarkValues.atAvg"),
                480,
                doc.y,
                {
                  width: 80,
                  align: "center",
                }
              );
            break;
          case "above":
            doc
              .moveTo(480, doc.y + 7)
              .lineTo(490, doc.y + 7)
              .lineTo(485, doc.y)
              .fill("#92b35a");
            doc
              .fontSize(10)
              .fillColor("#92b35a")
              .text(
                i18n.t("countryProfile.benchmark.benchmarkValues.aboveAvg"),
                490,
                doc.y,
                {
                  width: 60,
                  align: "center",
                }
              );
            break;
          case "below":
            doc
              .moveTo(480, doc.y)
              .lineTo(490, doc.y)
              .lineTo(485, doc.y + 7)
              .fill("#ed4c57");
            doc
              .fontSize(10)
              .fillColor("#ed4c57")
              .text(
                i18n.t("countryProfile.benchmark.benchmarkValues.belowAvg"),
                490,
                doc.y,
                {
                  width: 60,
                  align: "center",
                }
              );
            break;
        }
      }
      // to reset doc.y position in PDFKit, As the doc.y position is updated as soon as we add text
      doc.text("", 50, endYVal + 25);
    });
  });

  stream.on("finish", () => {
    let blob = stream.toBlob("application/pdf");
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(
        blob,
        `${healthIndicatorData.countryName} - Scorecard.pdf`
      );
    } else {
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      let url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = `${healthIndicatorData.countryName} - Scorecard.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  });
  doc.end();
}

export function getColorCodeForPhase(colorCodes, phaseValue) {
  let filteredValue = colorCodes.filter(
    (colorVal) => colorVal.score === phaseValue
  );
  return filteredValue.length > 0 ? filteredValue[0].color : "#606060";
}
