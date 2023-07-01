<template>
  <div class="user-item-container">
    <div class="user-item-content">
      <Avatar :size="72" :font-size="36" :name="userSession.userName" />
      <div class="user-info">
        <span class="title">{{ userSession.userName }}</span>
        <div :class="['mic-mute-status', isMuted && 'disabled']">
          <Microphone :size="12" :frequency="frequency" color="#fff" />
        </div>
      </div>
      <Transition name="speaking">
        <div v-show="isSpeaking" class="user-item-active" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserSession } from "../../../../../../entity/response";
import Avatar from "../../../../../../components/avatar/index.vue";
import Microphone from "../../../../../../components/microphone/index.vue";
import { userGetFrequency } from "../../../../../../hooks/userGetFrequency";
import { toRefs } from "vue";

interface Props {
  userSession: UserSession;
  soundLevelList: Record<string, number>;
}

const props = defineProps<Props>();

const { userSession, soundLevelList } = toRefs(props);

const { isSpeaking, frequency, isMuted } = userGetFrequency(
  userSession,
  soundLevelList
);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
