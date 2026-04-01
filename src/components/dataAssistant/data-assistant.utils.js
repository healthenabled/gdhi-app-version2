export const ACTION_STATUS_DURATION = 2400;
export const INVITE_PULSE_DURATION = 6000;

export function createMessage(id, role, text = "", type = "message") {
  return {
    id,
    role,
    text,
    type,
    isThinking: false,
    isStreaming: false,
    thinkingText: "",
    highlights: [],
    sources: [],
    errorText: "",
  };
}

export function generateResponseId() {
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return window.crypto.randomUUID();
  }

  return `gdhm-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function shouldShowMessageCopy(message) {
  return (
    message &&
    message.role === "assistant" &&
    message.type !== "welcome" &&
    !message.isThinking &&
    !message.isStreaming &&
    typeof message.text === "string" &&
    message.text.trim() !== ""
  );
}

export function serializeMessage(message, currentCopy) {
  const sections = [];
  const text =
    message && typeof message.text === "string" ? message.text.trim() : "";

  if (text) {
    sections.push(text);
  }

  if (message && message.highlights && message.highlights.length) {
    sections.push(
      message.highlights
        .map((highlight) => `${highlight.label}: ${highlight.value}`)
        .join("\n")
    );
  }

  if (message && message.sources && message.sources.length) {
    sections.push(
      [currentCopy.sources, ...message.sources.map((source) => `- ${source}`)]
        .join("\n")
        .trim()
    );
  }

  return sections.filter(Boolean).join("\n\n").trim();
}

export function serializeConversation(messages, currentCopy) {
  return messages
    .map((message) => {
      const text = serializeMessage(message, currentCopy);

      if (!text) {
        return "";
      }

      const speakerLabel =
        message.role === "assistant"
          ? currentCopy.assistantLabel
          : currentCopy.userLabel;

      return `${speakerLabel}\n${text}`;
    })
    .filter(Boolean)
    .join("\n\n");
}

export async function writeTextToClipboard(text) {
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document === "undefined") {
    throw new Error("Clipboard is unavailable.");
  }

  const fallbackInput = document.createElement("textarea");
  fallbackInput.value = text;
  fallbackInput.setAttribute("readonly", "true");
  fallbackInput.style.position = "fixed";
  fallbackInput.style.opacity = "0";
  document.body.appendChild(fallbackInput);
  fallbackInput.focus();
  fallbackInput.select();

  const didCopy =
    typeof document.execCommand === "function" && document.execCommand("copy");

  document.body.removeChild(fallbackInput);

  if (!didCopy) {
    throw new Error("Clipboard is unavailable.");
  }
}

export function startConversationDownload(conversationText) {
  if (!conversationText || typeof document === "undefined") {
    throw new Error("Download is unavailable.");
  }

  const anchor = document.createElement("a");
  const exportDate = new Date().toISOString().slice(0, 10);
  let objectUrl = "";

  if (typeof Blob === "function" && typeof URL.createObjectURL === "function") {
    objectUrl = URL.createObjectURL(
      new Blob([conversationText], {
        type: "text/plain;charset=utf-8",
      })
    );
    anchor.href = objectUrl;
  } else {
    anchor.href = `data:text/plain;charset=utf-8,${encodeURIComponent(
      conversationText
    )}`;
  }

  anchor.download = `gdhm-assistant-conversation-${exportDate}.txt`;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  if (objectUrl && typeof URL.revokeObjectURL === "function") {
    URL.revokeObjectURL(objectUrl);
  }
}
