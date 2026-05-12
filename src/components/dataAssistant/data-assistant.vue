<template>
  <div class="gdhm-assistant">
    <transition name="gdhm-assistant-panel">
      <section
        v-if="isOpen"
        class="gdhm-assistant__panel"
        aria-label="GDHM Assistant"
        data-testid="chat-panel"
      >
        <header class="gdhm-assistant__header">
          <div class="gdhm-assistant__brand">
            <div class="gdhm-assistant__bot-mark" aria-hidden="true">
              <AssistantBotIcon class="gdhm-assistant__bot-svg" />
            </div>
            <div class="gdhm-assistant__brand-copy">
              <div class="gdhm-assistant__title">
                {{ currentCopy.title }}
              </div>
              <div class="gdhm-assistant__subtitle">
                {{ currentCopy.subtitle }}
              </div>
            </div>
          </div>
          <button
            class="gdhm-assistant__close"
            :aria-label="currentCopy.close"
            @click="closePanel"
          >
            <i class="fa fa-times" aria-hidden="true"></i>
          </button>
        </header>

        <div ref="messages" class="gdhm-assistant__messages">
          <DataAssistantMessage
            v-for="message in messages"
            :key="message.id"
            :message="message"
            :current-copy="currentCopy"
            :copied-message-id="copiedMessageId"
            @copy="copyMessage"
          />
        </div>

        <footer class="gdhm-assistant__footer">
          <div
            v-if="streamError"
            class="gdhm-assistant__retry"
            data-testid="chat-retry"
          >
            <span>{{ streamError }}</span>
            <button
              class="gdhm-assistant__retry-button"
              data-testid="chat-retry-button"
              :disabled="hasPendingAssistant"
              @click="retryLastMessage"
            >
              {{ currentCopy.retry }}
            </button>
          </div>

          <div class="gdhm-assistant__composer">
            <textarea
              ref="input"
              v-model="draft"
              class="gdhm-assistant__input"
              rows="2"
              :placeholder="currentCopy.placeholder"
              data-testid="chat-input"
              @keydown.enter.exact.prevent="sendMessage"
            />
            <button
              class="gdhm-assistant__send"
              data-testid="chat-send"
              :disabled="!draft.trim() || hasPendingAssistant"
              @click="sendMessage"
            >
              <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
            </button>
          </div>

          <div
            class="gdhm-assistant__footer-meta"
            data-testid="chat-footer-meta"
          >
            <div class="gdhm-assistant__footnote">
              {{ currentCopy.disclaimer }}
            </div>

            <div
              class="gdhm-assistant__conversation-actions"
              data-testid="chat-conversation-actions"
            >
              <button
                class="gdhm-assistant__conversation-action gdhm-assistant__conversation-action--primary"
                data-testid="chat-download-conversation"
                :aria-label="currentCopy.downloadConversationAction"
                :disabled="!canUseConversationActions"
                :title="currentCopy.downloadConversationAction"
                @click="downloadConversation"
              >
                <i class="fa fa-download" aria-hidden="true"></i>
                <span class="gdhm-assistant__conversation-action-label">
                  {{ currentCopy.downloadConversationLabel }}
                </span>
              </button>
            </div>
          </div>
        </footer>

        <div
          v-if="conversationActionStatus"
          :class="[
            'gdhm-assistant__conversation-status',
            `gdhm-assistant__conversation-status--${conversationActionTone}`,
          ]"
          data-testid="chat-conversation-status"
          role="status"
          aria-live="polite"
        >
          <i
            :class="
              conversationActionTone === 'error'
                ? 'fa fa-exclamation-circle'
                : 'fa fa-check-circle'
            "
            aria-hidden="true"
          ></i>
          <span>{{ conversationActionStatus }}</span>
        </div>
      </section>
    </transition>

    <DataAssistantLauncher
      :current-copy="currentCopy"
      :is-open="isOpen"
      :show-launcher-prompt="showLauncherPrompt"
      :show-launcher-pulse="showLauncherPulse"
      @dismiss-invite="dismissLauncherInvite"
      @toggle="togglePanel"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { streamAiResponse } from "@/common/ai-stream-client";
import AssistantBotIcon from "./assistant-bot-icon.vue";
import { COPY } from "./data-assistant.copy";
import DataAssistantLauncher from "./data-assistant-launcher.vue";
import DataAssistantMessage from "./data-assistant-message.vue";
import {
  ACTION_STATUS_DURATION,
  INVITE_PULSE_DURATION,
  createMessage,
  generateResponseId,
  serializeConversation,
  serializeMessage,
  shouldShowMessageCopy,
  startConversationDownload,
  writeTextToClipboard,
} from "./data-assistant.utils";

