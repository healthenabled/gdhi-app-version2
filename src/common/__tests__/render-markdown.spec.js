import { describe, expect, it } from "vitest";
import { renderMarkdown } from "../render-markdown";

describe("renderMarkdown", () => {
  it("repairs common streamed markdown joins before rendering", () => {
    const html = renderMarkdown(
      "The GDHM uses a set of indicators to assess maturity.Here is a summary of the categories and some key indicators:### Leadership and Governance\n **Indicator 1 — Dedicated digital health governance body**- **Indicator 2 — Digital health in national planning**- **Indicator 3 — Emerging technology readiness**"
    );

    expect(html).to.contain(
      "<p>The GDHM uses a set of indicators to assess maturity. Here is a summary of the categories and some key indicators:</p>"
    );
    expect(html).to.contain("<h3>Leadership and Governance</h3>");
    expect(html).to.contain(
      "<li><strong>Indicator 1 — Dedicated digital health governance body</strong></li>"
    );
    expect(html).to.contain(
      "<li><strong>Indicator 2 — Digital health in national planning</strong></li>"
    );
    expect(html).to.contain(
      "<li><strong>Indicator 3 — Emerging technology readiness</strong></li>"
    );
  });

  it("repairs bold markers that arrive with extra spaces inside them", () => {
    const html = renderMarkdown(
      "This is ** very important ** for the maturity summary.\n- ** Indicator 1 **"
    );

    expect(html).to.contain(
      "<p>This is <strong>very important</strong> for the maturity summary.</p>"
    );
    expect(html).to.contain("<li><strong>Indicator 1</strong></li>");
  });

  it("repairs common markdown block formatting from streamed content", () => {
    const html = renderMarkdown(
      "Summary:###Key findings\n1.First item\n2.Second item"
    );

    expect(html).to.contain("<h3>Key findings</h3>");
    expect(html).to.contain("<ol>");
    expect(html).to.contain("<li>First item</li>");
    expect(html).to.contain("<li>Second item</li>");
  });

  it("repairs quoted blocks when they are appended inline", () => {
    const html = renderMarkdown("Quote:>Important note");

    expect(html).to.contain("<blockquote>");
    expect(html).to.contain("<p>Important note</p>");
  });

  it("repairs fenced code blocks when they are appended inline", () => {
    const html = renderMarkdown("Code:```js\nconst value = 1;\n```");

    expect(html).to.contain('<pre><code class="language-js">const value = 1;');
  });

  it("repairs common inline formatting from streamed content", () => {
    const html = renderMarkdown(
      "This is * emphasized * and ~~ removed ~~ and __ highly visible __.\n[Docs]( https://example.com )"
    );

    expect(html).to.contain("<em>emphasized</em>");
    expect(html).to.contain("<del>removed</del>");
    expect(html).to.contain("<strong>highly visible</strong>");
    expect(html).to.contain(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">Docs</a>'
    );
  });

  it("renders stacked GDHM section headings and bold phase labels cleanly", () => {
    const html = renderMarkdown(
      "# Understanding GDHM Indicators\n Global Digital Health Monitor (GDHM) uses a set of indicators to assess the maturity of digital health ecosystems in WHO Member States. These indicators are categorized into several components, each with specific phase criteria. Below is a detailed explanation of the indicators:## Leadership and Governance (LG)### Indicator 1 — Dedicated Digital Health Governance Body\n **P1:** No coordinating body; ad hoc governance.- **P2:** Formally constituted but not fully functional.- **P3:** Has SOW; holds regular meetings with stakeholder participation."
    );

    expect(html).to.contain("<h1>Understanding GDHM Indicators</h1>");
    expect(html).to.contain("<h2>Leadership and Governance (LG)</h2>");
    expect(html).to.contain(
      "<h3>Indicator 1 — Dedicated Digital Health Governance Body</h3>"
    );
    expect(html).to.contain(
      "<li><strong>P1:</strong> No coordinating body; ad hoc governance.</li>"
    );
    expect(html).to.contain(
      "<li><strong>P2:</strong> Formally constituted but not fully functional.</li>"
    );
  });

  it("keeps malformed heading prose out of the heading itself", () => {
    const html = renderMarkdown(
      "### What Does Network Readiness Measure?**Network Readiness** measures a country's preparedness and capability to leverage information and communication technologies (ICT) for economic and social development. It assesses the infrastructure, skills, and policies that enable the effective use of digital technologies.### What Do the Phase Bands Mean?The phase bands for network readiness are typically based on the Network Readiness Index (NRI) scores, which range from 0 to 100. Here's what each phase band generally represents:#### Phase 1: Nascent (0-25)- **Description:** Countries in this phase have minimal ICT infrastructure and limited access to digital technologies."
    );

    expect(html).to.match(
      /<h3[^>]*>What Does Network Readiness Measure\?\s*<\/h3>/
    );
    expect(html).to.contain(
      "<p><strong>Network Readiness</strong> measures a country's preparedness and capability to leverage information and communication technologies (ICT) for economic and social development. It assesses the infrastructure, skills, and policies that enable the effective use of digital technologies.</p>"
    );
    expect(html).to.match(/<h3[^>]*>What Do the Phase Bands Mean\?\s*<\/h3>/);
    expect(html).to.match(/<h4[^>]*>Phase 1: Nascent \(0-25\)<\/h4>/);
    expect(html).to.contain(
      "<li><strong>Description:</strong> Countries in this phase have minimal ICT infrastructure and limited access to digital technologies.</li>"
    );
    expect(html).not.to.contain("<h1></h1>");
  });

  it("repairs collapsed markdown tables and preserves bold cells", () => {
    const html = renderMarkdown(
      "The GDHM uses a maturity scale to assess the progress of digital health initiatives. Here are the maturity scores:### Maturity Scale\n Phase | Label | Description ||-------|-------|-------------|| 1 | **Nascent** | No coordination; ad hoc implementations. || 2 | **Developing** | Plans proposed or approved but not yet functional. || 3 | **Initial Scale** | Formal structures in place; partial implementation. || 4 | **Established** | Fully functional, government-led; consistent monitoring. || 5 | **Optimized** | Institutionalized; nationally recognized; continuously optimized.Each phase represents a different level of maturity in the implementation and integration of digital health initiatives."
    );

    expect(html).to.contain("<h3>Maturity Scale</h3>");
    expect(html).to.contain('<div class="gdhm-assistant__table-wrap">');
    expect(html).to.contain('<table class="gdhm-assistant__rendered-table">');
    expect(html).to.contain("<thead>");
    expect(html).to.contain("<th>Phase</th>");
    expect(html).to.contain("<th>Label</th>");
    expect(html).to.contain("<th>Description</th>");
    expect(html).to.contain("<td>1</td>");
    expect(html).to.contain("<td><strong>Nascent</strong></td>");
    expect(html).to.contain("<td><strong>Optimized</strong></td>");
    expect(html).to.contain(
      "<p>Each phase represents a different level of maturity in the implementation and integration of digital health initiatives.</p>"
    );
  });

  it("repairs single-line tables that follow intro text on the same line", () => {
    const html = renderMarkdown(
      "The GDHM uses a maturity scale: | Phase | Label | Description | |-------|-------|-------------| | 1 | **Nascent** | No coordination; ad hoc implementations. |"
    );

    expect(html).to.contain("<p>The GDHM uses a maturity scale:</p>");
    expect(html).to.contain('<div class="gdhm-assistant__table-wrap">');
    expect(html).to.contain("<th>Phase</th>");
    expect(html).to.contain("<td><strong>Nascent</strong></td>");
  });

  it("repairs collapsed ordered lists and moves trailing helper text out of the list", () => {
    const html = renderMarkdown(
      "In the GDHM, missing data is handled through several mechanisms:1. **Proxy Data**: For countries that have not completed the GDHM survey, certain indicators are pre-populated with proxy data from public sources such as the Global Telemedicine Maturity Index (GTMI), Network Readiness Index (NRI), and GSMA Mobile Connectivity Index.2. **Encouragement for Submission**: Countries are encouraged to submit their own data via the annual GDHM survey. Government-submitted data is considered more accurate and is preferred over proxy data.3. **Verification Process**: All submitted data, whether from the survey or proxy sources, is verified by the GDHM team before being published.4. **Methodology Section**: The methodology section of the GDHM provides detailed information on how data is collected, verified, and used in calculating maturity scores.If you need more specific details or have another question, feel free to ask!"
    );

    expect(html).to.contain(
      "<p>In the GDHM, missing data is handled through several mechanisms:</p>"
    );
    expect(html).to.contain("<ol>");
    expect(html).to.contain(
      "<li><strong>Proxy Data</strong>: For countries that have not completed the GDHM survey, certain indicators are pre-populated with proxy data from public sources such as the Global Telemedicine Maturity Index (GTMI), Network Readiness Index (NRI), and GSMA Mobile Connectivity Index.</li>"
    );
    expect(html).to.contain(
      "<li><strong>Encouragement for Submission</strong>: Countries are encouraged to submit their own data via the annual GDHM survey. Government-submitted data is considered more accurate and is preferred over proxy data.</li>"
    );
    expect(html).to.contain(
      "<li><strong>Verification Process</strong>: All submitted data, whether from the survey or proxy sources, is verified by the GDHM team before being published.</li>"
    );
    expect(html).to.contain(
      "<li><strong>Methodology Section</strong>: The methodology section of the GDHM provides detailed information on how data is collected, verified, and used in calculating maturity scores.</li>"
    );
    expect(html).to.contain(
      "<p>If you need more specific details or have another question, feel free to ask!</p>"
    );
  });

  it("renders malformed example lists and display math more cleanly", () => {
    const html = renderMarkdown(
      String.raw`The GDHM calculates a country’s overall phase by averaging the main indicators. Here’s a detailed explanation:### Calculation of Country’s Overall Phase
. **Main Indicators:** The GDHM uses main indicators to calculate the overall phase. Sub-indicators are not included in this calculation.2. **Phase Assignment:** Each main indicator is assigned a phase based on the criteria provided in the GDHM framework.3. **Averaging:** The phases of all main indicators are averaged to determine the country’s overall phase.### Example
Let’s say a country has the following phases for its main indicators:- Indicator 1: Phase 3
 Indicator 2: Phase 4
 Indicator 3: Phase 2
overall phase would be calculated as follows:\[\text{Overall Phase} = \frac{3 + 4 + 2}{3} = 3
\]Thus, the country’s overall phase would be Phase 3.If you'd like more details on any specific indicator or phase, feel free to ask!`
    );

    expect(html).to.contain("<h3>Calculation of Country’s Overall Phase</h3>");
    expect(html).to.contain(
      "<li><strong>Main Indicators:</strong> The GDHM uses main indicators to calculate the overall phase. Sub-indicators are not included in this calculation.</li>"
    );
    expect(html).to.contain(
      "<li><strong>Phase Assignment:</strong> Each main indicator is assigned a phase based on the criteria provided in the GDHM framework.</li>"
    );
    expect(html).to.contain(
      "<li><strong>Averaging:</strong> The phases of all main indicators are averaged to determine the country’s overall phase.</li>"
    );
    expect(html).to.contain("<h3>Example</h3>");
    expect(html).to.contain("<li>Indicator 1: Phase 3</li>");
    expect(html).to.contain("<li>Indicator 2: Phase 4</li>");
    expect(html).to.contain("<li>Indicator 3: Phase 2</li>");
    expect(html).to.contain('class="gdhm-assistant__math-block"');
    expect(html).to.contain("katex-display");
    expect(html).to.contain(
      "<p>Thus, the country’s overall phase would be Phase 3.</p>"
    );
    expect(html).to.contain(
      "<p>If you'd like more details on any specific indicator or phase, feel free to ask!</p>"
    );
  });
});
