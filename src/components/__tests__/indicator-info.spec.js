import { mount } from "@vue/test-utils";
import IndicatorsInfo from "../indicatorsInfo/indicators-info.vue";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import moxios from "moxios";
import { uniq } from "lodash";
import { i18n } from "../../plugins/i18n";

describe("Indicator Info ", () => {
  let wrapper;

  const responseData = [
    {
      categoryId: 1,
      categoryName: "Leadership and Governance",
      indicators: [
        {
          indicatorId: 1,
          indicatorCode: "1",
          indicatorName:
            "Digital health prioritized at the national level through dedicated bodies / mechanisms for governance",
          indicatorDefinition:
            "Does the country have a separate department / agency / national working group for digital health?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "No coordinating body exists and/or nascent governance structure for digital health is constituted on a case-by-case basis.",
            },
            {
              score: 2,
              scoreDefinition:
                "Governance structure is formally constituted though not fully-functional or meeting regularly.",
            },
            {
              score: 3,
              scoreDefinition:
                "Governance structure and any related working groups have a scope of work (SOW) and conduct regular meetings with stakeholder participation and/or consultation.",
            },
            {
              score: 4,
              scoreDefinition:
                "Governance structure is fully-functional, government-led, consults with other ministries, and monitors implementation of digital health based on a work plan.",
            },
            {
              score: 5,
              scoreDefinition:
                "The digital health governance structure is institutionalized, consults with other ministries, and monitors implementation of digital health. It is relatively protected from interference or organizational changes. It is nationally recognized as the lead for digital health.The governance structure and its technical working groups emphasize gender balance in membership.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 2,
          indicatorCode: "2",
          indicatorName:
            "Digital Health prioritized at the national level through planning",
          indicatorDefinition:
            "Is digital health included and budgeted for in national health or relevant national strategies and/or plan(s)?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "Digital health is not included in the national health strategy. It is being implemented in an ad hoc fashion in health programs.",
            },
            {
              score: 2,
              scoreDefinition:
                "There is some discussion of inclusion of digital health in national health or other relevant national strategies or plans. Proposed language for inclusion of digital health in national health or relevant national strategies and/or plans has been made and is under review.",
            },
            {
              score: 3,
              scoreDefinition:
                "Digital health is included in national health or relevant national strategies and/or plans.",
            },
            {
              score: 4,
              scoreDefinition:
                "Digital health is being implemented as part of national health or other relevant national strategies and/or plans",
            },
            {
              score: 5,
              scoreDefinition:
                "Digital health is implemented and periodically evaluated and optimized in national health or other relevant national strategies and/or plans",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
      ],
    },
    {
      categoryId: 2,
      categoryName: "Strategy and Investment",
      indicators: [
        {
          indicatorId: 3,
          indicatorCode: "3",
          indicatorName:
            "National eHealth/ Digital Health Strategy or Framework",
          indicatorDefinition:
            "Does the country have an eHealth or digital health strategy or framework and a costed digital health plan?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "There is no digital health strategy or framework. Draft digital health strategy or framework developed, but not officially reviewed.",
            },
            {
              score: 2,
              scoreDefinition:
                "National digital health strategy or framework approved",
            },
            {
              score: 3,
              scoreDefinition:
                "National digital health costed plan developed and approved",
            },
            {
              score: 4,
              scoreDefinition:
                "National digital health strategy and costed plan partially implemented with resources to ensure full implementation",
            },
            {
              score: 5,
              scoreDefinition:
                "National digital health strategy and costed plan fully implemented with planning underway for the next 3-5 year cycle",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 4,
          indicatorCode: "4",
          indicatorName: "Public funding for digital health",
          indicatorDefinition:
            "What is the estimated percent (%) of the annual public spending on health committed to digital health?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "No budget line item for digital health available. A budget line item for digital health exists but proportion not available.",
            },
            {
              score: 2,
              scoreDefinition: "Less than 1%",
            },
            {
              score: 3,
              scoreDefinition: "1-3%",
            },
            {
              score: 4,
              scoreDefinition: "3-5%",
            },
            {
              score: 5,
              scoreDefinition: "Greater than 5%",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
      ],
    },
    {
      categoryId: 3,
      categoryName: "Legislation, Policy, and Compliance",
      indicators: [
        {
          indicatorId: 5,
          indicatorCode: "5",
          indicatorName: "Legal Framework for Data Protection (Security)",
          indicatorDefinition:
            "Is there a law on data security (storage, transmission, use) that is relevant to digital health?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "There is no law on data security (storage, transmission, use) that is relevant to digital health.",
            },
            {
              score: 2,
              scoreDefinition:
                "There is a law on data security (storage, transmission, use) that is relevant to digital health that has been proposed and is under review.",
            },
            {
              score: 3,
              scoreDefinition:
                "There is a law on data security (storage, transmission, use) that is relevant to digital health that has been passed, but has not yet been fully implemented.",
            },
            {
              score: 4,
              scoreDefinition:
                "There is a law on data security (storage, transmission, use) that is relevant to digital health that has been implemented, but not consistenly enforced.",
            },
            {
              score: 5,
              scoreDefinition:
                "There is a law on data security (storage, transmission, use) that is relevant to digital health that has been implemented and enforced consistently.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 6,
          indicatorCode: "6",
          indicatorName:
            "Laws or Regulations for privacy, confidentiality and acess to health information (Privacy)",
          indicatorDefinition:
            "Is there a law to protect individual privacy, governing ownership, access and sharing of individually identifiable digital health data ?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "There is no law to protect individual privacy, governing ownership, access and sharing of individually identifiable digital health data.",
            },
            {
              score: 2,
              scoreDefinition:
                "There is a law to protect individual privacy, governing ownership, access and sharing of individually identifiable digital health data that has been proposed and is under review.",
            },
            {
              score: 3,
              scoreDefinition:
                "There is a law to protect individual privacy, governing ownership, access and sharing of individually identifiable digital health data that has been passed, but not yet fully implemented.",
            },
            {
              score: 4,
              scoreDefinition:
                "There is a law to protect individual privacy, governing ownership, access and sharing of individually identifiable digital health data that has been implemented, but not consistenly enforced.",
            },
            {
              score: 5,
              scoreDefinition:
                "There is a law to protect individual privacy, governing ownership, access and sharing of individually identifiable digital health data that has been implemented and is enforced consistently.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 7,
          indicatorCode: "7",
          indicatorName:
            "Protocol for regulating or certifying devices and/or digital health services",
          indicatorDefinition:
            "Are there protocols, policies, frameworks or accepted processes governing the clinical and patient care use of connected medical devices and digital health services (e.g. telemedicine, applications), particularly in relation to safety, data integrity and quality of care?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "There are no protocols, policies, frameworks or accepted processes governing the clinical and patient care use of connected medical devices and digital health services (e.g. telemedicine, applications), particularly in relation to safety, data integrity and quality of care.",
            },
            {
              score: 2,
              scoreDefinition:
                "Protocols, policies, frameworks or accepted processes governing the clinical and patient care use of connected medical devices and digital health services (e.g. telemedicine, applications), particularly in relation to safety, data integrity and quality of care have been proposed and are under review.",
            },
            {
              score: 3,
              scoreDefinition:
                "Protocols, policies, frameworks or accepted processes governing the clinical and patient care use of connected medical devices and digital health services (e.g. telemedicine, applications), particularly in relation to safety, data integrity and quality of care have been passed, but are not fully implemented.",
            },
            {
              score: 4,
              scoreDefinition:
                "Protocols, policies, frameworks or accepted processes governing the clinical and patient care use of connected medical devices and digital health services (e.g. telemedicine, applications), particularly in relation to safety, data integrity and quality of care have been implemented, but not consistenly enforced.",
            },
            {
              score: 5,
              scoreDefinition:
                "Protocols, policies, frameworks or accepted processes governing the clinical and patient care use of connected medical devices and digital health services (e.g. telemedicine, applications), particularly in relation to safety, data integrity and quality of care have been implemented and are enforced consistently.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 8,
          indicatorCode: "8",
          indicatorName: "Cross-border data security and sharing",
          indicatorDefinition:
            "Are there protocols, policies, frameworks or accepted processes in place to support secure cross-border data exchange and storage? This includes health-related data coming into a country, going out of a country, and/or being used in a country related to an individual from another country.",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "There are no protocols, policies, frameworks or accepted processes in place to support secure cross-border data exchange and storage.",
            },
            {
              score: 2,
              scoreDefinition:
                "Protocols, policies, frameworks or accepted processes for cross boarder data exchange and storage have been proposed and are under review.",
            },
            {
              score: 3,
              scoreDefinition:
                "Protocols, policies, frameworks or accepted processes for cross boarder data exchange and storage have been passed, but are not fully implemented.",
            },
            {
              score: 4,
              scoreDefinition:
                "Protocols, policies, frameworks or accepted processes for cross boarder data exchange and storage have been implemented, but not consistently enforced.",
            },
            {
              score: 5,
              scoreDefinition:
                "Protocols, policies, frameworks or accepted processes for cross boarder data exchange and storage have been implemented and enforced consistently.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
      ],
    },
    {
      categoryId: 4,
      categoryName: "Workforce",
      indicators: [
        {
          indicatorId: 9,
          indicatorCode: "9",
          indicatorName:
            "Digital health integrated in health and related professional pre-service training (prior to deployment)",
          indicatorDefinition:
            "Is digital health part of curriculum for health and health-related support professionals in training, in general?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "There is no digital health curriculum for health professionals as part of pre-service training requirements.",
            },
            {
              score: 2,
              scoreDefinition:
                "Digital health curriculum proposed and under review as part of pre-service training requirements.",
            },
            {
              score: 3,
              scoreDefinition:
                "Digital health curriculum implementation underway covering an estimated 0-25% of health professionals in pre-service training.",
            },
            {
              score: 4,
              scoreDefinition:
                "Digital health taught in relevant institutions with an estimated 50-75% health professionals receiving pre-service training.",
            },
            {
              score: 5,
              scoreDefinition:
                "Digital health taught in relevant institutions with >75% of health professionals receiving pre-service training.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 20,
          indicatorCode: "9a",
          indicatorName:
            "Digital health integrated in health and related professional pre-service training (prior to deployment)",
          indicatorDefinition:
            "Specifically, is digital health part of curriculum for doctors/physicians in medical training?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "There is no digital health curriculum for doctors/physicians as part of pre-service training requirements.",
            },
            {
              score: 2,
              scoreDefinition:
                "Digital health curriculum proposed and under review as part of pre-service training requirements for doctors/physicians.",
            },
            {
              score: 3,
              scoreDefinition:
                "Digital health curriculum implementation underway covering an estimated 0-25% doctors/physicians in pre-service training.",
            },
            {
              score: 4,
              scoreDefinition:
                "Digital health taught in relevant institutions with an estimated 50-75% of doctors/physicians receiving pre-service training.",
            },
            {
              score: 5,
              scoreDefinition:
                "Digital health taught in relevant instutitions with >75% of doctors/physicians receiving pre-service training.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 21,
          indicatorCode: "9b",
          indicatorName:
            "Digital health integrated in health and related professional pre-service training (prior to deployment)",
          indicatorDefinition:
            "Specifically, is digital health part of curriculum for nurses in pre-service training?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "There is no digital health curriculum for nurses as part of pre-service training requirements.",
            },
            {
              score: 2,
              scoreDefinition:
                "Digital health curriculum proposed and under review as part of pre-service training requirements for nurses.",
            },
            {
              score: 3,
              scoreDefinition:
                "Digital health curriculum implementation underway covering an estimated 0-25% or health professionals in pre-service training.",
            },
            {
              score: 4,
              scoreDefinition:
                "Digital health taught in relevant institutions with an estimated 50-75% of nurses receiving pre-service training.",
            },
            {
              score: 5,
              scoreDefinition:
                "Digital health taught in relevant institutions with >75% of nurses receiving pre-service training.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 22,
          indicatorCode: "9c",
          indicatorName:
            "Digital health integrated in health and related professional pre-service training (prior to deployment)",
          indicatorDefinition:
            "Specifically, is digital health part of curriculum for health and health-related support professionals in training for community health workers?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "There is no digital health curriculum for health professionals as part of pre-service training requirements for community health workers.",
            },
            {
              score: 2,
              scoreDefinition:
                "Digital health curriculum proposed and under review as part of pre-service training requirements for community health workers.",
            },
            {
              score: 3,
              scoreDefinition:
                "Digital health curriculum implementation underway covering an estimated 0-25% of community health workers in pre-service training.",
            },
            {
              score: 4,
              scoreDefinition:
                "Digital health taught in relevant institutions with an estimated 50-75% of community health workers receiving pre-service training.",
            },
            {
              score: 5,
              scoreDefinition:
                "Digital health taught in relevant institutions with >75% of community health workers receiving pre-service training.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 10,
          indicatorCode: "10",
          indicatorName:
            "Digital health integrated in health and related professional in-service training (after deployment)",
          indicatorDefinition:
            "Is digital health part of curriculum for health and health-related support professionals in the workforce (as defined below)? [Defined as community health workers, nurses, doctors, allied health, health managers/administrators, and technologists]",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "There is no digital health curriculum as part of in-service (continuing education) training for health professionals in the workforce.",
            },
            {
              score: 2,
              scoreDefinition:
                "Digital health curriculum proposed and under review as part of in-service (continuing edication) training for health professionals in the workforce.",
            },
            {
              score: 3,
              scoreDefinition:
                "Digital health curriculum is implemented as part of in-service (continuing edication) training for 0-25% health professionals in the workforce.",
            },
            {
              score: 4,
              scoreDefinition:
                "Digital health curriculum is implemented as part of in-service (continuing edication) training for 50-75% health professionals in the workforce.",
            },
            {
              score: 5,
              scoreDefinition:
                "Digital health curriculum is implemented as part of in-service (continuing edication) training for >75% health professionals in the workforce.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 23,
          indicatorCode: "10a",
          indicatorName:
            "Digital health integrated in health and related professional in-service training (after deployment)",
          indicatorDefinition:
            "Specifically, is digital health part of curriculum for doctors/physicians in the workforce?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "There is no digital health curriculum as part of in-service (continuing education) training for doctors/physicians in the workforce.",
            },
            {
              score: 2,
              scoreDefinition:
                "Digital health curriculum proposed and under review as part of in-service (continuing education) training for doctors/physicians in the workforce.",
            },
            {
              score: 3,
              scoreDefinition:
                "Digital health curriculum is implemented as part of in-service (continuing education) training for 0-25% of doctors/physicians in the workforce.",
            },
            {
              score: 4,
              scoreDefinition:
                "Digital health curriculum is implemented as part of in-service (continuing education) training for 50-75% of doctors/physicians in the workforce.",
            },
            {
              score: 5,
              scoreDefinition:
                "Digital health curriculum is implemented as part of in-service (continuing education) training for >75% of doctors/physicians in the workforce.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 24,
          indicatorCode: "10b",
          indicatorName:
            "Digital health integrated in health and related professional in-service training (after deployment)",
          indicatorDefinition:
            "Specifically, is digital health part of curriculum for nurses in the workforce?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "There is no digital health curriculum as part of in-service (continuing education) training for nurses in the workforce.",
            },
            {
              score: 2,
              scoreDefinition:
                "Digital health curriculum proposed and under review as part of in-service (continuing education) training for nurses in the workforce.",
            },
            {
              score: 3,
              scoreDefinition:
                "Digital health curriculum is implemented as part of in-service (continuing education) training for 0-25% of nurses in the workforce.",
            },
            {
              score: 4,
              scoreDefinition:
                "Digital health curriculum is implemented as part of in-service (continuing education) training for 50-75% of nurses in the workforce.",
            },
            {
              score: 5,
              scoreDefinition:
                "Digital health curriculum is implemented as part of in-service (continuing education) training for >75% of nurses in the workforce.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 25,
          indicatorCode: "10c",
          indicatorName:
            "Digital health integrated in health and related professional in-service training (after deployment)",
          indicatorDefinition:
            "Specifically, is digital health part of curriculum for community health workers in the workforce?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "There is no digital health curriculum as part of in-service (continuing education) training for community health workers in the workforce.",
            },
            {
              score: 2,
              scoreDefinition:
                "Digital health curriculum proposed and under review as part of in-service (continuing education) training for community health workers in the workforce.",
            },
            {
              score: 3,
              scoreDefinition:
                "Digital health curriculum is implemented as part of in-service (continuing education) training for 0-25% of community health workers in the workforce.",
            },
            {
              score: 4,
              scoreDefinition:
                "Digital health curriculum is implemented as part of in-service (continuing education) training for 50-75% of community health workers in the workforce.",
            },
            {
              score: 5,
              scoreDefinition:
                "Digital health curriculum is implemented as part of in-service (continuing education) training for >75% of community health workers in the workforce.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 11,
          indicatorCode: "11",
          indicatorName: "Training of digital health work force",
          indicatorDefinition:
            "Is training in digital health / health informatics / health information systems / biomedical informatics degree programs (in either public or private institutions) producing trained digital health workers?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "There is no training available for digital heath workforce available in the country.",
            },
            {
              score: 2,
              scoreDefinition:
                "Digital heath workforce needs assessed, gaps identified and training options under development.",
            },
            {
              score: 3,
              scoreDefinition:
                "Professional training is available, but graduates are not yet deployed.",
            },
            {
              score: 4,
              scoreDefinition:
                "Trained digital health professionals available and deployed, but essential personnel gaps remain.",
            },
            {
              score: 5,
              scoreDefinition:
                "Sufficient numbers of trained digital health professionals available to support national digital health needs.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 26,
          indicatorCode: "11a",
          indicatorName: "Training of digital health work force",
          indicatorDefinition:
            "Specifically, is training in health and/or biomedical informatics (in either public or private institutions) producing trained informaticists or health information systems specialists?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "There is no training available in informatics or health information systems available in the country.",
            },
            {
              score: 2,
              scoreDefinition:
                "Health informatics workforce needs assessed, gaps identified and training options under development.",
            },
            {
              score: 3,
              scoreDefinition:
                "Professional training in health informatics is available, but graduates are not yet deployed.",
            },
            {
              score: 4,
              scoreDefinition:
                "Trained informatics professionals available and deployed, but essential personnel gaps remain.",
            },
            {
              score: 5,
              scoreDefinition:
                "Sufficient numbers of trained health informatics professionals available to support national health information system needs.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 12,
          indicatorCode: "12",
          indicatorName:
            "Maturity of public sector digital health professional careers",
          indicatorDefinition:
            "Are there public sector professional titles and career paths in digital health?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "No workforce strategy, policy, or guide that recognizes digital health is in place. Distribution of digital health work force is ad hoc.",
            },
            {
              score: 2,
              scoreDefinition:
                "A national needs assessment shows the number and types of skills needed to support digital health with an explicit focus on training cadres of female health workers.",
            },
            {
              score: 3,
              scoreDefinition:
                "Digital health staff roles and responsibilities are mapped to the government's workforce and career schemes and 25-50% of needed public sector digital health workforce in place.",
            },
            {
              score: 4,
              scoreDefinition:
                "An HR policy and strategic plan exists that identifies skills and functions needed to support digital health with an explicit focus on training cadres of female health workers and an estimated 50-75% of public sector digital health workforce in place.",
            },
            {
              score: 5,
              scoreDefinition:
                "A long-term plan is in place to grow and sustain staff with the skills needed to sustain digital health at national and subnational levels with an explicit focus on training cadres of female health workers with an estimated >75% of positions needed filled. Performance management systems are in place to ensure growth and sustainability of the digital health workforce with sufficient supply to meet digital health needs and little staff turnover.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
      ],
    },
    {
      categoryId: 5,
      categoryName: "Standards and Interoperability",
      indicators: [
        {
          indicatorId: 13,
          indicatorCode: "13",
          indicatorName:
            "National digital health architecture and/or health information exchange",
          indicatorDefinition:
            "Is there a national digital health (eHealth) architectural framework and/or health information exchange (HIE) established?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "There is no national digital health (eHealth) architectural framework and/or health information exchange (HIE) established.",
            },
            {
              score: 2,
              scoreDefinition:
                "A national digital health architecture and/or health information exchange [HIE] is defined including semantic, syntactic, and organizational layers.",
            },
            {
              score: 3,
              scoreDefinition:
                "The HIE is operable and provides core functions, such as authentication, translation, storage and warehousing function, guide to what data is available and how to access it, and data interpretation.",
            },
            {
              score: 4,
              scoreDefinition:
                "The government leads, manages, and enforces implementation of the national digital health architecture and/or the health information exchange (HIE), which are fully implemented following industry standards.",
            },
            {
              score: 5,
              scoreDefinition:
                "The national digital health architecture and/or health information exchange (HIE) provides core data exchange functions and is periodically reviewed and updated to meet the needs of the changing digital health architecture. There is continuous learning, innovation, and quality control. Data is actively used for national health strategic planning and budgeting.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 14,
          indicatorCode: "14",
          indicatorName: "Health information standards",
          indicatorDefinition:
            "Are there digital health / health information standards for data exchange, transmission, messaging, security, privacy, and hardware?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "There are no digital health / health information standards for data exchange, transmission, messaging, security, privacy, and hardware.",
            },
            {
              score: 2,
              scoreDefinition:
                "There are some digital health / health information standards for data exchange, transmission, messaging, security, privacy, and hardware that have been adopted and/or are used.",
            },
            {
              score: 3,
              scoreDefinition:
                "Digital health / health information standards for data exchange, transmission, messaging, security, privacy, and hardware have been published and disseminated in the country under the government’s leadership.",
            },
            {
              score: 4,
              scoreDefinition:
                "Digital health / health information industry-based technical standards for data exchange, transmission, messaging, security, privacy, and hardware are in use in the majority of applications and systems to ensure the availability of high-quality data. Conformance testing is routinely carried out to certify implementers.",
            },
            {
              score: 5,
              scoreDefinition:
                "Data standards are routinely updated and data is actively used for monitoring and evaluating the health system and for national health strategic planning and budgeting.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
      ],
    },
    {
      categoryId: 6,
      categoryName: "Infrastructure",
      indicators: [
        {
          indicatorId: 15,
          indicatorCode: "15",
          indicatorName: "Network readiness",
          indicatorDefinition: "Extract the WEF Network Readiness Index score",
          scores: [
            {
              score: 1,
              scoreDefinition: "WEF score (1.0 - 3.3)",
            },
            {
              score: 2,
              scoreDefinition: "WEF score (>3.3 - 4.0)",
            },
            {
              score: 3,
              scoreDefinition: "WEF score (>4.0 - 5.0)",
            },
            {
              score: 4,
              scoreDefinition: "WEF score (>5.0 - 5.4)",
            },
            {
              score: 5,
              scoreDefinition: "WEF score (>5.4 - 7.0)",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 16,
          indicatorCode: "16",
          indicatorName:
            "Planning and support for ongoing digital health infrastructure maintenance",
          indicatorDefinition:
            "Is there an articulated plan for supporting digital health infrastructure (including equipment- computers/ tablets/ phones, supplies, software, devices, etc.) provision and maintenance?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "There is no articulated plan for supporting digital health infrastructure (including equipment- computers/ tablets/ phones, supplies, software, devices, etc.) provision and maintenance.",
            },
            {
              score: 2,
              scoreDefinition:
                "A plan for supporting digital health infrastructure (including equipment- computers/ tablets/ phones, supplies, software, devices, etc.) provision and maintenance has been developed, but not implemented.",
            },
            {
              score: 3,
              scoreDefinition:
                "A plan for supporting digital health infrastructure (including equipment- computers/ tablets/ phones, supplies, software, devices, etc.) provision and maintenance has been implemented partially, but not consistently with estimated 0-25% of necessary digital health infrastructure needed in public healthcare service sector available and in use.",
            },
            {
              score: 4,
              scoreDefinition:
                "A plan for supporting digital health infrastructure (including equipment- computers/ tablets/ phones, supplies, software, devices, etc.) provision and maintenance has been implemented partially and consistently with estimated 25-50% of necessary digital health infrastructure needed in public healthcare service sector available and in use.",
            },
            {
              score: 5,
              scoreDefinition:
                "Digital health infrastructure (including equipment- computers/ tablets/ phones, supplies, software, devices, etc.) is available, in use, and regularly maintained and upgraded in >75% of public healthcare service sector.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
      ],
    },
    {
      categoryId: 7,
      categoryName: "Services and Applications",
      indicators: [
        {
          indicatorId: 17,
          indicatorCode: "17",
          indicatorName: "Nationally scaled digital health systems",
          indicatorDefinition:
            'Public sector priorities (eg. 14 domains included in ISO TR 14639) are supported by nationally-scaled digital health systems. (Use separate worksheet to determine the country"s specified priority areas, whether digital systems are in place, and whether those systems are national-scale.)  [eg. Country X chooses 4 priority areas, uses digital systems to address 2 of the 4, with only 1 being at national scale, receives a score of 25%.]',
          scores: [
            {
              score: 1,
              scoreDefinition:
                "National prioritiy areas are not supported by digital health at any scale.",
            },
            {
              score: 2,
              scoreDefinition:
                "Few national priority areas are supported by digital health, and implemention initiated (< 25% priority areas).",
            },
            {
              score: 3,
              scoreDefinition:
                "Some national priority areas supported by scaled digital health systems (25-50% of priority areas).",
            },
            {
              score: 4,
              scoreDefinition:
                "The majority, but not all national priority areas (50-75% of priority areas) supported by scaled digital health systems.",
            },
            {
              score: 5,
              scoreDefinition:
                "All nationally prioritized areas supported by national-scale digital health systems (>75%) with monitoring and evaluation systems and results.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 18,
          indicatorCode: "18",
          indicatorName:
            "Digital identity management of service providers, administrators, and facilities for digital health, including location data for GIS mapping",
          indicatorDefinition:
            "Are health system registries of uniquely identifiable providers, administrators, and public facilities (and private if applicable) available, accessible and current? Is the data geotagged to enable GIS mapping?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "Health system registries of uniquely identifiable providers, administrators, and public facilities (and private if applicable) are not available, accessible and current.",
            },
            {
              score: 2,
              scoreDefinition:
                "Health system registries of uniquely identifiable providers, administrators, and public facilities (and private if applicable) are being developed but are not available for use.",
            },
            {
              score: 3,
              scoreDefinition:
                "Health system registries of uniquely identifiable providers, administrators, and public facilities (and private if applicable) are available for use, but incomplete, partially available, used sporadically, and irregularly maintained.",
            },
            {
              score: 4,
              scoreDefinition:
                "Health system registries of uniquely identifiable providers, administrators, and public facilities (and private if applicable) are available, used, and regularly updated and maintained. The data is geo-tagged to enable GIS mapping.",
            },
            {
              score: 5,
              scoreDefinition:
                "Health system registries of uniquely identifiable providers, administrators, and public facilities (and private if applicable) are available, up-to-date with geo-tagged data, and used for health system and service strategic planning and budgeting.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 19,
          indicatorCode: "19",
          indicatorName:
            "Digital identity management of individuals for health",
          indicatorDefinition:
            "Are secure registries or a master patient index of uniquely identifiable individuals available, accessible and current for use for health-related purposes?",
          scores: [
            {
              score: 1,
              scoreDefinition:
                "No secure registry or master patient index exists.",
            },
            {
              score: 2,
              scoreDefinition:
                "A secure registry exists, but is incomplete / partially available, used, and irregularly maintained.",
            },
            {
              score: 3,
              scoreDefinition:
                "A secure registry exists, is available and in active use and includes <25% of the relevant population.",
            },
            {
              score: 4,
              scoreDefinition:
                "A secure registry exists, is available and in active use and includes 25-50% of the relevant population.",
            },
            {
              score: 5,
              scoreDefinition:
                "A secure registry exists, is available and in active use and includes >75% of the relevant population. The data is available, used, and curated.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 27,
          indicatorCode: "19a",
          indicatorName:
            "Digital identity management of individuals for health",
          indicatorDefinition:
            "Specifically, is there a secure master patient index of uniquely identifiable individuals available, accessible and current for use for health-related purposes?",
          scores: [
            {
              score: 1,
              scoreDefinition: "No secure master patient index exists.",
            },
            {
              score: 2,
              scoreDefinition:
                "A master patient index exists, but is incomplete / partially available, used, and irregularly maintained.",
            },
            {
              score: 3,
              scoreDefinition:
                "A master patient index exists, is available and in active use and includes <25% of the relevant population.",
            },
            {
              score: 4,
              scoreDefinition:
                "A master patient index exists, is available and in active use and includes 25-50% of the relevant population.",
            },
            {
              score: 5,
              scoreDefinition:
                "A master patient index exists, is available and in active use and includes >75% of the relevant population. The data is available, used, and curated.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 28,
          indicatorCode: "19b",
          indicatorName:
            "Digital identity management of individuals for health",
          indicatorDefinition:
            "Specifically, is there a secure birth registry of uniquely identifiable individuals available, accessible and current for use for health-related purposes?",
          scores: [
            {
              score: 1,
              scoreDefinition: "No secure birth registry exists.",
            },
            {
              score: 2,
              scoreDefinition:
                "A secure birth registry exists, but is incomplete / partially available, used, and irregularly maintained.",
            },
            {
              score: 3,
              scoreDefinition:
                "A secure birth registry exists, is available and in active use and includes <25% of the relevant population.",
            },
            {
              score: 4,
              scoreDefinition:
                "A secure birth registry exists, is available and in active use and includes 25-50% of the relevant population.",
            },
            {
              score: 5,
              scoreDefinition:
                "A secure birth registry exists, is available and in active use and includes >75% of the relevant population. The data is available, used, and curated.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 29,
          indicatorCode: "19c",
          indicatorName:
            "Digital identity management of individuals for health",
          indicatorDefinition:
            "Specifically, is there a secure death registry of uniquely identifiable individuals available, accessible and current for use for health-related purposes?",
          scores: [
            {
              score: 1,
              scoreDefinition: "No secure death registry exists.",
            },
            {
              score: 2,
              scoreDefinition:
                "A secure death registry exists, but is incomplete / partially available, used, and irregularly maintained.",
            },
            {
              score: 3,
              scoreDefinition:
                "A secure death registry exists, is available and in active use and includes <25% of the relevant population.",
            },
            {
              score: 4,
              scoreDefinition:
                "A secure death registry exists, is available and in active use and includes 25-50% of the relevant population.",
            },
            {
              score: 5,
              scoreDefinition:
                "A secure death registry exists, is available and in active use and includes >75% of the relevant population. The data is available, used, and curated.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
        {
          indicatorId: 30,
          indicatorCode: "19d",
          indicatorName:
            "Digital identity management of individuals for health",
          indicatorDefinition:
            "Specifically, is there a secure immunization registry of uniquely identifiable individuals available, accessible and current for use for health-related purposes?",
          scores: [
            {
              score: 1,
              scoreDefinition: "No secure immunization registry exists.",
            },
            {
              score: 2,
              scoreDefinition:
                "A secure immunization registry exists, but is incomplete / partially available, used, and irregularly maintained.",
            },
            {
              score: 3,
              scoreDefinition:
                "A secure immunization registry exists, is available and in active use and includes <25% of the relevant population.",
            },
            {
              score: 4,
              scoreDefinition:
                "A secure immunization registry exists, is available and in active use and includes 25-50% of the relevant population.",
            },
            {
              score: 5,
              scoreDefinition:
                "A secure immunization registry exists, is available and in active use and includes >75% of the relevant population. The data is available, used, and curated.",
            },
            {
              score: -1,
              scoreDefinition: "Not Available or Not Applicable",
            },
          ],
        },
      ],
    },
  ];
  beforeEach(() => {
    moxios.install();
    wrapper = mount(IndicatorsInfo, { i18n });
  });
  it("should call the API and update the local varaibles with correct data", (done) => {
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({ statues: 200, response: responseData }).then(() => {
        expect(wrapper.vm.categoricalIndicators).to.deep.equal(responseData);
        wrapper.vm.categoricalIndicators.forEach((category) => {
          expect(category["showCategory"]).to.equal(true);
        });
        const uniqCategories = uniq(
          responseData.map((category) => {
            return category.categoryName;
          })
        );
        expect(wrapper.vm.categoryNames).to.deep.equal(uniqCategories);
        done();
      });
    });
  });
  it("should render the html elements based on the data", (done) => {
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({ statues: 200, response: responseData }).then(() => {
        expect(wrapper.findAll(".indicator-details").length).to.deep.equal(
          responseData.length
        );
        const firstIndicatorElement = wrapper
          .findAll(".indicator-details")
          .at(0);
        expect(firstIndicatorElement.find(".sub-header").text()).to.equal(
          responseData[0].categoryName
        );
        expect(firstIndicatorElement.findAll(".indicator").length).to.equal(
          responseData[0].indicators.length
        );
        expect(
          firstIndicatorElement
            .findAll(".indicator")
            .at(0)
            .find(".indicator-id")
            .text()
        ).to.contain(responseData[0].indicators[0].indicatorId.toString());
        expect(
          firstIndicatorElement
            .findAll(".indicator")
            .at(0)
            .find(".indicator-name")
            .text()
        ).to.equal(responseData[0].indicators[0].indicatorName);
        expect(
          firstIndicatorElement
            .findAll(".indicator")
            .at(0)
            .find(".indicator-def")
            .text()
        ).to.equal(responseData[0].indicators[0].indicatorDefinition);
        expect(
          firstIndicatorElement.findAll(".indicator").at(0).findAll(".score")
            .length
        ).to.equal(responseData[0].indicators[0].scores.length - 1);
        expect(
          firstIndicatorElement
            .findAll(".indicator")
            .at(0)
            .findAll(".score")
            .at(0)
            .findAll("span")
            .at(0)
            .text()
        ).to.equal(responseData[0].indicators[0].scores[0].score.toString());
        expect(
          firstIndicatorElement
            .findAll(".indicator")
            .at(0)
            .findAll(".score")
            .at(0)
            .findAll("span")
            .at(1)
            .text()
        ).to.equal(responseData[0].indicators[0].scores[0].scoreDefinition);
        done();
      });
    });
  });
  it("should update the showCategory variable of the category when the category name is clicked", (done) => {
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({ statues: 200, response: responseData }).then(() => {
        const firstIndicatorElement = wrapper
          .findAll(".indicator-details")
          .at(0);
        firstIndicatorElement.find(".sub-header").trigger("click");
        expect(wrapper.vm.categoricalIndicators[0]["showCategory"]).to.equal(
          false
        );
        done();
      });
    });
  });
  afterEach(() => {
    moxios.uninstall();
  });
});
