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
          <Microphone :size="12" :frequency="frequency" color="#fff" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, toRefs } from "vue";
import { UserSession } from "../../../../../../entity/response";
import Avatar from "../../../../../../components/avatar/index.vue";
import Microphone from "../../../../../../components/microphone/index.vue";
import { ref } from "vue";

interface Props {
  userSession: UserSession;
  soundLevelList: Record<string, number>;
}

const props = defineProps<Props>();

const { userSession } = toRefs(props);

const isSpeaking = ref(false);

const frequency = ref(0);

const _timer = ref<NodeJS.Timeout>();

const frame = ref<number>(0);

const getByteFrequencyData = () => {
  frequency.value = props.soundLevelList?.[userSession.value?.streamId] ?? 0;

  if (frequency.value > 40) {
    isSpeaking.value = true;
    clearTimeout(_timer.value);
    _timer.value = undefined;
  } else {
    if (isSpeaking.value && !_timer.value) {
      _timer.value = setTimeout(() => {
        isSpeaking.value = false;
        clearTimeout(_timer.value);
        _timer.value = undefined;
      }, 300);
    }
  }

  frame.value = requestAnimationFrame(getByteFrequencyData);
};

onMounted(getByteFrequencyData);

onUnmounted(() => cancelAnimationFrame(frame.value));
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
