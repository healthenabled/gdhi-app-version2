<template>
  <div>
    <div
      v-if="showLauncherPrompt && !isOpen"
      class="gdhm-assistant__launcher-invite"
      data-testid="chat-launcher-invite"
    >
      <button
        class="gdhm-assistant__launcher-invite-close"
        data-testid="chat-launcher-invite-close"
        :aria-label="currentCopy.dismissInvite"
        :title="currentCopy.dismissInvite"
        @click="$emit('dismiss-invite')"
      >
        <i class="fa fa-times" aria-hidden="true"></i>
      </button>
      <div class="gdhm-assistant__launcher-invite-copy">
        {{ currentCopy.launcherPrompt }}
      </div>
    </div>

    <button
      class="gdhm-assistant__launcher"
      :class="{
        'gdhm-assistant__launcher--invite': showLauncherPulse && !isOpen,
      }"
      data-testid="chat-launcher"
      :aria-label="isOpen ? currentCopy.close : currentCopy.open"
      :title="isOpen ? currentCopy.close : currentCopy.open"
      @click="$emit('toggle')"
    >
      <span class="gdhm-assistant__launcher-label">
        {{ currentCopy.launcherLabel }}
      </span>
      <span class="gdhm-assistant__launcher-shell">
        <span class="gdhm-assistant__launcher-pulse"></span>
        <span class="gdhm-assistant__launcher-ring"></span>
        <span class="gdhm-assistant__launcher-core">
          <AssistantBotIcon
            class="gdhm-assistant__launcher-bot"
            aria-hidden="true"
          />
        </span>
      </span>
    </button>
  </div>
</template>

<script>
import AssistantBotIcon from "./assistant-bot-icon.vue";

export default {
  name: "DataAssistantLauncher",
  components: {
    AssistantBotIcon,
  },
  props: {
    currentCopy: {
      type: Object,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    showLauncherPrompt: {
      type: Boolean,
      default: false,
    },
    showLauncherPulse: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
