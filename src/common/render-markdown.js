import DOMPurify from "dompurify";
import katex from "katex";
import { marked } from "marked";

marked.use({
  breaks: true,
  gfm: true,
});

const TABLE_TRAILING_TEXT_OPENERS = /(Each|These|This|The|If|For|In|A|An|To)\b/;
const TABLE_DELIMITER_PATTERN =
  /\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*){2,}\|?/;
const LIST_TRAILING_TEXT_OPENERS =
  /(If you need|If you'd like|Let me know|Feel free to ask|Would you like|I can also)\b/;

function trimWrappedContent(source, pattern, wrap) {
  return source.replace(pattern, (match, ...captures) => {
    const groups = captures.slice(0, -2);
    const content = groups[groups.length - 1];
    const trimmed = typeof content === "string" ? content.trim() : "";

    if (!trimmed) {
      return match;
    }

    return wrap(groups, trimmed);
  });
}

function looksLikeInlineTable(line) {
  const pipeCount = (line.match(/\|/g) || []).length;

  return pipeCount >= 5 && /\|\|/.test(line) && /\|\|\s*:?-{3,}/.test(line);
}

function splitTrailingTableText(line) {
  return line.replace(
    new RegExp(
      `(\\|[^|\\n]+?[.!?])\\s*(?=${TABLE_TRAILING_TEXT_OPENERS.source})`,
      "g"
    ),
    "$1 |\n\n"
  );
}

function extractTablePrefixAndHeader(beforeDelimiter) {
  const trimmedBefore = beforeDelimiter.trimEnd();
  const firstPipeIndex = trimmedBefore.indexOf("|");

  if (firstPipeIndex === -1) {
    return null;
  }

  const leadingText = trimmedBefore.slice(0, firstPipeIndex).trim();

  if (leadingText && /[:.!?]$/.test(leadingText)) {
    return {
      prefix: leadingText,
      headerRow: trimmedBefore.slice(firstPipeIndex).trim(),
    };
  }

  return {
    prefix: "",
    headerRow: trimmedBefore.trim(),
  };
}

function normalizeInlineTables(source) {
  return source
    .split("\n")
    .map((line) => {
      if (!looksLikeInlineTable(line)) {
        return line;
      }

      let normalizedLine = line.trim().replace(/\s*\|\|\s*/g, " |\n| ");
      normalizedLine = splitTrailingTableText(normalizedLine);

      return normalizedLine;
    })
    .join("\n");
}

function normalizeLooseInlineTables(source) {
  return source
    .split("\n")
    .map((line) => {
      if (!TABLE_DELIMITER_PATTERN.test(line)) {
        return line;
      }

      const normalizedLine = splitTrailingTableText(line.trim());
      const delimiterMatch = TABLE_DELIMITER_PATTERN.exec(normalizedLine);

      if (!delimiterMatch || delimiterMatch.index === undefined) {
        return normalizedLine;
      }

      const beforeDelimiter = normalizedLine.slice(0, delimiterMatch.index);
      const afterDelimiter = normalizedLine.slice(
        delimiterMatch.index + delimiterMatch[0].length
      );
      const tableStart = extractTablePrefixAndHeader(beforeDelimiter);

      if (!tableStart) {
        return normalizedLine;
      }

      const { prefix, headerRow } = tableStart;
      const delimiterRow = delimiterMatch[0].trim();
      const rows = [];
      let remaining = afterDelimiter.trimStart();

      while (remaining) {
        const rowMatch = remaining.match(
          /^(\|?\s*[^|\n]+(?:\|\s*[^|\n]+){2,}\|?)(?:\s+|$)/
        );

        if (!rowMatch) {
          break;
        }

        rows.push(rowMatch[1].trim());
        remaining = remaining.slice(rowMatch[0].length).trimStart();
      }

      if (!rows.length) {
        return normalizedLine;
      }

      const suffix = remaining.trim();

      return [
        prefix,
        prefix ? "" : null,
        headerRow,
        delimiterRow,
        ...rows,
        suffix ? "" : null,
        suffix,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");
}

function normalizeBrokenHeadingLines(source) {
  return source
    .split("\n")
    .flatMap((line) => {
      const boldParagraphMatch = line.match(
        /^(#{1,6}\s.+?[?!])\s*(\*\*.+?[.!?:](?:.+)?)$/
      );

      if (boldParagraphMatch) {
        return [
          boldParagraphMatch[1].trimEnd(),
          "",
          boldParagraphMatch[2].trimStart(),
        ];
      }

      const proseParagraphMatch = line.match(
        /^(#{1,6}\s.+?[?!])\s*([A-Z0-9].*[.!?:](?:.+)?)$/
      );

      if (proseParagraphMatch) {
        return [
          proseParagraphMatch[1].trimEnd(),
          "",
          proseParagraphMatch[2].trimStart(),
        ];
      }

      const listMatch = line.match(/^(#{1,6}\s.+?\))(-\s.+)$/);

      if (listMatch) {
        return [listMatch[1].trimEnd(), listMatch[2].trimStart()];
      }

      return [line];
    })
    .join("\n");
}

function normalizeCollapsedListLines(source) {
  return source
    .split("\n")
    .flatMap((line) => {
      if (!/^(\d+\.\s|[-*+]\s)/.test(line.trimStart())) {
        return [line];
      }

      const normalizedLine = line
        .replace(/([.!?])\s+(?=\d+\.\s)/g, "$1\n")
        .replace(
          new RegExp(
            `([.!?])\\s+(?=${LIST_TRAILING_TEXT_OPENERS.source})`,
            "g"
          ),
          "$1\n\n"
        );

      return normalizedLine.split("\n");
    })
    .join("\n");
}

function normalizeBrokenBulletGroups(source) {
  const lines = source.split("\n");
  const normalized = [];
  let inUnorderedList = false;

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      normalized.push(line);
      return;
    }

    if (/^[-*+]\s/.test(trimmed)) {
      normalized.push(trimmed);
      inUnorderedList = true;
      return;
    }

    if (
      inUnorderedList &&
      /^\s+[A-Z][^.!?]{0,80}:\s/.test(line) &&
      !/^\s+\d+\.\s/.test(line)
    ) {
      normalized.push(`- ${trimmed}`);
      return;
    }

    if (
      inUnorderedList &&
      /^\s*[a-z]/.test(line) &&
      /(?:as follows:|calculated|computed)/i.test(trimmed)
    ) {
      normalized.push("");
      normalized.push(trimmed);
      inUnorderedList = false;
      return;
    }

    normalized.push(line);
    inUnorderedList = false;
  });

  return normalized.join("\n");
}

function tokenizeMathExpressions(source) {
  const expressions = [];
  let normalized = source;

  normalized = normalized.replace(
    /\\\[\s*([\s\S]+?)\s*(?:\\\]|])(?=(?:\s|[A-Z"'`(]|$))/g,
    (_, expression) => {
      const index =
        expressions.push({
          displayMode: true,
          expression: expression.trim(),
        }) - 1;

      return `\n\n<div data-gdhm-math="${index}"></div>\n\n`;
    }
  );

  normalized = normalized.replace(
    /\\\(\s*([\s\S]+?)\s*(?:\\\)|\))/g,
    (_, expression) => {
      const index =
        expressions.push({
          displayMode: false,
          expression: expression.trim(),
        }) - 1;

      return `<span data-gdhm-math="${index}"></span>`;
    }
  );

  return {
    expressions,
    source: normalized,
  };
}

function normalizeMarkdown(markdown) {
  let normalized = typeof markdown === "string" ? markdown : "";

  normalized = normalized.replace(/\r\n?/g, "\n");
  normalized = normalizeInlineTables(normalized);
  normalized = normalizeLooseInlineTables(normalized);

  // Split malformed headings away from paragraph prose before sentence repair runs.
  normalized = normalized.replace(
    /(^|\n)(#{1,6}\s[^\n]*?[?!])(?=(\*\*|[A-Z0-9]))/g,
    "$1$2\n\n"
  );
  normalized = normalized.replace(
    /(^|\n)(#{1,6}\s[^\n]*?[?!])\s+(?=[A-Z0-9])/g,
    "$1$2\n\n"
  );
  normalized = normalized.replace(
    /(^|\n)(#{1,6}\s[^\n]*?\))(?=-\s)/g,
    "$1$2\n"
  );

  // Repair streamed sentence joins such as "maturity.Here".
  normalized = normalized.replace(/([.!?])(?=[A-Z0-9])/g, "$1 ");

  // Give markdown block syntax room to render when it is appended inline.
  normalized = normalized.replace(/([.!?:])(?=#{1,6}(?:\s|\S))/g, "$1\n\n");
  normalized = normalized.replace(/([)])(?=#{3,6}(?:\s|[A-Z0-9]))/g, "$1\n\n");
  normalized = normalized.replace(/([.!?:])(?=>(?:\s|\S))/g, "$1\n\n");
  normalized = normalized.replace(/([.!?:)])(?=-\s)/g, "$1\n");
  normalized = normalized.replace(
    /([.!?:])\s*(?=\d+\.(?:\s|[A-Za-z]))/g,
    "$1\n"
  );
  normalized = normalized.replace(/([.!?:])(?=(?:```|~~~))/g, "$1\n\n");
  normalized = normalized.replace(
    /(\*\*|__|~~|`)(?=[-*+]\s|\d+\.(?:\s|[A-Za-z]))/g,
    "$1\n"
  );
  normalized = normalizeBrokenHeadingLines(normalized);
  normalized = normalizeCollapsedListLines(normalized);
  normalized = normalizeBrokenBulletGroups(normalized);

  // Add the expected spacing to line-start markdown syntax.
  normalized = normalized.replace(/(^|\n)(#{1,6})(?!#)(\S)/g, "$1$2 $3");
  normalized = normalized.replace(/(^|\n)>(\S)/g, "$1> $2");
  normalized = normalized.replace(/(^|\n)\.\s+(?=\*\*)/g, (_, prefix) => {
    return `${prefix}1. `;
  });
  normalized = normalized.replace(/(^|\n)(\d+\.)([A-Za-z0-9])/g, "$1$2 $3");
  normalized = normalized.replace(/(^|\n)([-*+])([A-Za-z(])/g, "$1$2 $3");

  normalized = normalized.replace(
    /([.!?])\s+(?=(?:If you need|If you'd like|Let me know|Feel free to ask|Would you like|I can also)\b)/g,
    "$1\n\n"
  );

  // Split adjacent list items that arrived without line breaks.
  normalized = normalized.replace(/(\*\*)(?=-\s+\*\*)/g, "$1\n");
  normalized = normalized.replace(/([^\n])(?=-\s+\*\*)/g, "$1\n");

  // Promote only true label-style lines directly under a heading into bullets.
  normalized = normalized.replace(
    /((?:^|\n)#{1,6}[^\n]*\n)\s*(\*\*[^*\n]+?\*\*)(?=\s*(?:\n|$))/g,
    "$1- $2"
  );
  normalized = normalized.replace(
    /((?:^|\n)#{1,6}[^\n]*\n)\s*(\*\*[^*\n]+?:\*\*[^\n]*)(?=\n|$)/g,
    "$1- $2"
  );

  // Repair inline formatting when streamed spaces land inside delimiters.
  normalized = trimWrappedContent(
    normalized,
    /\*\*([^*\n]*?)\*\*/g,
    (_, trimmed) => `**${trimmed}**`
  );
  normalized = trimWrappedContent(
    normalized,
    /__([^_\n]*?)__/g,
    (_, trimmed) => `__${trimmed}__`
  );
  normalized = trimWrappedContent(
    normalized,
    /~~([^~\n]*?)~~/g,
    (_, trimmed) => `~~${trimmed}~~`
  );
  normalized = trimWrappedContent(
    normalized,
    /(^|[\s([{"'])\*([^*\n]+?)\*(?=$|[\s).,!?:;\]}"'])/gm,
    ([prefix], trimmed) => `${prefix}*${trimmed}*`
  );
  normalized = trimWrappedContent(
    normalized,
    /(^|[\s([{"'])_([^_\n]+?)_(?=$|[\s).,!?:;\]}"'])/gm,
    ([prefix], trimmed) => `${prefix}_${trimmed}_`
  );

  // Trim whitespace inside markdown link and image URLs.
  normalized = normalized.replace(
    /(!?\[[^\]]*?\])\(\s*([^)]+?)\s*\)/g,
    "$1($2)"
  );

  normalized = normalized.replace(/\n{3,}/g, "\n\n");

  return normalized.trim();
}

function enhanceRenderedHtml(html, mathTokens = []) {
  if (typeof DOMParser === "undefined") {
    return html;
  }

  const documentFragment = new DOMParser().parseFromString(html, "text/html");

  documentFragment.querySelectorAll("a[href]").forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  documentFragment.querySelectorAll("table").forEach((table) => {
    table.classList.add("gdhm-assistant__rendered-table");

    if (
      table.parentElement &&
      table.parentElement.classList.contains("gdhm-assistant__table-wrap")
    ) {
      return;
    }

    const wrapper = documentFragment.createElement("div");
    wrapper.className = "gdhm-assistant__table-wrap";
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });

  documentFragment.querySelectorAll("[data-gdhm-math]").forEach((node) => {
    const tokenIndex = Number(node.getAttribute("data-gdhm-math"));
    const token = Number.isNaN(tokenIndex) ? null : mathTokens[tokenIndex];

    if (!token) {
      return;
    }

    node.className = token.displayMode
      ? "gdhm-assistant__math-block"
      : "gdhm-assistant__math-inline";
    node.removeAttribute("data-gdhm-math");

    try {
      node.innerHTML = katex.renderToString(token.expression, {
        displayMode: token.displayMode,
        strict: "ignore",
        throwOnError: false,
      });
    } catch (error) {
      node.textContent = token.expression;
    }
  });

  return documentFragment.body.innerHTML;
}

export function renderMarkdown(markdown) {
  const source = normalizeMarkdown(markdown);
  const { expressions, source: mathReadySource } =
    tokenizeMathExpressions(source);
  const parsedHtml = marked.parse(mathReadySource);
  const safeHtml = DOMPurify.sanitize(parsedHtml, {
    USE_PROFILES: { html: true },
  });

  return enhanceRenderedHtml(safeHtml, expressions);
}