export default Vue.extend({
  name: "DataAssistant",
  components: {
    AssistantBotIcon,
    DataAssistantLauncher,
    DataAssistantMessage,
  },
  data() {
    return {
      isOpen: false,
      draft: "",
      messageId: 1,
      messages: [],
      responseId: "",
      streamError: "",
      lastFailedQuestion: "",
      activeRequestController: null,
      launcherPulseTimeoutId: null,
      showLauncherPulse: false,
      showLauncherPrompt: false,
      copiedMessageId: null,
      copiedMessageTimeoutId: null,
      conversationActionStatus: "",
      conversationActionTone: "success",
      conversationActionTimeoutId: null,
    };
  },
  computed: {
    currentLocale() {
      const locale = this.$i18n && this.$i18n.locale ? this.$i18n.locale : "en";
      return COPY[locale] ? locale : "en";
    },
    currentCopy() {
      return COPY[this.currentLocale];
    },
    hasPendingAssistant() {
      return this.messages.some(
        (message) =>
          message.role === "assistant" &&
          (message.isThinking || message.isStreaming)
      );
    },
    canUseConversationActions() {
      return (
        !this.hasPendingAssistant &&
        this.messages.some((message) => message.type !== "welcome")
      );
    },
  },
  mounted() {
    this.resetMessages();
    this.startLauncherInvite();
  },
  beforeDestroy() {
    this.abortActiveRequest();
    this.stopLauncherInvite();
    this.clearCopiedMessageStatus();
    this.clearConversationActionStatus();
  },
  methods: {
    nextId() {
      const next = this.messageId;
      this.messageId += 1;
      return next;
    },
    buildMessage(role, text = "", type = "message") {
      return createMessage(this.nextId(), role, text, type);
    },
    ensureResponseId() {
      if (!this.responseId) {
        this.responseId = generateResponseId();
      }

      return this.responseId;
    },
    startLauncherInvite() {
      if (typeof window === "undefined") {
        return;
      }

      this.showLauncherPulse = true;
      this.showLauncherPrompt = true;
      this.launcherPulseTimeoutId = window.setTimeout(() => {
        this.showLauncherPulse = false;
        this.launcherPulseTimeoutId = null;
      }, INVITE_PULSE_DURATION);
    },
    stopLauncherInvite() {
      this.showLauncherPulse = false;
      this.showLauncherPrompt = false;

      if (this.launcherPulseTimeoutId !== null) {
        clearTimeout(this.launcherPulseTimeoutId);
        this.launcherPulseTimeoutId = null;
      }
    },
    dismissLauncherInvite() {
      this.stopLauncherInvite();
    },
    resetMessages() {
      this.abortActiveRequest();
      this.responseId = "";
      this.streamError = "";
      this.lastFailedQuestion = "";
      this.clearCopiedMessageStatus();
      this.clearConversationActionStatus();
      this.messages = [
        this.buildMessage("assistant", this.currentCopy.welcome, "welcome"),
      ];
    },
    focusPanel() {
      this.$nextTick(() => {
        if (this.$refs.input) {
          this.$refs.input.focus();
        }

        this.scrollToBottom();
      });
    },
    togglePanel() {
      this.isOpen = !this.isOpen;

      if (this.isOpen) {
        this.dismissLauncherInvite();
        this.focusPanel();
      }
    },
    closePanel() {
      this.isOpen = false;
    },
    setCopiedMessageStatus(messageId) {
      if (this.copiedMessageTimeoutId !== null) {
        clearTimeout(this.copiedMessageTimeoutId);
      }

      this.copiedMessageId = messageId;
      this.copiedMessageTimeoutId = setTimeout(() => {
        this.copiedMessageId = null;
        this.copiedMessageTimeoutId = null;
      }, ACTION_STATUS_DURATION);
    },
    clearCopiedMessageStatus() {
      if (this.copiedMessageTimeoutId !== null) {
        clearTimeout(this.copiedMessageTimeoutId);
        this.copiedMessageTimeoutId = null;
      }

      this.copiedMessageId = null;
    },
    setConversationActionStatus(status, tone = "success") {
      if (this.conversationActionTimeoutId !== null) {
        clearTimeout(this.conversationActionTimeoutId);
      }

      this.conversationActionStatus = status;
      this.conversationActionTone = tone;
      this.conversationActionTimeoutId = setTimeout(() => {
        this.conversationActionStatus = "";
        this.conversationActionTone = "success";
        this.conversationActionTimeoutId = null;
      }, ACTION_STATUS_DURATION);
    },
    clearConversationActionStatus() {
      if (this.conversationActionTimeoutId !== null) {
        clearTimeout(this.conversationActionTimeoutId);
        this.conversationActionTimeoutId = null;
      }

      this.conversationActionStatus = "";
      this.conversationActionTone = "success";
    },
    async copyMessage(message) {
      if (!shouldShowMessageCopy(message)) {
        return;
      }

      try {
        await writeTextToClipboard(serializeMessage(message, this.currentCopy));
        this.clearConversationActionStatus();
        this.setCopiedMessageStatus(message.id);
      } catch (error) {
        this.setConversationActionStatus(this.currentCopy.actionError, "error");
      }
    },
    downloadConversation() {
      if (!this.canUseConversationActions) {
        return;
      }

      try {
        if (
          typeof window !== "undefined" &&
          typeof window.confirm === "function" &&
          !window.confirm(this.currentCopy.confirmDownloadConversation)
        ) {
          return;
        }

        startConversationDownload(
          serializeConversation(this.messages, this.currentCopy)
        );
        this.setConversationActionStatus(
          this.currentCopy.downloadedConversation
        );
      } catch (error) {
        this.setConversationActionStatus(this.currentCopy.actionError, "error");
      }
    },
    async sendMessage() {
      const question = this.draft.trim();

      if (!question || this.hasPendingAssistant) {
        return;
      }

      this.messages.push(this.buildMessage("user", question));
      this.draft = "";
      this.streamError = "";
      this.lastFailedQuestion = "";
      this.clearCopiedMessageStatus();
      this.clearConversationActionStatus();
      this.scrollToBottom();
      await this.startAssistantStream(question);
    },
    async retryLastMessage() {
      if (!this.lastFailedQuestion || this.hasPendingAssistant) {
        return;
      }

      const question = this.lastFailedQuestion;
      const existingMessage = [...this.messages].reverse().find(
        (m) => m.role === "assistant" && m.errorText
      );
      this.streamError = "";
      this.lastFailedQuestion = "";
      this.clearCopiedMessageStatus();
      this.clearConversationActionStatus();
      await this.startAssistantStream(question, existingMessage);
    },
    async startAssistantStream(question, existingMessage = null) {
      this.abortActiveRequest();

      const assistantMessage = existingMessage || this.buildMessage("assistant");
      assistantMessage.text = "";
      assistantMessage.errorText = "";
      assistantMessage.isThinking = true;
      assistantMessage.thinkingText = this.currentCopy.thinking;
      assistantMessage.isStreaming = false;

      if (!existingMessage) {
        this.messages.push(assistantMessage);
      }

      this.scrollToBottom();

      const controller =
        typeof AbortController === "function" ? new AbortController() : null;
      this.activeRequestController = controller;

      try {
        await streamAiResponse({
          query: question,
          responseId: this.ensureResponseId(),
          userLanguage: this.currentLocale,
          signal: controller ? controller.signal : undefined,
          onResponseId: (nextResponseId) => {
            if (nextResponseId) {
              this.responseId = nextResponseId;
            }
          },
          onChunk: (chunk) => {
            if (chunk === null || chunk === undefined) {
              return;
            }

            assistantMessage.isThinking = false;
            assistantMessage.isStreaming = true;
            assistantMessage.text += chunk;
            this.scrollToBottom();
          },
        });

        if (assistantMessage.text === "") {
          assistantMessage.text = this.currentCopy.emptyResponse;
        }
      } catch (error) {
        if (error && error.name === "AbortError") {
          return;
        }

        if (assistantMessage.text === "") {
          assistantMessage.text = this.currentCopy.errorReply;
        }

        assistantMessage.errorText = this.currentCopy.retryNotice;
        this.streamError = this.currentCopy.streamError;
        this.lastFailedQuestion = question;
        this.scrollToBottom();
      } finally {
        assistantMessage.isThinking = false;
        assistantMessage.isStreaming = false;

        if (this.activeRequestController === controller) {
          this.activeRequestController = null;
        }

        this.scrollToBottom();
      }
    },
    abortActiveRequest() {
      if (
        this.activeRequestController &&
        typeof this.activeRequestController.abort === "function"
      ) {
        this.activeRequestController.abort();
      }

      this.activeRequestController = null;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messages;

        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
  },
  watch: {
    currentLocale(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.resetMessages();
      }
    },
  },
});
</script>

<style src="./data-assistant.scss" lang="scss"></style>
