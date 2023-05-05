<template>
  <div class="footer">
    <div class="footer-left">
      <slot name="left"></slot>
    </div>

    <div class="footer-content">
      <slot name="content"></slot>
      <Invite />
      <ActionBtn title="设置" icon="icon-setting" @click="onSettings" />
    </div>

    <div class="footer-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import ActionBtn from "../action-btn/index.vue";
import Invite from "./components/invite/index.vue";

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
