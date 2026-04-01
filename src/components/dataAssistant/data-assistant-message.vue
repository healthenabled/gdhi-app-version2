<template>
  <article
    :class="[
      'gdhm-assistant__message',
      `gdhm-assistant__message--${message.role}`,
    ]"
  >
    <div
      v-if="message.role === 'assistant'"
      class="gdhm-assistant__avatar"
      aria-hidden="true"
    >
      <AssistantBotIcon class="gdhm-assistant__avatar-bot" />
    </div>

    <div class="gdhm-assistant__message-body">
      <div class="gdhm-assistant__bubble">
        <div class="gdhm-assistant__label">
          {{
            message.role === "assistant"
              ? currentCopy.assistantLabel
              : currentCopy.userLabel
          }}
        </div>

        <div
          v-if="message.isThinking"
          class="gdhm-assistant__thinking"
          data-testid="chat-thinking"
        >
          <span>{{ message.thinkingText }}</span>
          <span class="gdhm-assistant__thinking-dots">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>

        <div v-else class="gdhm-assistant__text">
          <div
            v-if="message.role === 'assistant'"
            class="gdhm-assistant__markdown"
            v-html="renderAssistantMessage(message.text)"
          ></div>
          <template v-else>{{ message.text }}</template>
          <span
            v-if="message.isStreaming"
            class="gdhm-assistant__cursor"
          ></span>
        </div>

        <div v-if="message.errorText" class="gdhm-assistant__error">
          {{ message.errorText }}
        </div>

        <div
          v-if="message.highlights && message.highlights.length"
          class="gdhm-assistant__highlights"
        >
          <div
            v-for="highlight in message.highlights"
            :key="`${message.id}-${highlight.label}`"
            class="gdhm-assistant__highlight"
          >
            <div class="gdhm-assistant__highlight-label">
              {{ highlight.label }}
            </div>
            <div class="gdhm-assistant__highlight-value">
              {{ highlight.value }}
            </div>
          </div>
        </div>

        <div
          v-if="message.sources && message.sources.length"
          class="gdhm-assistant__sources"
        >
          <div class="gdhm-assistant__sources-title">
            {{ currentCopy.sources }}
          </div>
          <div
            v-for="source in message.sources"
            :key="`${message.id}-${source}`"
            class="gdhm-assistant__source"
          >
            {{ source }}
          </div>
        </div>
      </div>

      <div v-if="canCopyMessage" class="gdhm-assistant__message-actions">
        <button
          class="gdhm-assistant__message-action"
          :data-testid="`chat-copy-message-${message.id}`"
          :aria-label="currentCopy.copyMessageAction"
          :title="currentCopy.copyMessageAction"
          @click="$emit('copy', message)"
        >
          <i class="fa fa-copy" aria-hidden="true"></i>
        </button>
        <span
          v-if="copiedMessageId === message.id"
          class="gdhm-assistant__message-action-status"
          :data-testid="`chat-copy-status-${message.id}`"
        >
          {{ currentCopy.copiedMessage }}
        </span>
      </div>
    </div>
  </article>
</template>

<script>
import { renderMarkdown } from "@/common/render-markdown";
import { shouldShowMessageCopy } from "./data-assistant.utils";
import AssistantBotIcon from "./assistant-bot-icon.vue";

export default {
  name: "DataAssistantMessage",
  components: {
    AssistantBotIcon,
  },
  props: {
    copiedMessageId: {
      type: Number,
      default: null,
    },
    currentCopy: {
      type: Object,
      required: true,
    },
    message: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canCopyMessage() {
      return shouldShowMessageCopy(this.message);
    },
  },
  methods: {
    renderAssistantMessage(text) {
      return renderMarkdown(text);
    },
  },
};
</script>
