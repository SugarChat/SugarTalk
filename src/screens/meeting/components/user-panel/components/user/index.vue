<template>
  <div class="user-item-container">
    <div :class="['user-item-content', isSpeaking && 'active']">
      <Avatar :size="72" :font-size="36" :name="userSession.userName" />
      <div class="user-info">
        <span class="title">{{ userSession.userName }}</span>
        <div
          :class="[
            'mic-mute-status',
            userSession.isMuted && frequency <= 20 && 'disabled',
          ]"
        >
          <i class="iconfont icon-mic" />
          <div class="mic-bgc" :style="`height: ${barHeight}px;`">
            <div class="mic-box">
              <i class="iconfont icon-mic" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, toRefs } from "vue";
import { UserSession } from "../../../../../../entity/response";
import Avatar from "../../../../../../components/avatar/index.vue";
import { ref } from "vue";
import { computed } from "vue";

interface Props {
  userSession: UserSession;
  soundLevelList: Record<string, Uint8Array>;
}

const props = defineProps<Props>();

const { userSession } = toRefs(props);

const isSpeaking = ref(false);

const frequency = ref(0);

const barHeight = ref(0);

const _timer = ref<NodeJS.Timeout>();

const streamId = computed(
  () =>
    userSession.value.userSessionStreams?.find((stream) => stream?.streamId)
      ?.streamId ?? ""
);

const getByteFrequencyData = () => {
  const dataArray =
    props.soundLevelList[streamId.value]?.filter((item) => item > 0) ?? [];

  if (dataArray.length > 0) {
    let h = 0;
    for (let i = 0; i < dataArray.length; i++) {
      h += dataArray[i];
    }
    h /= dataArray.length;
    frequency.value = h;
    barHeight.value = (12 / 256) * h + 1;
  } else {
    frequency.value = 0;
    barHeight.value = 0;
  }

  if (frequency.value > 30) {
    isSpeaking.value = true;
    clearTimeout(_timer.value);
    _timer.value = undefined;
  } else {
    if (isSpeaking.value && !_timer.value) {
      _timer.value = setTimeout(() => {
        isSpeaking.value = false;
        clearTimeout(_timer.value);
        _timer.value = undefined;
      }, 100);
    }
  }

  requestAnimationFrame(getByteFrequencyData);
};

onMounted(() => {
  requestAnimationFrame(getByteFrequencyData);
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
