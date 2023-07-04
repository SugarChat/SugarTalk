<template>
  <div class="member-user-item">
    <Avatar :size="36" :name="userSession.userName" />
    <div class="user-info">
      <p>{{ userSession?.userName }}</p>
    </div>
    <div :class="['mic-mute-status', isMuted && 'disabled']">
      <Microphone :size="16" :frequency="frequency" />
    </div>
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

const { frequency, isMuted } = userGetFrequency(userSession, soundLevelList);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
