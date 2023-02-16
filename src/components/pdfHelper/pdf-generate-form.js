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

  let page = pdfDoc.addPage();
  const handlePagination = () => {
    if (page.getY() <= 70) {
      page = pdfDoc.addPage();
      page.moveTo(70, page.getHeight() - 60);
    }
  };
  const title = i18n.t("healthIndicatorQuestionnaire.pdfTitle", {
    country: countrySummary.countryName,
  });
  page.moveTo(70, page.getHeight() - 60);

  page.drawText(title, {
    font: helveticaBoldFont,
    size: 20,
    lineHeight: 20,
    maxWidth: 480,
  });
  page.moveDown(40);
  const contact = i18n.t(
    "healthIndicatorQuestionnaire.contactForm.contactInformation"
  );
  page.drawText(contact, {
    font: helveticaFont,
    size: 16,
    lineHeight: 16,
  });
  page.moveDown(20);

  const moveDownAndPopulateData = (i18nText, summaryData) => {
    page.moveDown(1);
    page.drawText(i18n.t(i18nText), {
      font: helveticaBoldFont,
      size: 12,
      lineHeight: 12,
    });
    page.moveDown(20);
    page.drawText(summaryData || "-", {
      font: helveticaFont,
      size: 12,
      lineHeight: 12,
    });
  };
  page.moveDown(20);

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
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.countrySummary",
    countrySummary.summary
  );

  page.moveDown(20);
  page.drawText(
    i18n.t("healthIndicatorQuestionnaire.resourceForm.resourceInformation"),
    {
      size: 16,
      lineHeight: 16,
      font: helveticaBoldFont,
      // TODO: Explore adding of underline
    }
  );
  page.moveDown(20);

  if (countrySummary.resources.length === 0)
    page.drawText("-", {
      size: 12,
      lineHeight: 12,
      font: helveticaFont,
    });

  for (let i = 0; i < countrySummary.resources.length; i++) {
    page.drawText(countrySummary.resources[i] || "-", {
      size: 12,
      lineHeight: 12,
      font: helveticaFont,
    });
  }

  page.moveDown(20);
  page = pdfDoc.addPage();
  page.moveTo(70, page.getHeight() - 80);
  page.drawText(i18n.t("healthIndicatorQuestionnaire.indicatorDetails"), {
    size: 16,
    lineHeight: 16,
    font: helveticaBoldFont,
    // TODO: Explore adding of underline
  });
  page.moveDown(20);
  questionnaire.forEach((category) => {
    page.moveDown(30);
    page.drawText(category.categoryName, {
      size: 16,
      lineHeight: 16,
      font: helveticaBoldObliqueFont,
      // TODO: Explore adding of underline
    });

    page.moveDown(30);

    category.indicators.forEach((indicator) => {
      page.drawText(`${indicator.indicatorCode}. ${indicator.indicatorName}`, {
        x: 72,
        size: 12,
        maxWidth: 500,
        lineHeight: 12,
        font: helveticaFont,
        color: hexToRgb("#666"),
      });
      page.moveDown(40);

      const indicatorDefinitionLength = indicator.indicatorDefinition.length;
      handlePagination();
      page.drawText(indicator.indicatorDefinition, {
        size: 10,
        maxWidth: 420,
        lineHeight: 10,
        font: helveticaBoldObliqueFont,
        color: hexToRgb("#666"),
      });
      page.moveDown(20 + Math.ceil(indicatorDefinitionLength / 104) * 15);

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
        const scoreDefinitionLength = score.scoreDefinition.length;
        page.drawText(score.scoreDefinition, {
          font: helveticaFont,
          x: page.getX() + 20,
          y: page.getY() - 3,
          size: 12,
          lineHeight: 12,
          maxWidth: 420,
          color: hexToRgb("#000"),
        });
        handlePagination();
        page.moveDown(15 + Math.ceil(scoreDefinitionLength / 98) * 15);
      });

      handlePagination();

      page.drawText(
        i18n.t("healthIndicatorQuestionnaire.rationaleOrSupportingText"),
        {
          size: 12,
          lineHeight: 12,
          font: helveticaBoldFont,
        }
      );
      page.moveDown(20);
      page.drawText(
        healthIndicators[indicator.indicatorId].supportingText || "-",
        {
          size: 12,
          lineHeight: 12,
          font: helveticaFont,
        }
      );
      page.moveDown(20);
      handlePagination();
    });
  });
  console.log("Indicators ended -!>");

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
