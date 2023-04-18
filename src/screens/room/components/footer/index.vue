<template>
  <div class="footer">
    <div class="footer-left">
      <AudioManage />
      <VideoManage />
    </div>

    <div class="footer-content">
      <ScreenShare :start-share="startShare" :stop-share="stopShare" />
    </div>

    <div class="footer-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { ScreenSource } from "../../../../entity/types";
import ActionBtn from "../action-btn/index.vue";
import ScreenShare from "../screen-share/index.vue";
import VideoManage from "../video-manage/index.vue";
import AudioManage from "../audio-manage/index.vue";

interface Props {
  startShare?: (source: ScreenSource) => void;
  stopShare?: () => void;
}

const props = defineProps<Props>();

const { startShare, stopShare } = toRefs(props);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
