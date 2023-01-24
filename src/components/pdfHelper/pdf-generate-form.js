import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

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
  page.drawText(
    i18n.t("healthIndicatorQuestionnaire.pdfTitle", {
      country: countrySummary.countryName,
    }),
    {
      size: 20,
      font: helveticaBoldFont,
    }
  );

  page.moveDown(1);
  page.drawText(
    i18n.t("healthIndicatorQuestionnaire.contactForm.contactInformation"),
    {
      size: 16,
      font: helveticaBoldFont,
      // TODO: Explore adding of underline
    }
  );

  const moveDownAndPopulateData = (i18nText, summaryData) => {
    page.moveDown(1);
    page.drawText(i18n.t(i18nText), {
      font: helveticaBoldFont,
      size: 12,
    });
    page.drawText(summaryData || "-", {
      font: helveticaFont,
      size: 12,
    });
  };

  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.dateOnWhichDataWasCollected",
    countrySummary.collectedDate
  );
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.nameOfPersonEnteringData",
    countrySummary.dataFeederName
  );
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.emailOfThePersonEnteringData",
    countrySummary.dataFeederEmail
  );
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.nameOfTheApprover",
    countrySummary.dataApproverName
  );
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.roleOfTheApprover",
    countrySummary.dataApproverRole
  );
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.emailOfTheApprover",
    countrySummary.dataApproverEmail
  );
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.nameOfTheCountryContact",
    countrySummary.contactName
  );
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.roleOfTheCountryContact",
    countrySummary.contactDesignation
  );
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.emailOfTheCountryContact",
    countrySummary.contactEmail
  );
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.organisationOfTheCountryContact",
    countrySummary.contactOrganization
  );
  moveDownAndPopulateData(
    "healthIndicatorQuestionnaire.contactForm.countrySummary",
    countrySummary.summary
  );

  page.moveDown(1);
  page.drawText(
    i18n.t("healthIndicatorQuestionnaire.resourceForm.resourceInformation"),
    {
      size: 16,
      font: helveticaBoldFont,
      // TODO: Explore adding of underline
    }
  );
  page.moveDown(1);

  if (countrySummary.resources.length === 0)
    page.drawText("-", { size: 12, font: helveticaFont });

  for (let i = 0; i < countrySummary.resources.length; i++) {
    page.drawText(countrySummary.resources[i] || "-", {
      size: 12,
      font: helveticaFont,
    });
  }
  page.moveDown(1);
  page.drawText(i18n.t("healthIndicatorQuestionnaire.indicatorDetails"), {
    size: 16,
    font: helveticaBoldFont,
    // TODO: Explore adding of underline
  });

  page.moveDown(1);

  questionnaire.forEach((category) => {
    page.drawText(
      i18n.t("healthIndicatorQuestionnaire.contactForm.contactInformation"),
      {
        size: 16,
        font: helveticaBoldFont,
        // TODO: Explore adding of underline
      }
    );
    page.drawText(category.categoryName, {
      size: 16,
      font: helveticaBoldObliqueFont,
      // TODO: Explore adding of underline
    });

    page.moveDown(1);

    category.indicators.forEach((indicator) => {
      page.drawText(`${indicator.indicatorCode}. ${indicator.indicatorName}`, {
        x: 72,
        size: 12,
        font: helveticaFont,
        color: rgb(102, 102, 102),
      });
      page.drawText(indicator.indicatorDefinition, {
        size: 12,
        font: helveticaBoldObliqueFont,
        color: rgb(102, 102, 102),
      });

      page.moveDown(1);
      // page.fillColor("#000");

      indicator.scores.forEach((score) => {
        const fillColor =
          healthIndicators[indicator.indicatorId].score === score.score
            ? rgb(102, 102, 102)
            : rgb(255, 255, 255);
        const fontName =
          healthIndicators[indicator.indicatorId].score === score.score
            ? helveticaBoldFont
            : helveticaFont;
        if (page.getHeight() + 20 > 720) page = pdfDoc.addPage();
        const yVal = page.getHeight();
        page.drawCircle({
          x: 76,
          y: yVal + 6,
          size: 6,
          borderWidth: 2,
          color: fillColor,
        });
        page.drawText(score.scoreDefinition, {
          x: 90,
          font: fontName,
          color: rgb(0, 0, 0),
        });
        page.moveDown(0.5);
      });
      page.moveDown(1);

      page.drawText(
        i18n.t("healthIndicatorQuestionnaire.rationaleOrSupportingText"),
        { font: helveticaBoldObliqueFont }
      );

      page.drawText(
        healthIndicators[indicator.indicatorId].supportingText || "-",
        {
          font: helveticaFont,
        }
      );
      page.moveDown(1);

      page.moveDown(1);
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
