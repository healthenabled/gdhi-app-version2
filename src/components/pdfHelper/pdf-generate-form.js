import { PDFDocument, StandardFonts } from "pdf-lib";
import { hexToRgb, breakTextIntoLines } from "./pdfUtils";

const MIN_X = 70;
const MAX_WIDTH = 480;

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

  const drawTextWithPaginationForResourceLinks = (payloadText, options) => {
    const lines = breakTextIntoLines(
      payloadText,
      options.size,
      options.font,
      options.maxWidth
    );
    const numberOfLinesToWrite = lines.length;
    for (let i = 0; i < numberOfLinesToWrite; i++) {
      page.drawText(lines[i], options);
      page.moveDown(15);
    }
    handlePagination();
  };

  const handlePagination = () => {
    if (page.getY() <= MIN_X) {
      page = pdfDoc.addPage();
      page.moveTo(MIN_X, page.getHeight() - 60);
    }
  };

  let page = pdfDoc.addPage();
  const title = i18n.t("healthIndicatorQuestionnaire.pdfTitle", {
    country: countrySummary.countryName,
  });
  page.moveTo(MIN_X, page.getHeight() - 60);
  drawTextWithPagination(title, {
    font: helveticaBoldFont,
    size: 20,
    lineHeight: 20,
    maxWidth: MAX_WIDTH,
  });
  const contact = i18n.t(
    "healthIndicatorQuestionnaire.contactForm.contactInformation"
  );
  drawTextWithPagination(contact, {
    font: helveticaFont,
    size: 16,
    lineHeight: 16,
    maxWidth: MAX_WIDTH,
  });
  const nameOfPersonEnteringData = i18n.t(
    "healthIndicatorQuestionnaire.contactForm.nameOfPersonEnteringData"
  );
  drawTextWithPagination(nameOfPersonEnteringData, {
    font: helveticaBoldFont,
    size: 12,
    lineHeight: 12,
    maxWidth: MAX_WIDTH,
  });
  drawTextWithPagination(countrySummary.dataFeederName, {
    font: helveticaFont,
    size: 12,
    lineHeight: 12,
    maxWidth: MAX_WIDTH,
  });
  const roleOfPersonEnteringData = i18n.t(
    "healthIndicatorQuestionnaire.contactForm.roleOfThePersonEnteringData"
  );
  drawTextWithPagination(roleOfPersonEnteringData, {
    font: helveticaBoldFont,
    size: 12,
    lineHeight: 12,
    maxWidth: MAX_WIDTH,
  });
  drawTextWithPagination(countrySummary.dataFeederRole, {
    font: helveticaFont,
    size: 12,
    lineHeight: 12,
    maxWidth: MAX_WIDTH,
  });
  const emailOfPersonEnteringData = i18n.t(
    "healthIndicatorQuestionnaire.contactForm.emailOfThePersonEnteringData"
  );
  drawTextWithPagination(emailOfPersonEnteringData, {
    font: helveticaBoldFont,
    size: 12,
    lineHeight: 12,
    maxWidth: MAX_WIDTH,
  });
  drawTextWithPagination(countrySummary.dataFeederEmail, {
    font: helveticaFont,
    size: 12,
    lineHeight: 12,
    maxWidth: MAX_WIDTH,
  });
  const govtApproved = i18n.t(
    "healthIndicatorQuestionnaire.contactForm.govtApprovedMessage"
  );
  drawTextWithPagination(govtApproved, {
    font: helveticaBoldFont,
    size: 12,
    lineHeight: 12,
    maxWidth: MAX_WIDTH,
  });
  drawTextWithPagination(String(countrySummary.govtApproved), {
    font: helveticaFont,
    size: 12,
    lineHeight: 12,
    maxWidth: MAX_WIDTH,
  });
  if (countrySummary.govtApproved) {
    const nameOfTheApprover = i18n.t(
      "healthIndicatorQuestionnaire.contactForm.nameOfTheApprover"
    );
    drawTextWithPagination(nameOfTheApprover, {
      font: helveticaBoldFont,
      size: 12,
      lineHeight: 12,
      maxWidth: MAX_WIDTH,
    });
    drawTextWithPagination(String(countrySummary.dataApproverName), {
      font: helveticaFont,
      size: 12,
      lineHeight: 12,
      maxWidth: MAX_WIDTH,
    });
    const roleOfTheApprover = i18n.t(
      "healthIndicatorQuestionnaire.contactForm.roleOfTheApprover"
    );
    drawTextWithPagination(roleOfTheApprover, {
      font: helveticaBoldFont,
      size: 12,
      lineHeight: 12,
      maxWidth: MAX_WIDTH,
    });
    drawTextWithPagination(countrySummary.dataApproverRole, {
      font: helveticaFont,
      size: 12,
      lineHeight: 12,
      maxWidth: MAX_WIDTH,
    });
    const emailOfTheApprover = i18n.t(
      "healthIndicatorQuestionnaire.contactForm.emailOfTheApprover"
    );
    drawTextWithPagination(emailOfTheApprover, {
      font: helveticaBoldFont,
      size: 12,
      lineHeight: 12,
      maxWidth: MAX_WIDTH,
    });
    drawTextWithPagination(countrySummary.dataApproverEmail, {
      font: helveticaFont,
      size: 12,
      lineHeight: 12,
      maxWidth: MAX_WIDTH,
    });
  }
  const contactName = i18n.t(
    "healthIndicatorQuestionnaire.contactForm.nameOfTheCountryContact"
  );
  drawTextWithPagination(contactName, {
    font: helveticaBoldFont,
    size: 12,
    lineHeight: 12,
    maxWidth: MAX_WIDTH,
  });
  drawTextWithPagination(countrySummary.contactName, {
    font: helveticaFont,
    size: 12,
    lineHeight: 12,
    maxWidth: MAX_WIDTH,
  });
  const contactDesignation = i18n.t(
    "healthIndicatorQuestionnaire.contactForm.roleOfTheCountryContact"
  );
  drawTextWithPagination(contactDesignation, {
    font: helveticaBoldFont,
    size: 12,
    lineHeight: 12,
    maxWidth: MAX_WIDTH,
  });
  drawTextWithPagination(countrySummary.contactDesignation, {
    font: helveticaFont,
    size: 12,
    lineHeight: 12,
    maxWidth: MAX_WIDTH,
  });
  const contactEmail = i18n.t(
    "healthIndicatorQuestionnaire.contactForm.emailOfTheCountryContact"
  );
  drawTextWithPagination(contactEmail, {
    font: helveticaBoldFont,
    size: 12,
    lineHeight: 12,
    maxWidth: MAX_WIDTH,
  });
  drawTextWithPagination(countrySummary.contactEmail, {
    font: helveticaFont,
    size: 12,
    lineHeight: 12,
    maxWidth: MAX_WIDTH,
  });
  const contactOrganization = i18n.t(
    "healthIndicatorQuestionnaire.contactForm.organisationOfTheCountryContact"
  );
  drawTextWithPagination(contactOrganization, {
    font: helveticaBoldFont,
    size: 12,
    lineHeight: 12,
    maxWidth: MAX_WIDTH,
  });
  drawTextWithPagination(countrySummary.contactOrganization, {
    font: helveticaFont,
    size: 12,
    lineHeight: 12,
    maxWidth: MAX_WIDTH,
  });
  drawTextWithPagination(
    i18n.t("healthIndicatorQuestionnaire.contactForm.countrySummary"),
    { font: helveticaBoldFont, size: 12, lineHeight: 12, maxWidth: MAX_WIDTH }
  );
  if (countrySummary.summary) {
    drawTextWithPagination(countrySummary.summary, {
      font: helveticaFont,
      size: 12,
      maxWidth: MAX_WIDTH,
      lineHeight: 12,
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
  drawTextWithPagination(
    i18n.t("healthIndicatorQuestionnaire.resourceForm.resourceInformation"),
    {
      font: helveticaBoldFont,
      size: 16,
      x: MIN_X,
      y: page.getY(),
      lineHeight: 16,
      maxWidth: MAX_WIDTH,
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
    drawTextWithPaginationForResourceLinks(countrySummary.resources[i] || "-", {
      size: 12,
      lineHeight: 12,
      font: helveticaFont,
      maxWidth: MAX_WIDTH,
    });
    page.moveDown(20);
  }
  page = pdfDoc.addPage();
  page.moveTo(MIN_X, page.getHeight() - 80);
  drawTextWithPagination(
    i18n.t("healthIndicatorQuestionnaire.indicatorDetails"),
    {
      size: 16,
      lineHeight: 16,
      font: helveticaBoldFont,
      maxWidth: MAX_WIDTH,
    }
  );
  questionnaire.forEach((category) => {
    drawTextWithPagination(category.categoryName, {
      size: 16,
      lineHeight: 16,
      font: helveticaBoldObliqueFont,
      maxWidth: MAX_WIDTH,
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
          maxWidth: MAX_WIDTH,
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
