import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

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
export async function generateFormPDF(
  countrySummary,
  questionnaire,
  healthIndicators,
  i18n
) {
  const pdfDoc = await PDFDocument.create();

  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldObliqueFont = await pdfDoc.embedFont(
    StandardFonts.HelveticaBoldOblique
  );

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

      let delimiter;
      if (
        firstPartOfLines[firstPartOfLines.length - 1]?.match(/[a-z]/i) &&
        secondPartOfLines[0]?.match(/[a-z]/i)
      ) {
        delimiter = "-";
      }

      page.drawText(firstPartOfLines + delimiter, options);
      page = pdfDoc.addPage();
      page.moveTo(70, page.getHeight() - 60);
      const numberOfLinesInTheSecondPart = breakTextIntoLines(
        secondPartOfLines,
        options.size,
        options.font,
        options.maxWidth
      ).length;
      page.drawText(delimiter + secondPartOfLines, {
        ...options,
        x: 70,
        y: page.getHeight() - 60,
      });
      page.moveDown(30 + heightOfOneLine * numberOfLinesInTheSecondPart);
    }
  };
  const handlePagination = () => {
    if (page.getY() <= 70) {
      page = pdfDoc.addPage();
      page.moveTo(70, page.getHeight() - 60);
    }
  };
  const moveDownAndPopulateData = (i18nText, summaryData) => {
    handlePagination();
    page.moveDown(1);
    page.drawText(i18n.t(i18nText), {
      font: helveticaBoldFont,
      size: 12,
      lineHeight: 12,
      maxWidth: 480,
    });
    page.moveDown(20);
    page.drawText(summaryData || "-", {
      font: helveticaFont,
      size: 12,
      lineHeight: 12,
      maxWidth: 480,
    });
  };

  let page = pdfDoc.addPage();
  const title = i18n.t("healthIndicatorQuestionnaire.pdfTitle", {
    country: countrySummary.countryName,
  });
  page.moveTo(70, page.getHeight() - 60);
  drawTextWithPagination(title, {
    font: helveticaBoldFont,
    size: 20,
    lineHeight: 20,
    maxWidth: 480,
  });
  const contact = i18n.t(
    "healthIndicatorQuestionnaire.contactForm.contactInformation"
  );
  drawTextWithPagination(contact, {
    font: helveticaFont,
    size: 16,
    lineHeight: 16,
    maxWidth: 480,
  });
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.dateOnWhichDataWasCollected",
    countrySummary.collectedDate
  );
  page.moveDown(20);
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.nameOfPersonEnteringData",
    countrySummary.dataFeederName
  );
  page.moveDown(20);
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.emailOfThePersonEnteringData",
    countrySummary.dataFeederEmail
  );
  page.moveDown(20);
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.nameOfTheApprover",
    countrySummary.dataApproverName
  );
  page.moveDown(20);
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.roleOfTheApprover",
    countrySummary.dataApproverRole
  );
  page.moveDown(20);
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.emailOfTheApprover",
    countrySummary.dataApproverEmail
  );
  page.moveDown(20);
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.nameOfTheCountryContact",
    countrySummary.contactName
  );
  page.moveDown(20);
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.roleOfTheCountryContact",
    countrySummary.contactDesignation
  );
  page.moveDown(20);
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.emailOfTheCountryContact",
    countrySummary.contactEmail
  );
  page.moveDown(20);
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.organisationOfTheCountryContact",
    countrySummary.contactOrganization
  );

  page.moveDown(20);
  drawTextWithPagination(
    i18n.t("healthIndicatorQuestionnaire.contactForm.countrySummary"),
    { font: helveticaBoldFont, size: 12, lineHeight: 12, maxWidth: 480 }
  );
  if (countrySummary.summary) {
    drawTextWithPagination(countrySummary.summary, {
      font: helveticaFont,
      size: 12,
      maxWidth: 480,
      lineHeight: 12,
    });
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
    page.moveDown(20);
  }
  drawTextWithPagination(
    i18n.t("healthIndicatorQuestionnaire.resourceForm.resourceInformation"),
    {
      font: helveticaBoldFont,
      size: 16,
      x: 70,
      y: page.getY(),
      lineHeight: 16,
      maxWidth: 480,
    }
  );
  if (countrySummary.resources.length === 0)
    page.drawText("-", {
      size: 12,
      lineHeight: 12,
      font: helveticaFont,
    });
  handlePagination();
  for (let i = 0; i < countrySummary.resources.length; i++) {
    drawTextWithPagination(countrySummary.resources[i] || "-", {
      size: 12,
      lineHeight: 12,
      font: helveticaFont,
      maxWidth: 480,
    });
  }
  page = pdfDoc.addPage();
  page.moveTo(70, page.getHeight() - 80);
  drawTextWithPagination(
    i18n.t("healthIndicatorQuestionnaire.indicatorDetails"),
    {
      size: 16,
      lineHeight: 16,
      font: helveticaBoldFont,
      maxWidth: 480,
    }
  );
  questionnaire.forEach((category) => {
    drawTextWithPagination(category.categoryName, {
      size: 16,
      lineHeight: 16,
      font: helveticaBoldObliqueFont,
      maxWidth: 480,
    });
    //   // TODO: Explore adding of underline

    category.indicators.forEach((indicator) => {
      drawTextWithPagination(
        `${indicator.indicatorCode}. ${indicator.indicatorName}`,
        {
          x: 72,
          size: 12,
          maxWidth: 500,
          lineHeight: 12,
          font: helveticaFont,
        }
      );
      handlePagination();
      drawTextWithPagination(indicator.indicatorDefinition, {
        size: 10,
        maxWidth: 420,
        lineHeight: 10,
        font: helveticaBoldObliqueFont,
        color: hexToRgb("#666"),
      });
      handlePagination();
      indicator.scores.forEach((score) => {
        const fillColor =
          healthIndicators[indicator.indicatorId].score === score.score
            ? hexToRgb("#666")
            : hexToRgb("#FFF");
        const fontName =
          healthIndicators[indicator.indicatorId].score === score.score
            ? helveticaBoldFont
            : helveticaFont;
        handlePagination();
        page.drawCircle({
          x: 76,
          size: 5,
          borderWidth: 2,
          color: fillColor,
        });
        drawTextWithPagination(score.scoreDefinition, {
          font: helveticaFont,
          x: page.getX() + 20,
          y: page.getY() - 3,
          size: 12,
          lineHeight: 12,
          maxWidth: 420,
          color: hexToRgb("#000"),
        });
        handlePagination();
      });

      handlePagination();
      drawTextWithPagination(
        i18n.t("healthIndicatorQuestionnaire.rationaleOrSupportingText"),
        {
          size: 12,
          lineHeight: 12,
          font: helveticaBoldFont,
        }
      );
      let data = healthIndicators[indicator.indicatorId].supportingText;
      data = data.replace("\n", " ");
      drawTextWithPagination(
        healthIndicators[indicator.indicatorId].supportingText || "-",
        {
          font: helveticaFont,
          size: 12,
          maxWidth: 480,
          lineHeight: 12,
        }
      );
      page.moveDown(10);
      handlePagination();
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
