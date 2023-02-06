import { PDFDocument, StandardFonts, rgb, LineCapStyle } from "pdf-lib";
import colorObj from "../common/color-codes.js";
import common from "../../common/common";

// Primitive line break algorithm
const breakTextIntoLines = (text, size, font, maxWidth) => {
  const lines = [];
  let textIdx = 0;
  while (textIdx < text.length) {
    let line = "";
    while (textIdx < text.length) {
      if (text.charAt(textIdx) === "\n") {
        lines.push(line);
        textIdx += 1;
        line = "";
        continue;
      }
      const newLine = line + text.charAt(textIdx);
      if (font.widthOfTextAtSize(newLine, size) > maxWidth) break;
      line = newLine;
      textIdx += 1;
    }
    lines.push(line);
  }
  return lines;
};

const hexToRgb = (h) => {
  let r = 0,
    g = 0,
    b = 0;

  // 3 digits
  if (h.length == 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];

    // 6 digits
  } else if (h.length == 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }

  return rgb(+r / 255, +g / 255, +b / 255);
};

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
  const colorCodes = colorObj.getColorCodes();
  const title = i18n.t("scoreCardPDF.title", {
    country: healthIndicatorData.countryName,
  });
  // Move cursor to 60 points below the top of the page
  page.moveTo(50, page.getHeight() - 60);

  // Add Title in the document
  page.drawText(title, {
    font: helveticaBoldFont,
    size: 20,
    lineHeight: 20,
    maxWidth: 480,
  });

  page.moveDown(20 + Math.ceil(title.length / 50) * 10);

  // Write Collected Data in the document
  page.drawText(
    common.dateInLocaleFormat(healthIndicatorData.collectedDate, i18n),
    {
      font: helveticaBoldObliqueFont,
      size: 14,
      color: hexToRgb("#666"),
      lineHeight: 14,
    }
  );

  // Write Document Summary Heading in bold
  page.moveDown(50);
  page.drawText(i18n.t("countryProfile.countrySummary.text"), {
    size: 14,
    color: rgb(0, 0, 0),
    font: helveticaBoldFont,
    wordBreaks: [],
    lineHeight: 14,
  });

  // Write country Summary in a Paginated way
  // TODO: Explore if this can be made better
  page.moveDown(20);
  // split each line into an array as PDFKIT having problems in writing huge content
  let countrySummaryArray = countrySummary.split(/\.\n|\. |\.|;/);
  let splittedChar = countrySummary.match(/\.\n|\. |\.|;/g);

  if (countrySummary) {
    // for (let i = 0; i < countrySummaryArray.length - 1; i++) {
    //   if (
    //     countrySummaryArray[i].charAt(0).indexOf("\n") > -1 ||
    //     countrySummaryArray[i].charAt(0).indexOf("\r") > -1
    //   ) {
    //     page.drawText("", { x: 50, y: page.getY() });
    //     page.moveDown(20);
    //   }
    //   page.drawText(countrySummaryArray[i] + (splittedChar[i] || ""), {
    //     size: 14,
    //     font: helveticaFont,
    //     color: hexToRgb("#000"),
    //     x: page.getX(),
    //     y: page.getY(),
    //     maxWidth: 480,
    //     lineHeight: 14,
    //   });
    //   page.moveDown(30);
    // }
    const currentY = page.getY();
    const maxY = 30;
    const heightOfOneLine = helveticaFont.heightAtSize(14);
    const numberOfLinesThatCanFit = Math.ceil(
      (currentY - maxY) / heightOfOneLine
    );
    const linesToWrite = breakTextIntoLines(
      countrySummary,
      14,
      helveticaFont,
      480
    );

    if (linesToWrite.length < numberOfLinesThatCanFit) {
      page.drawText(countrySummary, {
        size: 14,
        font: helveticaFont,
        color: hexToRgb("#000"),
        maxWidth: 480,
        lineHeight: 14,
      });
    } else {
      const delimiter =
        countrySummary[numberOfLinesThatCanFit * 75] === " " ? null : "-";

      page.drawText(
        countrySummary.slice(0, numberOfLinesThatCanFit * 75) + delimiter,
        {
          size: 14,
          font: helveticaFont,
          color: hexToRgb("#000"),
          maxWidth: 480,
          lineHeight: 14,
        }
      );
      page = pdfDoc.addPage();
      page.moveTo(50, page.getHeight() - 30);
      page.drawText(
        delimiter +
          countrySummary.slice(
            numberOfLinesThatCanFit * 75,
            countrySummary.length
          ),
        {
          size: 14,
          font: helveticaFont,
          color: hexToRgb("#000"),
          maxWidth: 480,
          lineHeight: 14,
        }
      );
    }
    page = pdfDoc.addPage();
    page.moveTo(50, page.getHeight() - 30);
  } else {
    page.drawText("-", {
      size: 14,
      font: helveticaFont,
      color: hexToRgb("#000"),
      x: 50,
      y: page.getY(),
      maxWidth: 480,
      lineHeight: 14,
    });
  }

  if (benchmarkPhase) {
    let benchMarkPhaseValue =
      benchmarkPhase < 0
        ? i18n.t("countryProfile.benchmark.benchmarkValues.globalAverage")
        : i18n.t("scoreCardPDF.benchMarkPhaseValue", {
            benchmarkPhase: benchmarkPhase,
          });
    if (page.getY() <= 30) {
      page = pdfDoc.addPage();
      page.moveTo(50, page.getHeight() - 30);
    }
    page.moveDown(20);
    page.drawText(
      i18n.t("scoreCardPDF.benchmarkAgainstBenchmarkValue", {
        benchMarkPhaseValue: benchMarkPhaseValue,
      }),
      {
        size: 14,
        color: hexToRgb("#000"),
        font: helveticaBoldFont,
        x: 50,
        y: page.getY(),
        maxWidth: 500,
        lineHeight: 14,
      }
    );
    if (page.getY() <= 30) {
      page = pdfDoc.addPage();
      page.moveTo(50, page.getHeight() - 30);
    }
    page.moveDown(20);
    page.drawText(i18n.t("scoreCardPDF.noteForBenchmark"), {
      size: 12,
      color: hexToRgb("#666"),
      font: helveticaBoldObliqueFont,
      x: 50,
      y: page.getY(),
      lineHeight: 12,
    });

    if (!hasBenchmarkData) {
      if (page.getY() <= 30) {
        page = pdfDoc.addPage();
        page.moveTo(50, page.getHeight() - 30);
      }
      page.moveDown(20);
      page.drawText(
        i18n.t("countryProfile.benchmark.benchmarkNoCountryForSelectedPhase"),
        {
          size: 12,
          color: hexToRgb("#ed4c57"),
          font: helveticaBoldObliqueFont,
          x: 50,
          y: page.getY(),
          lineHeight: 12,
        }
      );
    }
  }

  if (page.getY() <= 30) {
    page = pdfDoc.addPage();
    page.moveTo(50, page.getHeight() - 30);
  }
  // Write overall digital health phase in the doc
  page.moveDown(20);
  page.drawText(i18n.t("countryProfile.overallDigitalHealthPhase"), {
    maxWidth: 500,
    size: 14,
    color: hexToRgb("#000"),
    font: helveticaBoldFont,
    x: 50,
    y: page.getY(),
    lineHeight: 14,
  });

  const countryPhase = healthIndicatorData.countryPhase
    ? healthIndicatorData.countryPhase.toString()
    : "NA";

  // Draw rectangle parallel to the overall health indicator and fill the score
  // TODO: Check roundedness
  page.drawRectangle({
    x: 500,
    y: page.getY() - 16,
    width: 32,
    height: 32,
    color: hexToRgb(getColorCodeForPhase(colorCodes, countryPhase)),
  });

  //  Write the country phase within the square
  page.drawText(countryPhase, {
    size: 14,
    font: helveticaFont,
    x: 512,
    y: page.getY() - 5,
    maxWidth: 32,
    color: hexToRgb("#FFF"),
    lineHeight: 14,
  });

  // Draw seperator between overall phase score and rest
  page.moveDown(30);
  page.drawLine({
    start: { x: 50, y: page.getY() },
    end: {
      x: 560,
      y: page.getY(),
    },
    thickness: 2,
    lineCap: LineCapStyle.Round,
    color: hexToRgb("#CCC"),
  });

  // iterate over each of the health indicator data
  healthIndicatorData.categories.forEach((category) => {
    if (page.getY() <= 200) {
      page = pdfDoc.addPage();
      page.moveTo(50, page.getHeight() - 30);
    }

    // Write Phase name
    page.moveDown(40);
    page.drawText(category.name, {
      font: helveticaBoldFont,
      size: 14,
      color: rgb(0, 0, 0),
      x: 50,
      y: page.getY() + 5,
      maxWidth: 500,
      lineHeight: 14,
    });

    if (page.getY() <= 120) {
      page = pdfDoc.addPage();
      page.moveTo(50, page.getHeight() - 30);
    }

    // Add  a Progress bar rounded line
    page.moveDown(30);
    page.drawLine({
      lineCap: LineCapStyle.Round,
      start: { x: 60, y: page.getY() + 10 },
      end: { x: 560, y: page.getY() + 10 },
      thickness: 10,
      color: hexToRgb("#CCC"),
    });

    const categoryPhase = category.phase ? category.phase.toString() : "NA";

    // TODO: Add text align center here
    if (!category.phase) {
      page.drawText(categoryPhase, {
        font: helveticaFont,
        color: hexToRgb("#FFF"),
        size: 12,
        x: 60,
        y: page.getY() + 5,
        maxWidth: 560,
        lineHeight: 12,
      });
    } else {
      // total width is 560px, 60 is the starting point
      const progressFillWidth = 60 + ((560 - 60) / 5) * Number(category.phase);
      page.drawLine({
        lineCap: LineCapStyle.Round,
        start: { x: 60, y: page.getY() + 10 },
        end: { x: progressFillWidth, y: page.getY() + 10 },
        thickness: 10,
        color: hexToRgb(getColorCodeForPhase(colorCodes, categoryPhase)),
      });

      // Write PhaseN in white in the Progress bar
      page.drawText(i18n.t("mixed.phaseN", { number: categoryPhase }), {
        font: helveticaFont,
        color: hexToRgb("#FFF"),
        size: 12,
        x: progressFillWidth - 50,
        y: page.getY() + 5,
        lineHeight: 12,
      });
    }

    let initialYVal = 0;
    let scoreYVal = 0;
    let endYVal = 0;
    category.indicators.forEach((indicator, index) => {
      if (page.getY() <= 120) {
        page = pdfDoc.addPage();
        page.moveTo(50, page.getHeight() - 30);
      }

      // Write category Code and Name
      page.moveDown(30);
      page.drawText(`${indicator.code}. ${indicator.name}`, {
        font: helveticaFont,
        size: 12,
        color: hexToRgb("#000"),
        x: 50,
        y: page.getY() + 5,
        maxWidth: 420,
        lineHeight: 12,
      });

      if (
        page.getY() <= 120 ||
        page.getY() + Math.floor(indicator.indicatorDescription.length / 83) <=
          160
      ) {
        page = pdfDoc.addPage();
        page.moveTo(50, page.getHeight() - 30);
      }

      // Write category description into the Doc
      page.moveDown(30 + 20 * Math.floor(indicator.name.length / 83));
      page.drawText(indicator.indicatorDescription, {
        size: 12,
        color: hexToRgb("#666"),
        font: helveticaObliqueFont,
        x: 50,
        y: page.getY() + 5,
        maxWidth: 420,
        lineHeight: 12,
      });

      if (
        page.getY() <= 120 ||
        page.getY() + Math.floor(indicator.scoreDescription.length / 83) <= 160
      ) {
        page = pdfDoc.addPage();
        page.moveTo(50, page.getHeight() - 30);
      }

      // Write score description into the Doc
      page.moveDown(
        30 + 20 * Math.floor(indicator.indicatorDescription.length / 83)
      );
      page.drawText(indicator.scoreDescription, {
        font: helveticaFont,
        x: 50,
        y: page.getY() + 5,
        maxWidth: 420,
        color: hexToRgb("#4A90E2"),
        size: 12,
        lineHeight: 12,
      });

      if (page.getY() <= 80) {
        page = pdfDoc.addPage();
        page.moveTo(50, page.getHeight() - 30);
      }

      page.moveDown(
        10 + 20 * Math.floor(indicator.scoreDescription.length / 83)
      );

      if (index !== category.indicators.length - 1) {
        // page.setLineWidth(0.5);
        page.drawLine({
          start: { x: 50, y: page.getY() },
          end: { x: 560, y: page.getY() },
          color: hexToRgb("#CCC"),
        });
      }

      //score box yValue computation startYVal + ((endYVal - startYVal) / 2) - ((scoreBoxHeight / 2) + (benchmark text height/ 2))

      // if (benchmarkData[indicator.id]) {
      //   //adjust benchmark height to align center (12px)
      //   scoreYVal = initialYVal + ((endYVal - initialYVal) / 2 - 32);
      // } else {
      //   scoreYVal = initialYVal + ((endYVal - initialYVal) / 2 - 16);
      // }
      let indicatorScore =
        indicator.score > 0 ? indicator.score.toString() : "NA";
      page.drawRectangle({
        x: 500,
        y: page.getY() + 20,
        width: 32,
        height: 32,
        color: hexToRgb(getColorCodeForPhase(colorCodes, indicatorScore)),
      });
      // doc
      //   .roundedRect(500, scoreYVal, 32, 32, 5)
      //   .fill(getColorCodeForPhase(colorCodes, indicatorScore));

      page.drawText(indicatorScore, {
        x: indicatorScore.length > 1 ? 507 : 512,
        y: page.getY() + 30,
        size: 14,
        font: helveticaBoldFont,
        maxWidth: 32,
        color: hexToRgb("#FFF"),
        lineHeight: 14,
      });

      if (page.getY() <= 80) {
        page = pdfDoc.addPage();
        page.moveTo(50, page.getHeight() - 30);
      }

      if (benchmarkData[indicator.id]) {
        page.moveDown(20);
        page.drawText(
          i18n.t("countryProfile.benchmark.textWithData", {
            data: benchmarkData[indicator.id].benchmarkScore,
          }),
          {
            size: 10,
            font: helveticaBoldFont,
            color: hexToRgb("#000"),
            x: 480,
            y: page.getY(),
            lineHeight: 10,
          }
        );

        switch (benchmarkData[indicator.id].benchmarkValue.toLowerCase()) {
          case "at":
            // TODO: align text center below
            page.drawText(
              i18n.t("countryProfile.benchmark.benchmarkValues.atAvg"),
              {
                size: 10,
                color: hexToRgb("#999999"),
                x: 480,
                y: page.getY(),
                lineHeight: 10,
              }
            );

            break;
          case "above":
            page.moveTo(480, page.getY() + 7);
            page.drawLine({
              start: { x: page.getX(), y: page.getY() },
              end: { x: 480, y: page.getY() + 7 },
              color: hexToRgb("#a92b35a"),
            });
            page.drawLine({
              start: { x: page.getX(), y: page.getY() },
              end: { x: 485, y: page.getY() },
              color: hexToRgb("#92b35a"),
            });
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
                color: hexToRgb("#92b35a"),
                x: 490,
                y: page.getY(),
                maxWidth: 60,
                lineHeight: 10,
              }
            );

            break;
          case "below":
            page.drawLine({
              start: { x: 480, y: page.getY() },
              end: { x: 490, y: page.getY() },
              color: hexToRgb("#ed4c57"),
            });
            page.drawLine({
              start: { x: 490, y: page.getY() },
              end: { x: 485, y: page.getY() + 7 },
              color: hexToRgb("#ed4c57"),
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
                color: hexToRgb("#ed4c57"),
                x: 490,
                y: page.getY(),
                maxWidth: 60,
                lineHeight: 10,
              }
            );
            break;
        }
      }
      // to reset doc.y position in PDFKit, As the doc.y position is updated as soon as we add text
      // page.moveTo(50, endYVal + 25);
    });
  });

  const pdfBytes = await pdfDoc.save();

  let blob = new Blob([pdfBytes], { type: "application/pdf" });
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
}

export function getColorCodeForPhase(colorCodes, phaseValue) {
  let filteredValue = colorCodes.filter(
    (colorVal) => colorVal.score === phaseValue
  );
  return filteredValue.length > 0 ? filteredValue[0].color : "#606060";
}
