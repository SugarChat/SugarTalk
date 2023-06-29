<template>
  <div class="speaking">
    <div class="text">正在讲话：</div>
    <div class="text" v-for="(userName, index) in speaking">
      {{ index === 0 ? userName : `; ${userName}` }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { Meeting } from "../../../../entity/response";
import { ref } from "vue";
import { onUnmounted } from "vue";

interface Props {
  soundLevelList: Record<string, number>;
  meetingInfo: Meeting;
}

const { soundLevelList, meetingInfo } = defineProps<Props>();

const speaking = ref<string[]>([]);

const speakingFrame = ref<number>(0);

const getSpeaking = () => {
  const streamIds = Object.keys(soundLevelList)
    .filter((streamId) => soundLevelList[streamId] > 40)
    .sort((a, b) => soundLevelList[b] - soundLevelList[a]);
  speaking.value =
    meetingInfo?.userSessions
      ?.filter((user) =>
        streamIds.includes(
          user?.userSessionStreams?.find((stream) => stream.streamId)
            ?.streamId ?? ""
        )
      )
      ?.map((user) => user.userName) ?? [];
  speakingFrame.value = requestAnimationFrame(getSpeaking);
};

onMounted(() => {
  requestAnimationFrame(getSpeaking);
});

onUnmounted(() => {
  cancelAnimationFrame(speakingFrame.value);
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
