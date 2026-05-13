import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import flushPromises from "flush-promises";
import { AI_STREAM_ENDPOINT } from "@/common/ai-stream-client";
import DataAssistant from "../dataAssistant/data-assistant.vue";

const encoder = new TextEncoder();

function createHeaders(headers = {}) {
  const normalizedHeaders = Object.entries(headers).reduce(
    (normalized, [key, value]) => ({
      ...normalized,
      [key.toLowerCase()]: value,
    }),
    {},
  );

  return {
    get(name) {
      return normalizedHeaders[String(name).toLowerCase()] || null;
    },
  };
}

function createStreamResponse(chunks, headers = {}) {
  const readerChunks = chunks.flatMap(({ delay, value, close }) => {
    const entries = [];

    if (value) {
      entries.push({ delay, value: encoder.encode(value), done: false });
    }

    if (close) {
      entries.push({ delay, done: true });
    }

    return entries;
  });

  return {
    ok: true,
    status: 200,
    headers: createHeaders({
      "content-type": "text/event-stream",
      ...headers,
    }),
    body: {
      getReader() {
        let index = 0;

        return {
          read() {
            const nextChunk = readerChunks[index];
            index += 1;

            if (!nextChunk) {
              return Promise.resolve({ done: true });
            }

            return new Promise((resolve) => {
              setTimeout(() => {
                resolve({
                  done: nextChunk.done,
                  value: nextChunk.value,
                });
              }, nextChunk.delay);
            });
          },
        };
      },
    },
    text: async () => chunks.map(({ value }) => value || "").join(""),
  };
}

