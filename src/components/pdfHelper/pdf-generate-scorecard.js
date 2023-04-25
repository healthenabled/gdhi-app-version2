import { PDFDocument, StandardFonts, rgb, LineCapStyle } from "pdf-lib";
import colorObj from "../common/color-codes.js";
import common from "../../common/common";
import { hexToRgb, roundedRectData, breakTextIntoLines } from "./pdfUtils";

const MIN_X = 70;
const MAX_WIDTH = 480;

export async function generateScorecard({
  healthIndicatorData,
  countrySummary,
  benchmarkData,
  benchmarkPhase,
  hasBenchmarkData,
  i18n,
  govtApproved,
  selectedYear,
}) {
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
  page.moveTo(70, page.getHeight() - 60);

  // Add Title in the document
  page.drawText(title, {
    font: helveticaBoldFont,
    size: 20,
    lineHeight: 20,
    maxWidth: MAX_WIDTH,
  });

  const handlePagination = () => {
    if (page.getY() <= 70) {
      page = pdfDoc.addPage();
      page.moveTo(MIN_X, page.getHeight() - 60);
    }
  };

  const drawTextWithPagination = (payloadText, options) => {
    let currentY = page.getY();
    const maxY = 70;
    const heightOfOneLine = options.font.heightAtSize(options.size);
    const numberOfLinesThatCanFit = Math.ceil(
      (currentY - maxY) / heightOfOneLine
    );
    const numberOfLinesToWrite = breakTextIntoLines(
      payloadText,
      options.size,
      options.font,
      options.maxWidth
    ).length;
    if (numberOfLinesToWrite < numberOfLinesThatCanFit) {
      //lines fit in one page
      page.drawText(payloadText, options);
      page.moveDown(15 + heightOfOneLine * numberOfLinesToWrite);
      handlePagination();
    } else {
      //and lines will overflow in this case.Hence, we need delimiters
      const numberOfCharactersInOneLine =
        payloadText.length / numberOfLinesToWrite;
      const firstPartOfLines = payloadText.slice(
        0,
        numberOfLinesThatCanFit * numberOfCharactersInOneLine
      );
      const secondPartOfLines = payloadText.slice(
        numberOfLinesThatCanFit * numberOfCharactersInOneLine,
        payloadText.length
      );

      let delimiter = "";
      if (
        firstPartOfLines[firstPartOfLines.length - 1]?.match(/[a-z]/i) &&
        secondPartOfLines[0]?.match(/[a-z]/i)
      ) {
        delimiter = "-";
      }

      page.drawText(firstPartOfLines + delimiter, options);
      page = pdfDoc.addPage();
      page.moveTo(MIN_X, page.getHeight() - 60);
      const numberOfLinesInTheSecondPart = breakTextIntoLines(
        secondPartOfLines,
        options.size,
        options.font,
        options.maxWidth
      ).length;
      page.drawText(delimiter + secondPartOfLines, {
        ...options,
        x: MIN_X,
        y: page.getHeight() - 60,
      });
      page.moveDown(30 + heightOfOneLine * numberOfLinesInTheSecondPart);
    }
  };

  page.moveDown(20 + Math.ceil(title.length / 50) * 10);

  // Write Collected Data in the document
  page.drawText(
    common.dateInLocaleFormat(healthIndicatorData.updatedDate, i18n),
    {
      font: helveticaBoldObliqueFont,
      size: 14,
      color: hexToRgb("#666"),
      lineHeight: 14,
    }
  );

  page.moveDown(20);
  if (govtApproved) {
    drawTextWithPagination("Government Approved: True", {
      font: helveticaBoldFont,
      size: 14,
      maxWidth: MAX_WIDTH,
      lineHeight: 14,
    });
  } else {
    drawTextWithPagination("Government Approved: False", {
      font: helveticaBoldFont,
      size: 14,
      maxWidth: MAX_WIDTH,
      lineHeight: 14,
    });
  }
  // Write Document Summary Heading in bold
  page.moveDown(30);
  drawTextWithPagination(
    i18n.t("healthIndicatorQuestionnaire.contactForm.countrySummary"),
    { font: helveticaBoldFont, size: 12, lineHeight: 12, maxWidth: MAX_WIDTH }
  );
  if (countrySummary) {
    drawTextWithPagination(countrySummary, {
      font: helveticaFont,
      size: 14,
      maxWidth: MAX_WIDTH,
      lineHeight: 14,
    });
  } else {
    page.drawText("-", {
      size: 14,
      font: helveticaFont,
      color: hexToRgb("#000"),
      x: MIN_X,
      y: page.getY(),
      maxWidth: MAX_WIDTH,
      lineHeight: 14,
    });
    page.moveDown(20);
  }
  // Write country Summary in a Paginated way

  page = pdfDoc.addPage();

  page.moveTo(MIN_X, page.getHeight() - 80);

  drawTextWithPagination(i18n.t("scoreCardPDF.spiderGraphTitle"), {
    font: helveticaBoldFont,
    size: 12,
    lineHeight: 12,
    maxWidth: MAX_WIDTH,
  });

  const phaseOverviewSpiderGraph = document.getElementById(
    "phase-overview-spider-graph"
  );
  const imgSrc = phaseOverviewSpiderGraph?.toDataURL();
  const pngImage = await pdfDoc.embedPng(imgSrc);
  const pngDims = pngImage.scale(0.4);

  page.moveDown(pngDims.height - 10);
  page.drawImage(pngImage, {
    x: MIN_X,
    y: page.getY(),
    width: pngDims.width,
    height: pngDims.height,
  });

  const lineChart = document.getElementById("line-chart");
  const imgSrcTwo = lineChart?.toDataURL();
  const dataUrlMinLength = 6;
  if (imgSrcTwo.length > dataUrlMinLength) {
    page = pdfDoc.addPage();

    page.moveTo(MIN_X, page.getHeight() - 60);

    page.drawText(i18n.t("scoreCardPDF.lineChartTitle"), {
      font: helveticaBoldFont,
      size: 12,
      lineHeight: 12,
      maxWidth: MAX_WIDTH,
    });
    page.drawText(selectedYear, {
      font: helveticaBoldFont,
      x: 260,
      size: 12,
      lineHeight: 12,
      maxWidth: MAX_WIDTH,
    });

    const pngImageTwo = await pdfDoc.embedPng(imgSrcTwo);
    const pngDimsTwo = pngImageTwo.scale(0.17);
    page.drawImage(pngImageTwo, {
      x: page.getWidth() / 2 - pngDimsTwo.width / 2,
      y: page.getHeight() / 2 - pngDimsTwo.height / 2,
      width: pngDimsTwo.width,
      height: pngDimsTwo.height,
    });
  }

  page = pdfDoc.addPage();

  page.moveTo(MIN_X, page.getHeight() - 60);

  if (benchmarkPhase) {
    let benchMarkPhaseValue =
      benchmarkPhase < 0
        ? i18n.t("countryProfile.benchmark.benchmarkValues.globalAverage")
        : i18n.t("scoreCardPDF.benchMarkPhaseValue", {
            benchmarkPhase: benchmarkPhase,
          });
    if (page.getY() <= 30) {
      page = pdfDoc.addPage();
      page.moveTo(MIN_X, page.getHeight() - 30);
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
        x: MIN_X,
        y: page.getY(),
        maxWidth: 500,
        lineHeight: 14,
      }
    );
    if (page.getY() <= 30) {
      page = pdfDoc.addPage();
      page.moveTo(MIN_X, page.getHeight() - 30);
    }
    page.moveDown(20);

    const noteForBenchmark = i18n.t("scoreCardPDF.noteForBenchmark");
    const noteForBenchmarkLength = noteForBenchmark.length;
    page.drawText(i18n.t("scoreCardPDF.noteForBenchmark"), {
      size: 12,
      color: hexToRgb("#666"),
      font: helveticaBoldObliqueFont,
      maxWidth: 500,
      x: MIN_X,
      y: page.getY(),
      lineHeight: 12,
    });
    page.moveDown(20 + Math.ceil(noteForBenchmarkLength / 104) * 12);
    if (!hasBenchmarkData) {
      if (page.getY() <= 30) {
        page = pdfDoc.addPage();
        page.moveTo(MIN_X, page.getHeight() - 30);
      }
      page.moveDown(40);
      page.drawText(
        i18n.t("countryProfile.benchmark.benchmarkNoCountryForSelectedPhase"),
        {
          size: 12,
          color: hexToRgb("#ed4c57"),
          font: helveticaBoldObliqueFont,
          x: MIN_X,
          y: page.getY(),
          lineHeight: 12,
        }
      );
    }
  }

  if (page.getY() <= 30) {
    page = pdfDoc.addPage();
    page.moveTo(MIN_X, page.getHeight() - 30);
  }
  // Write overall digital health phase in the doc
  page.moveDown(20);
  page.drawText(i18n.t("countryProfile.overallDigitalHealthPhase"), {
    maxWidth: 500,
    size: 14,
    color: hexToRgb("#000"),
    font: helveticaBoldFont,
    x: MIN_X,
    y: page.getY(),
    lineHeight: 14,
  });

  const countryPhase = healthIndicatorData.countryPhase
    ? healthIndicatorData.countryPhase.toString()
    : "NA";

  // Draw rectangle parallel to the overall health indicator and fill the score
  page.drawSvgPath(roundedRectData(32, 32, 5, 5, 5, 5), {
    x: 500,
    y: page.getY() + 16,
    borderLineCap: LineCapStyle.Round,
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
    start: { x: MIN_X, y: page.getY() },
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
      page.moveTo(MIN_X, page.getHeight() - 30);
    }

    // Write Phase name
    page.moveDown(40);
    page.drawText(category.name, {
      font: helveticaBoldFont,
      size: 14,
      color: rgb(0, 0, 0),
      x: MIN_X,
      y: page.getY() + 5,
      maxWidth: 500,
      lineHeight: 14,
    });

    if (page.getY() <= 120) {
      page = pdfDoc.addPage();
      page.moveTo(MIN_X, page.getHeight() - 30);
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

    category.indicators.forEach((indicator, index) => {
      if (page.getY() <= 120) {
        page = pdfDoc.addPage();
        page.moveTo(MIN_X, page.getHeight() - 30);
      }

      // Write category Code and Name
      page.moveDown(30);
      page.drawText(`${indicator.code}. ${indicator.name}`, {
        font: helveticaFont,
        size: 12,
        color: hexToRgb("#000"),
        x: MIN_X,
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
        page.moveTo(MIN_X, page.getHeight() - 30);
      }

      // Write category description into the Doc
      page.moveDown(30 + 20 * Math.floor(indicator.name.length / 83));
      page.drawText(indicator.indicatorDescription, {
        size: 12,
        color: hexToRgb("#666"),
        font: helveticaObliqueFont,
        x: MIN_X,
        y: page.getY() + 5,
        maxWidth: 420,
        lineHeight: 12,
      });

      if (
        page.getY() <= 120 ||
        page.getY() + Math.floor(indicator.scoreDescription.length / 83) <= 160
      ) {
        page = pdfDoc.addPage();
        page.moveTo(MIN_X, page.getHeight() - 30);
      }

      // Write score description into the Doc
      page.moveDown(
        30 + 20 * Math.floor(indicator.indicatorDescription.length / 83)
      );
      page.drawText(indicator.scoreDescription, {
        font: helveticaFont,
        x: MIN_X,
        y: page.getY() + 5,
        maxWidth: 420,
        color: hexToRgb("#4A90E2"),
        size: 12,
        lineHeight: 12,
      });

      if (page.getY() <= 80) {
        page = pdfDoc.addPage();
        page.moveTo(MIN_X, page.getHeight() - 30);
      }

      page.moveDown(
        10 + 20 * Math.floor(indicator.scoreDescription.length / 83)
      );

      if (index !== category.indicators.length - 1) {
        page.drawLine({
          start: { x: MIN_X, y: page.getY() },
          end: { x: 560, y: page.getY() },
          color: hexToRgb("#CCC"),
        });
      }

      let indicatorScore =
        indicator.score > 0 ? indicator.score.toString() : "NA";

      page.drawSvgPath(roundedRectData(32, 32, 5, 5, 5, 5), {
        x: 500,
        y: page.getY() + 95,
        borderLineCap: LineCapStyle.Round,
        color: hexToRgb(getColorCodeForPhase(colorCodes, indicatorScore)),
      });

      page.drawText(indicatorScore, {
        x: indicatorScore.length > 1 ? 507 : 512,
        y: page.getY() + 75,
        size: 14,
        font: helveticaBoldFont,
        maxWidth: 32,
        color: hexToRgb("#FFF"),
        lineHeight: 14,
      });

      if (page.getY() <= 80) {
        page = pdfDoc.addPage();
        page.moveTo(MIN_X, page.getHeight() - 30);
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
            x: MAX_WIDTH,
            y: page.getY() + 70,
            lineHeight: 10,
          }
        );
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
  return filteredValue.length > 0 ? filteredValue[0].color : "#6C757D";
}
