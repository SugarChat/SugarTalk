<template>
  <Scroll>
    <el-form label-position="top">
      <!-- <Checkbox
        :checked="settingsStore.enableCamera"
        @change="(checked) => (settingsStore.enableCamera = checked)"
        >入会开启摄像头</Checkbox
      > -->
      <Checkbox
        :checked="settingsStore.enableMicrophone"
        @change="(checked) => (settingsStore.enableMicrophone = checked)"
        >入会开启麦克风</Checkbox
      >
      <Checkbox
        :checked="settingsStore.showMeetingDuration"
        @change="(checked) => (settingsStore.showMeetingDuration = checked)"
        >显示参会时长</Checkbox
      >

      <Checkbox
        :checked="settingsStore.openDevTools"
        @change="(checked) => (settingsStore.openDevTools = checked)"
        >开启 DevTools</Checkbox
      >

      <Checkbox
        :checked="settingsStore.enableWatermark"
        @change="(checked) => (settingsStore.enableWatermark = checked)"
        >开启水印</Checkbox
      >

      <Checkbox
        :checked="settingsStore.enableMCU"
        @change="(checked) => (settingsStore.enableMCU = checked)"
        >开启MCU</Checkbox
      >
    </el-form>
  </Scroll>
</template>

<script setup lang="ts">
import Scroll from "../scroll/index.vue";
import Checkbox from "../check-box/index.vue";
import { useSettingsStore } from "../../../../stores/useSettingsStore";

const settingsStore = useSettingsStore();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