describe("Data Assistant", () => {
  let originalFetch;
  let originalClipboard;
  let originalShare;
  let originalCreateObjectURL;
  let originalRevokeObjectURL;
  let originalLocalStorage;
  let originalConfirm;
  let storageState;

  beforeEach(() => {
    vi.useFakeTimers();
    originalFetch = window.fetch;
    originalClipboard = window.navigator.clipboard;
    originalShare = window.navigator.share;
    originalCreateObjectURL = URL.createObjectURL;
    originalRevokeObjectURL = URL.revokeObjectURL;
    originalLocalStorage = window.localStorage;
    originalConfirm = window.confirm;
    window.fetch = vi.fn();
    storageState = {};

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      writable: true,
      value: {
        getItem: vi.fn((key) =>
          Object.prototype.hasOwnProperty.call(storageState, key)
            ? storageState[key]
            : null,
        ),
        setItem: vi.fn((key, value) => {
          storageState[key] = String(value);
        }),
        removeItem: vi.fn((key) => {
          delete storageState[key];
        }),
        clear: vi.fn(() => {
          storageState = {};
        }),
      },
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    window.fetch = originalFetch;
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      writable: true,
      value: originalClipboard,
    });
    Object.defineProperty(window.navigator, "share", {
      configurable: true,
      writable: true,
      value: originalShare,
    });
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      writable: true,
      value: originalCreateObjectURL,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      writable: true,
      value: originalRevokeObjectURL,
    });
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      writable: true,
      value: originalLocalStorage,
    });
    Object.defineProperty(window, "confirm", {
      configurable: true,
      writable: true,
      value: originalConfirm,
    });
  });

  it("shows an Ask GDHM label, hides the invite when opened, and brings it back on refresh", async () => {
    const firstWrapper = mount(DataAssistant, {
      mocks: {
        $i18n: { locale: "en" },
      },
    });
    await firstWrapper.vm.$nextTick();

    const launcher = firstWrapper.find('[data-testid="chat-launcher"]');
    expect(launcher.text()).to.contain("Ask GDHM");
    expect(launcher.classes()).to.contain("gdhm-assistant__launcher--invite");
    expect(
      firstWrapper.find('[data-testid="chat-launcher-invite"]').text(),
    ).to.contain(firstWrapper.vm.currentCopy.launcherPrompt);
    expect(
      firstWrapper.find('[data-testid="chat-launcher-invite-close"]').exists(),
    ).to.equal(true);

    await launcher.trigger("click");
    expect(
      firstWrapper.find('[data-testid="chat-launcher-invite"]').exists(),
    ).to.equal(false);
    expect(firstWrapper.text()).to.contain(
      "Hello! I can answer questions about digital health maturity across 100+ countries, including trends, regional comparisons, and indicator breakdowns. What would you like to explore?",
    );

    firstWrapper.destroy();

    const secondWrapper = mount(DataAssistant, {
      mocks: {
        $i18n: { locale: "en" },
      },
    });
    await secondWrapper.vm.$nextTick();

    expect(
      secondWrapper.find('[data-testid="chat-launcher"]').classes(),
    ).to.contain("gdhm-assistant__launcher--invite");
    expect(
      secondWrapper.find('[data-testid="chat-launcher-invite"]').text(),
    ).to.contain(secondWrapper.vm.currentCopy.launcherPrompt);
    secondWrapper.destroy();
  });

  it("lets users dismiss the launcher invite without opening the chatbot and shows it again on refresh", async () => {
    const firstWrapper = mount(DataAssistant, {
      mocks: {
        $i18n: { locale: "en" },
      },
    });
    await firstWrapper.vm.$nextTick();

    await firstWrapper
      .find('[data-testid="chat-launcher-invite-close"]')
      .trigger("click");

    expect(
      firstWrapper.find('[data-testid="chat-launcher-invite"]').exists(),
    ).to.equal(false);
    expect(firstWrapper.find('[data-testid="chat-panel"]').exists()).to.equal(
      false,
    );

    firstWrapper.destroy();

    const secondWrapper = mount(DataAssistant, {
      mocks: {
        $i18n: { locale: "en" },
      },
    });
    await secondWrapper.vm.$nextTick();

    expect(
      secondWrapper.find('[data-testid="chat-launcher-invite"]').text(),
    ).to.contain(secondWrapper.vm.currentCopy.launcherPrompt);
    secondWrapper.destroy();
  });

  it("opens the floating panel, streams live output, and reuses the conversation responseId", async () => {
    window.fetch.mockResolvedValueOnce(
      createStreamResponse(
        [
          {
            delay: 0,
            value:
              "data:Hello\n\ndata:!\n\ndata: I\n\ndata: am\n\ndata: the\n\ndata: GD\n\ndata:HM\n\ndata: AI\n\ndata: Assistant\n\ndata:.\n\n",
          },
          {
            delay: 10,
            close: true,
          },
        ],
        { "x-response-id": "country-dashboard-001" },
      ),
    );

    window.fetch.mockResolvedValueOnce(
      createStreamResponse([
        {
          delay: 0,
          value:
            "data:Certainly\n\ndata:!\n\ndata: Here\n\ndata: are\n\ndata: some\n\ndata: indicators\n\ndata: from\n\ndata: the\n\ndata: GD\n\ndata:HM\n\ndata: framework\n\ndata::\n\ndata:\n\ndata:###\n\ndata: Leadership\n\ndata: and\n\ndata: Governance\n\ndata:\n\ndata:-\n\ndata: **\n\ndata:Indicator\n\ndata: 1\n\ndata: —\n\ndata: Dedicated\n\ndata: digital\n\ndata: health\n\ndata: governance\n\ndata: body\n\ndata:**\n\n",
        },
        {
          delay: 10,
          close: true,
        },
      ]),
    );

    const wrapper = mount(DataAssistant, {
      mocks: {
        $i18n: { locale: "en" },
      },
    });

    await wrapper.find('[data-testid="chat-launcher"]').trigger("click");
    expect(wrapper.find('[data-testid="chat-panel"]').exists()).to.equal(true);
    expect(wrapper.text()).to.contain("GDHM Assistant");
    expect(wrapper.text()).to.contain("Powered by Amazon Bedrock");
    expect(wrapper.text()).to.contain("Ask GDHM");
    expect(wrapper.text()).not.to.contain("Live stream");

    await wrapper
      .find('[data-testid="chat-input"]')
      .setValue("What phase is Kenya in and which categories are lowest?");
    await wrapper.find('[data-testid="chat-send"]').trigger("click");

    expect((wrapper.text().match(/\bYou\b/g) || []).length).to.equal(1);

    expect(wrapper.find('[data-testid="chat-thinking"]').exists()).to.equal(
      true,
    );
    expect(wrapper.text()).to.contain("Thinking...");

    await vi.runAllTimersAsync();
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).to.contain("Hello! I am the GDHM AI Assistant.");
    expect(wrapper.find('[data-testid="chat-retry"]').exists()).to.equal(false);
    expect(wrapper.text()).not.to.contain(
      "Which countries improved the most in the latest year?",
    );
    expect(wrapper.text()).to.contain(
      "Hello! I can answer questions about digital health maturity across 100+ countries, including trends, regional comparisons, and indicator breakdowns. What would you like to explore?",
    );
    expect(wrapper.text()).to.contain("AI can make mistakes.");

    const firstPayload = JSON.parse(window.fetch.mock.calls[0][1].body);
    expect(window.fetch.mock.calls[0][0]).to.equal(AI_STREAM_ENDPOINT);
    expect(firstPayload.query).to.equal(
      "What phase is Kenya in and which categories are lowest?",
    );
    expect(firstPayload.responseId).to.be.a("string");

    await wrapper
      .find('[data-testid="chat-input"]')
      .setValue("Compare East Africa against the global average");
    await wrapper.find('[data-testid="chat-send"]').trigger("click");

    await vi.runAllTimersAsync();
    await flushPromises();
    await wrapper.vm.$nextTick();

    const secondPayload = JSON.parse(window.fetch.mock.calls[1][1].body);
    expect(secondPayload.responseId).to.equal("country-dashboard-001");
    expect(wrapper.vm.messages[wrapper.vm.messages.length - 1].text).to.contain(
      "\n### Leadership and Governance\n- **Indicator 1",
    );
    expect(wrapper.text()).to.contain(
      "Certainly! Here are some indicators from the GDHM framework:",
    );
    expect(wrapper.text()).not.to.contain("**");
    expect(wrapper.html()).to.contain("<h3>Leadership and Governance</h3>");
    expect(wrapper.html()).to.contain(
      "<li><strong>Indicator 1 — Dedicated digital health governance body</strong></li>",
    );
  });

  it("shows retry UI when streaming fails and retries with the same local conversation id", async () => {
    window.fetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      headers: createHeaders({
        "content-type": "text/plain",
      }),
      text: async () => "Service unavailable",
    });

    window.fetch.mockResolvedValueOnce(
      createStreamResponse([
        {
          delay: 0,
          value: "data: The service recovered and completed the answer.\n\n",
        },
        {
          delay: 10,
          close: true,
        },
      ]),
    );

    const wrapper = mount(DataAssistant, {
      mocks: {
        $i18n: { locale: "en" },
      },
    });

    await wrapper.find('[data-testid="chat-launcher"]').trigger("click");
    await wrapper
      .find('[data-testid="chat-input"]')
      .setValue("Summarize digital health priorities");
    await wrapper.find('[data-testid="chat-send"]').trigger("click");
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="chat-retry"]').exists()).to.equal(true);
    expect(wrapper.text()).to.contain(
      "The connection was interrupted before the answer finished.",
    );
    expect(wrapper.text()).to.contain(
      "The answer stream stopped before completion.",
    );

    const firstPayload = JSON.parse(window.fetch.mock.calls[0][1].body);

    await wrapper.find('[data-testid="chat-retry-button"]').trigger("click");
    await vi.runAllTimersAsync();
    await flushPromises();
    await wrapper.vm.$nextTick();

    const secondPayload = JSON.parse(window.fetch.mock.calls[1][1].body);
    expect(secondPayload.responseId).to.equal(firstPayload.responseId);
    expect(wrapper.text()).to.contain(
      "The service recovered and completed the answer.",
    );
    expect(wrapper.find('[data-testid="chat-retry"]').exists()).to.equal(false);
  });

  it("lets users copy a reply and download the entire conversation", async () => {
    const clipboardWriteText = vi.fn().mockResolvedValue(undefined);
    const confirmMock = vi.fn(() => true);
    const clickSpy = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    let lastAnchor = null;

    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      writable: true,
      value: { writeText: clipboardWriteText },
    });
    Object.defineProperty(window, "confirm", {
      configurable: true,
      writable: true,
      value: confirmMock,
    });
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      writable: true,
      value: vi.fn(() => "blob:mock-response"),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });

    const createElementSpy = vi
      .spyOn(document, "createElement")
      .mockImplementation((tagName, options) => {
        const element = originalCreateElement(tagName, options);

        if (tagName === "a") {
          lastAnchor = element;
          element.click = clickSpy;
        }

        return element;
      });

    window.fetch.mockResolvedValueOnce(
      createStreamResponse([
        {
          delay: 0,
          value: "data:Here is a short answer with sources.\n\n",
        },
        {
          delay: 10,
          close: true,
        },
      ]),
    );

    const wrapper = mount(DataAssistant, {
      mocks: {
        $i18n: { locale: "en" },
      },
    });

    await wrapper.find('[data-testid="chat-launcher"]').trigger("click");
    await wrapper
      .find('[data-testid="chat-input"]')
      .setValue("Summarize digital health priorities");
    await wrapper.find('[data-testid="chat-send"]').trigger("click");

    await vi.runAllTimersAsync();
    await flushPromises();
    await wrapper.vm.$nextTick();

    const responseMessage = wrapper.vm.messages[wrapper.vm.messages.length - 1];
    expect(responseMessage.text).to.equal(
      "Here is a short answer with sources.",
    );
    const copyButton = wrapper.find(
      `[data-testid="chat-copy-message-${responseMessage.id}"]`,
    );
    const downloadButton = wrapper.find(
      '[data-testid="chat-download-conversation"]',
    );

    expect(copyButton.attributes("title")).to.equal(
      wrapper.vm.currentCopy.copyMessageAction,
    );
    expect(downloadButton.attributes("title")).to.equal(
      wrapper.vm.currentCopy.downloadConversationAction,
    );
    expect(downloadButton.text()).to.contain(
      wrapper.vm.currentCopy.downloadConversationLabel,
    );

    await copyButton.trigger("click");
    await flushPromises();
    await wrapper.vm.$nextTick();

    const copiedMessage = clipboardWriteText.mock.calls[0][0];
    expect(copiedMessage).to.contain("Here is a short answer with sources.");
    expect(
      wrapper
        .find(`[data-testid="chat-copy-status-${responseMessage.id}"]`)
        .text(),
    ).to.contain("Copied");
    expect(
      wrapper.find('[data-testid="chat-conversation-status"]').exists(),
    ).to.equal(false);

    await downloadButton.trigger("click");
    await wrapper.vm.$nextTick();

    expect(confirmMock).toHaveBeenCalledWith(
      "Download the entire conversation?",
    );
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(lastAnchor.download).to.match(
      /^gdhm-assistant-conversation-\d{4}-\d{2}-\d{2}\.txt$/,
    );
    expect(lastAnchor.href).to.equal("blob:mock-response");
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-response");
    expect(
      wrapper.find('[data-testid="chat-conversation-status"]').text(),
    ).to.contain("Conversation download started.");

    createElementSpy.mockRestore();
  });
});
