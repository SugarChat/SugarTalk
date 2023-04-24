<template>
  <div class="footer">
    <div class="footer-left">
      <AudioManage />
      <VideoManage />
    </div>

    <div class="footer-content">
      <ScreenShare :start-share="startShare" :stop-share="stopShare" />
      <Invite />
      <ActionBtn title="设置" icon="icon-setting" @click="onSettings" />
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
import Invite from "./components/invite/index.vue";

interface Props {
  startShare?: (source: ScreenSource) => void;
  stopShare?: () => void;
}

const props = defineProps<Props>();

const { startShare, stopShare } = toRefs(props);

const onSettings = () => {
  window.electronAPI.createWindow(`/settings`, {
    width: 720,
    height: 640,
    useContentSize: true,
    resizable: false,
    maximizable: false,
    minimizable: false,
    titleBarStyle: "hidden",
    alwaysOnTop: true,
    trafficLightPosition: {
      x: 12,
      y: 16,
    },
  });
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
