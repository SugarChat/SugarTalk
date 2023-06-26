<template>
  <div class="user-item-container">
    <div :class="['user-item-content', isSpeaking && 'active']">
      <Avatar :size="72" :font-size="36" :name="userSession.userName" />
      <div class="user-info">
        <span class="title">{{ userSession.userName }}</span>
        <div :class="['mic-mute-status', userSession.isMuted && 'disabled']">
          <i class="iconfont icon-mic" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { UserSession } from "../../../../../../entity/response";
import Avatar from "../../../../../../components/avatar/index.vue";
import { watchEffect } from "vue";
import { ref } from "vue";

interface Props {
  userSession: UserSession;
  remoteSoundLevelList: Record<string, number>;
}

const props = defineProps<Props>();

const { userSession, remoteSoundLevelList } = toRefs(props);

const isSpeaking = ref(false);

const _timer = ref<NodeJS.Timeout>();

watchEffect(() => {
  const streamId =
    userSession.value.userSessionStreams?.find((stream) => stream?.streamId)
      ?.streamId ?? "";
  if (streamId) {
    const volume = remoteSoundLevelList.value[streamId];
    if (volume > 0.00009) {
      isSpeaking.value = true;
    } else {
      clearTimeout(_timer.value);
      _timer.value = setTimeout(() => {
        isSpeaking.value = false;
        clearTimeout(_timer.value);
      }, 100);
    }
  }
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
