const AI_STREAM_ENDPOINT = "/api/ai/stream";

function applyResponseId(responseId, onResponseId) {
  if (typeof responseId === "string" && responseId.trim()) {
    onResponseId(responseId.trim());
  }
}

function extractChunkPayload(payload, onResponseId) {
  if (typeof payload !== "string" || !payload) {
    return "";
  }

  const trimmedPayload = payload.trim();

  if (trimmedPayload.startsWith("{") && trimmedPayload.endsWith("}")) {
    try {
      const parsedPayload = JSON.parse(trimmedPayload);

      applyResponseId(parsedPayload.responseId, onResponseId);

      if (typeof parsedPayload.chunk === "string") {
        return parsedPayload.chunk;
      }

      if (typeof parsedPayload.text === "string") {
        return parsedPayload.text;
      }

      if (typeof parsedPayload.delta === "string") {
        return parsedPayload.delta;
      }

      if (typeof parsedPayload.content === "string") {
        return parsedPayload.content;
      }

      return "";
    } catch (error) {
      return payload;
    }
  }

  return payload;
}

function createEventStreamParser({ onChunk, onResponseId }) {
  let buffer = "";
  let eventName = "";
  let eventId = "";
  let dataLines = [];
  let sawSseField = false;

  const dispatchEvent = () => {
    if (!eventName && !eventId && !dataLines.length) {
      return;
    }

    const payload = dataLines.join("\n");

    if (eventName === "responseId") {
      applyResponseId(payload || eventId, onResponseId);
    } else {
      const chunk = extractChunkPayload(payload, onResponseId);

      if (chunk || dataLines.length) {
        onChunk(chunk === "" ? "\n" : chunk);
      }
    }

    eventName = "";
    eventId = "";
    dataLines = [];
  };

  const consumeLine = (line) => {
    if (!line) {
      dispatchEvent();
      return;
    }

    if (line.startsWith(":")) {
      sawSseField = true;
      return;
    }

    const separatorIndex = line.indexOf(":");
    const field = separatorIndex === -1 ? line : line.slice(0, separatorIndex);
    let value = separatorIndex === -1 ? "" : line.slice(separatorIndex + 1);

    if (field !== "data" && value.startsWith(" ")) {
      value = value.slice(1);
    }

    if (field === "data" || field === "event" || field === "id") {
      sawSseField = true;
    }

    switch (field) {
      case "data":
        dataLines.push(value);
        break;
      case "event":
        eventName = value;
        break;
      case "id":
        eventId = value;
        break;
      default:
        break;
    }
  };

  return {
    get sawSseField() {
      return sawSseField;
    },
    push(chunk, { flush = false } = {}) {
      buffer += chunk;

      let newlineIndex = buffer.indexOf("\n");

      while (newlineIndex !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) {
          line = line.slice(0, -1);
        }

        consumeLine(line);
        newlineIndex = buffer.indexOf("\n");
      }

      if (flush) {
        if (buffer) {
          let line = buffer;

          if (line.endsWith("\r")) {
            line = line.slice(0, -1);
          }

          if (!sawSseField) {
            onChunk(line);
          } else {
            consumeLine(line);
          }
        }

        buffer = "";
        dispatchEvent();
      }
    },
  };
}

async function getResponseError(response) {
  try {
    const text = await response.text();

    if (text && text.trim()) {
      return text.trim();
    }
  } catch (error) {
    return "";
  }

  return `Request failed with status ${response.status}`;
}

export async function streamAiResponse({
  query,
  responseId,
  userLanguage = "en",
  signal,
  onChunk = () => {},
  onResponseId = () => {},
}) {
  if (typeof fetch !== "function") {
    throw new Error("Streaming is not supported in this browser.");
  }

  const response = await fetch(AI_STREAM_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json",
      user_language: userLanguage,
    },
    body: JSON.stringify({
      query,
      responseId,
      user_language: userLanguage,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(await getResponseError(response));
  }

  applyResponseId(response.headers.get("x-response-id"), onResponseId);
  applyResponseId(response.headers.get("response-id"), onResponseId);

  const contentType = response.headers.get("content-type") || "";
  const isEventStream = contentType.includes("text/event-stream");

  if (!response.body || typeof response.body.getReader !== "function") {
    const text = await response.text();

    if (isEventStream) {
      const parser = createEventStreamParser({ onChunk, onResponseId });
      parser.push(text, { flush: true });
    } else if (text) {
      onChunk(text);
    }

    return;
  }

  const parser = createEventStreamParser({ onChunk, onResponseId });
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let isDone = false;

  while (!isDone) {
    const { done, value } = await reader.read();
    isDone = done;

    if (!value) {
      continue;
    }

    const decodedChunk = decoder.decode(value, { stream: true });

    if (isEventStream) {
      parser.push(decodedChunk);
    } else if (decodedChunk) {
      onChunk(decodedChunk);
    }
  }

  const trailingChunk = decoder.decode();

  if (isEventStream) {
    parser.push(trailingChunk, { flush: true });
  } else if (trailingChunk) {
    onChunk(trailingChunk);
  }
}

export { AI_STREAM_ENDPOINT };
