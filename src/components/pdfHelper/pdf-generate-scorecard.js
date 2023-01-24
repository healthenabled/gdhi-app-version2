import { PDFDocument, StandardFonts, rgb, LineCapStyle } from "pdf-lib";
import colorObj from "../common/color-codes.js";
import common from "../../common/common";

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export async function generateScorecard(
  healthIndicatorData,
  countrySummary,
  benchmarkData,
  benchmarkPhase,
  hasBenchmarkData,
  i18n
) {
  const pdfDoc = await PDFDocument.create();

  // TODO: check how to add a margin of 50
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaObliqueFont = await pdfDoc.embedFont(
    StandardFonts.HelveticaOblique
  );
  const helveticaBoldObliqueFont = await pdfDoc.embedFont(
    StandardFonts.HelveticaBoldOblique
  );

  let page = pdfDoc.addPage();

  let yVal = 0;
  const colorCodes = colorObj.getColorCodes();
  const title = i18n.t("scoreCardPDF.title", {
    country: healthIndicatorData.countryName,
  });
  page.drawText(title, { font: helveticaBoldFont, size: 20 });
  page.drawText(
    common.dateInLocaleFormat(healthIndicatorData.collectedDate, i18n),
    { font: helveticaBoldObliqueFont, size: 14, color: rgb(102, 102, 102) }
  );

  page.moveDown(1);
  page.moveDown(1);
  page.drawText(i18n.t("countryProfile.countrySummary.text"), {
    size: 14,
    color: rgb(0, 0, 0),
    font: helveticaBoldFont,
  });
  page.drawText(countrySummary, {
    font: helveticaFont,
    size: 14,
    color: rgb(0, 0, 0),
  });
  // TODO: Check if the below logic is still needed with PDFLib
  // split each line into an array as PDFKIT having problems in writing huge content
  // let countrySummaryArray = countrySummary.split(/\.\n|\. |\.|;/);
  // let splittedChar = countrySummary.match(/\.\n|\. |\.|;/g);
  // if (countrySummary) {
  //   for (let i = 0; i < countrySummaryArray.length - 1; i++) {
  //     yVal = page.getHeight();
  //
  //     if (
  //       countrySummaryArray[i].charAt(0).indexOf("\n") > -1 ||
  //       countrySummaryArray[i].charAt(0).indexOf("\r") > -1
  //     ) {
  //       doc.text("", 50, yVal, {
  //         continued: false,
  //       });
  //       doc.moveDown();
  //       yVal = doc.y;
  //     }
  //     doc
  //       .fontSize(14)
  //       .font("Helvetica")
  //       .fillColor("#000")
  //       .text(countrySummaryArray[i] + (splittedChar[i] || ""), 50, yVal, {
  //         width: 480,
  //         continued: true,
  //       });
  //   }
  // } else {
  //   doc.fontSize(14).font("Helvetica").fillColor("#000").text("-", 50, yVal, {
  //     width: 480,
  //     continued: false,
  //   });
  // }

  page.moveDown(1);
  page.moveDown(1);
  yVal = page.getY();
  if (benchmarkPhase) {
    let benchMarkPhaseValue =
      benchmarkPhase < 0
        ? i18n.t("countryProfile.benchmark.benchmarkValues.globalAverage")
        : i18n.t("scoreCardPDF.benchMarkPhaseValue", {
            benchmarkPhase: benchmarkPhase,
          });

    page.drawText(
      i18n.t("scoreCardPDF.benchmarkAgainstBenchmarkValue", {
        benchMarkPhaseValue: benchMarkPhaseValue,
      }),
      {
        size: 14,
        color: rgb(0, 0, 0),
        font: helveticaBoldFont,
        x: 50,
        y: yVal,
      }
    );
    // doc
    //   .fontSize(14)
    //   .fillColor("#000000")
    //   .font("Helvetica-Bold")
    //   .text(
    //     i18n.t("scoreCardPDF.benchmarkAgainstBenchmarkValue", {
    //       benchMarkPhaseValue: benchMarkPhaseValue,
    //     }),
    //     50,
    //     yVal,
    //     {
    //       width: 500,
    //     }
    //   );

    page.drawText(i18n.t("scoreCardPDF.noteForBenchmark"), {
      size: 12,
      color: rgb(6, 6, 6),
      font: helveticaBoldObliqueFont,
      x: 50,
      y: page.getY(),
    });
    // doc
    //   .fontSize(12)
    //   .fillColor("#666")
    //   .font("Helvetica-Oblique")
    //   .text(i18n.t("scoreCardPDF.noteForBenchmark"), 50, doc.y, {
    //     width: 500,
    //   });
    !hasBenchmarkData &&
      page.drawText(
        i18n.t("countryProfile.benchmark.benchmarkNoCountryForSelectedPhase"),
        {
          size: 12,
          color: rgb(237, 67, 87),
          font: helveticaBoldObliqueFont,
        }
      );

    page.moveDown(1);
    page.moveDown(1);
    // doc.text(""); // to move the cursor to the recent yVal
  }
  yVal = page.getY();

  page.drawText(i18n.t("countryProfile.overallDigitalHealthPhase"), {
    maxWidth: 500,
    size: 14,
    color: rgb(0, 0, 0),
    font: helveticaBoldFont,
  });

  const countryPhase = healthIndicatorData.countryPhase
    ? healthIndicatorData.countryPhase.toString()
    : "NA";

  const rgbColor = hexToRgb(getColorCodeForPhase(colorCodes, countryPhase));
  page.drawRectangle({
    x: 500,
    y: yVal - 16,
    width: 32,
    height: 32,
    color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
  });

  // TODO: Check rounded ness
  // doc
  //   .roundedRect(500, yVal - 16, 32, 32, 5)
  //   .fill(getColorCodeForPhase(colorCodes, countryPhase));

  //TODO: Check align option and how to implement the same
  page.drawText(countryPhase, {
    x: 500,
    y: yVal - 6,
    maxWidth: 32,
    color: rgb(255, 255, 255),
  });
  // doc.fillColor("#FFF").text(countryPhase, 500, yVal - 6, {
  //   width: 32,
  //   align: "center",
  // });
  page.moveDown(1);
  page.moveDown(1);
  page.setLineWidth(2);
  page.moveTo(50, page.getY());

  page.drawLine({
    start: { x: 50, y: page.getY() },
    end: {
      x: 560,
      y: page.getY(),
    },
    color: rgb(hexToRgb("#CCC").r, hexToRgb("#CCC").g, hexToRgb("#CCC").b),
  });

  healthIndicatorData.categories.forEach((category) => {
    page.moveDown(1);
    page.moveDown(1);

    if (page.getY() + 150 > 840) {
      page = pdfDoc.addPage();
    }
    yVal = page.getY();

    page.drawText(category.name, {
      font: helveticaBoldFont,
      size: 14,
      color: rgb(0, 0, 0),
      x: 50,
      y: page.getY(),
      maxWidth: 500,
    });

    // doc.lineWidth(10);
    page.setLineWidth(10);
    page.drawLine({
      lineCap: LineCapStyle.Round,
      start: { x: 60, y: page.getY() + 10 },
      end: { x: 560, y: page.getY() + 10 },
      color: rgb(204, 204, 204),
    });

    const categoryPhase = category.phase ? category.phase.toString() : "NA";

    // TODO: Add text align center here
    if (!category.phase) {
      page.drawText(categoryPhase, {
        font: helveticaFont,
        color: rgb(256, 256, 256),
        size: 12,
        x: 60,
        y: page.getY() + 5,
        maxWidth: 560,
      });
    } else {
      // total width is 560px, 60 is the starting point
      const progressFillWidth = 60 + ((560 - 60) / 5) * Number(category.phase);
      page.drawLine({
        lineCap: LineCapStyle.Round,
        start: { x: 60, y: page.getY() + 10 },
        end: { x: progressFillWidth, y: page.getY() + 10 },
        color: getColorCodeForPhase(colorCodes, categoryPhase),
      });

      page.drawText(i18n.t("mixed.phaseN", { number: categoryPhase }), {
        font: helveticaFont,
        color: rgb(256, 256, 256),
        size: 12,
        x: progressFillWidth - 50,
        y: page.getY() + 5,
      });
    }

    page.moveDown(0.5);
    yVal = page.getY();
    let initialYVal = 0;
    let scoreYVal = 0;
    let endYVal = 0;
    category.indicators.forEach((indicator, index) => {
      if (page.getY() + 250 > 840) {
        page = pdfDoc.addPage();
      } else {
        page.moveDown(1);
      }
      initialYVal = page.getY();

      page.drawText(`${indicator.code}. ${indicator.name}`, {
        font: helveticaFont,
        size: 12,
        color: rgb(0, 0, 0),
        x: 50,
        y: page.getY(),
        maxWidth: 420,
      });

      page.drawText(indicator.indicatorDescription, {
        color: rgb(102, 102, 102),
        font: helveticaObliqueFont,
        x: 50,
        y: page.getY(),
        maxWidth: 420,
      });

      page.moveDown(1);
      page.drawText(indicator.scoreDescription, {
        font: helveticaFont,
        x: 50,
        y: page.getY(),
        maxWidth: 420,
        color: rgb(74, 144, 226),
      });

      endYVal = page.getY();

      page.moveDown(1);
      if (index !== category.indicators.length - 1) {
        page.setLineWidth(0.5);
        page.drawLine({
          start: { x: 50, y: endYVal + 15 },
          end: { x: 560, y: endYVal + 15 },
          color: rgb(204, 204, 204),
        });
      }

      page.moveDown(1);

      //score box yValue computation startYVal + ((endYVal - startYVal) / 2) - ((scoreBoxHeight / 2) + (benchmark text height/ 2))

      if (benchmarkData[indicator.id]) {
        //adjust benchmark height to align center (12px)
        scoreYVal = initialYVal + ((endYVal - initialYVal) / 2 - 32);
      } else {
        scoreYVal = initialYVal + ((endYVal - initialYVal) / 2 - 16);
      }
      let indicatorScore =
        indicator.score > 0 ? indicator.score.toString() : "NA";
      const rgbColorCodeForPhase = hexToRgb(
        getColorCodeForPhase(colorCodes, indicatorScore)
      );
      page.drawRectangle({
        x: 500,
        y: page.getY(),
        width: 32,
        height: 32,
        color: rgb(
          rgbColorCodeForPhase.r,
          rgbColorCodeForPhase.g,
          rgbColorCodeForPhase.b
        ),
      });
      // doc
      //   .roundedRect(500, scoreYVal, 32, 32, 5)
      //   .fill(getColorCodeForPhase(colorCodes, indicatorScore));

      page.drawText(indicatorScore, {
        x: 500,
        y: scoreYVal + 10,
        size: 14,
        font: helveticaBoldFont,
        maxWidth: 32,
        color: rgb(256, 256, 256),
      });

      if (benchmarkData[indicator.id]) {
        page.moveDown(0.75);
        page.drawText(
          i18n.t("countryProfile.benchmark.textWithData", {
            data: benchmarkData[indicator.id].benchmarkScore,
          }),
          {
            size: 10,
            font: helveticaBoldFont,
            color: rgb(0, 0, 0),
            x: 480,
            y: page.getY(),
          }
        );

        switch (benchmarkData[indicator.id].benchmarkValue.toLowerCase()) {
          case "at":
            // TODO: align text center below
            page.drawText(
              i18n.t("countryProfile.benchmark.benchmarkValues.atAvg"),
              {
                size: 10,
                color: rgb(153, 153, 153),
                x: 480,
                y: page.getY(),
              }
            );

            break;
          case "above":
            page.moveTo(480, page.getY() + 7);
            page.drawLine({ end: { x: 480, y: page.getY() + 7 } });
            page.drawLine({ end: { x: 485, y: page.getY() } });
            // TODI: Add fill color
            // doc
            //
            //   .lineTo(490, doc.y + 7)
            //   .lineTo(485, doc.y)
            //   .fill("#92b35a");
            page.drawText(
              i18n.t("countryProfile.benchmark.benchmarkValues.aboveAvg"),
              {
                size: 10,
                color: rgb(146, 179, 90),
                x: 490,
                y: page.getY(),
                maxWidth: 60,
              }
            );

            break;
          case "below":
            page.drawLine({
              start: { x: 480, y: page.getY() },
              end: { x: 490, y: page.getY() },
            });
            page.drawLine({
              start: { x: 490, y: page.getY() },
              end: { x: 485, y: page.getY() + 7 },
            });
            // TODO: Add fill color for below
            // doc
            //   .moveTo(480, doc.y)
            //   .lineTo(490, doc.y)
            //   .lineTo(485, doc.y + 7)
            //   .fill("#ed4c57");

            page.drawText(
              i18n.t("countryProfile.benchmark.benchmarkValues.belowAvg"),
              {
                size: 10,
                color: rgb(237, 76, 87),
                x: 490,
                y: page.getY(),
                maxWidth: 60,
              }
            );

            break;
        }
      }
      // to reset doc.y position in PDFKit, As the doc.y position is updated as soon as we add text
      page.moveTo(50, endYVal + 25);
    });
  });

  const pdfBytes = await pdfDoc.save();

  let blob = new Blob([pdfBytes], { type: "application/pdf" });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(
      blob,
      `${countrySummary.countryName} - Digital Health Questionnaire.pdf`
    );
  } else {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = `${countrySummary.countryName} - Digital Health Questionnaire.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

export function getColorCodeForPhase(colorCodes, phaseValue) {
  let filteredValue = colorCodes.filter(
    (colorVal) => colorVal.score === phaseValue
  );
  return filteredValue.length > 0 ? filteredValue[0].color : "#606060";
}
