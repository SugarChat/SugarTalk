<template>
  <div class="user-list-item">
    <Avatar :size="40" :name="userSession.userName" />
    <div class="user-box-footer">
      <div class="user-info">
        <div :class="['mic-mute-status', isMuted && 'disabled']">
          <Microphone :size="12" :frequency="frequency" color="#fff" />
        </div>
        <p class="nickname">{{ userSession.userName }}</p>
      </div>
    </div>
    <Transition name="speaking">
      <div v-show="isSpeaking" class="user-item-active" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import Avatar from "../../../../../../components/avatar/index.vue";
import Microphone from "../../../../../../components/microphone/index.vue";
import { UserSession } from "../../../../../../entity/response";
import { userGetFrequency } from "../../../../../../hooks/userGetFrequency";

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
