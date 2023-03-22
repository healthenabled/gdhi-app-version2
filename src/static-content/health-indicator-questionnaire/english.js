export const healthIndicatorQuestionnaire = {
  digitalHeathQuestionnaire: "Digital Health Questionnaire",
  pdfTitle: "{country} - Digital Health Questionnaire",
  note:
    "Note: Global Digital Health Index Data will be displayed publicly. As such, please obtain approval for submission from the relevant " +
    "government agency (Ministry of Health, Digital Health Agency, etc.) and provide the contact information of the approver. Leaving this " +
    "page will discard unsaved changes.",
  contactForm: {
    contactInformation: "Contact Information",
    nameOfPersonEnteringData: "Name of person entering data ",
    roleOfThePersonEnteringData: "Role of the person entering data",
    emailOfThePersonEnteringData: "Email of the person entering data",
    nameOfTheApprover: "Name of the approver",
    roleOfTheApprover: "Role of the approver",
    emailOfTheApprover: "Email of the approver ",
    nameOfTheCountryContact: "Name of the country contact",
    roleOfTheCountryContact: "Role of the country contact",
    emailOfTheCountryContact: "Email of the country contact",
    countrySummary: "Country Summary",
    organisationOfTheCountryContact: "Organisation of the country contact",
    govtApprovedMessage: "Is the data approved by the government?",
    error: {
      nameOfPersonEnteringData: "Name of person entering data is required",
      roleOfThePersonEnteringData:
        "Role of the person entering the data is required",
      email: "Please enter a valid email",
      nameOfTheApprover: "Name of person approving data is required",
      roleOfTheApprover: "Role of person approving data is required",
      nameOfTheCountryContact: "Country contact is Required",
      roleOfTheCountryContact: "Role of the country contact is Required",
      countrySummary: "Country summary is Required",
      organisationOfTheCountryContact: "Please enter the organisation",
    },
    hoverText: {
      nameOfPersonEnteringData:
        "Please enter the name of the person entering this data",
      roleOfThePersonEnteringData:
        "Please enter the role of the person entering the data",
      email: "Enter email",
      nameOfTheApprover:
        "Please enter the name of the person approving the data",
      roleOfTheApprover:
        "Please enter the role of the person approving the data",
      nameOfTheCountryContact: "Country contact",
      roleOfTheCountryContact: "Role of the country contact",
      organisationOfTheCountryContact:
        "Enter Organisation of the country contact",
    },
  },
  resourceForm: {
    resourceInformation: "Resource Information",
    note: "Please provide links to digital health related resources for your country.",
    exampleFormat: "Example Format : www.example.com",
    resource: "Resource {number}",
    errorMessage: "Please enter a valid resource weblink",
  },
  notifications: {
    submit: "Form submitted for review",
    saveCorrection: "Form saved successfully!",
    save: "Form saved successfully!",
    publish: "Data is now live",
    download: "Download Started Successfully",
    correctTheHighlightedFields: "Please correct the highlighted fields.",
    somethingWentWrong: "Something has gone wrong. Please refresh the Page!",
  },
  indicatorDetails: "Indicator Details",
  indicatorScoreError: "Indicator score and rationale field is required.",
  rationaleOrSupportingText: "Rationale or supporting text",
  downloadPDF: "DOWNLOAD PDF",
  saveAsDraft: "SAVE AS DRAFT",
  submit: "SUBMIT",
  save: "Save",
  reject: "Reject",
  publish: "Publish",
  confirm: "Confirm",
  cancel: "Cancel",
  note1: "These details will be displayed publicly on the GDHI platform.",
  note2:
    "These details will not be featured on the GDHI platform and are for our informational purpose.",
  note3:
    "Only the score for each indicator will be displayed publicly on the GDHI platform.",
  publishConfirmation:
    "You are about to publish digital health index form for {country}. This cannot be reverted. Do you want to continue?",
  saveConfirmation:
    "Are you sure you want to submit the data for {country}? Please check the options selected by you are reflecting Country's current year digital health maturity",
  rejectConfirmation:
    "You are about to reject digital health index form for {country}. This cannot be reverted. Do you want to continue?",
  govtApprovedMessage: "Is the data approved by the government?",
  QuestionnaireStateMessage: {
    hasPrefillData:
      "Data has been pre-populated in the questionnaire from year {updatedDate}. Please update the data for current year and provide relevant justification",
    dataSubmittedAlready:
      "Data is already submitted for the current year on {updatedDate}",
    dataPublishedAlready:
      "Data for current year is already published on {updatedDate}",
  },
};
