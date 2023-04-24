<template>
  <Scroll>
    <Checkbox
      :checked="settingsStore.enableCamera"
      @change="(checked) => (settingsStore.enableCamera = checked)"
      >入会开启摄像头</Checkbox
    >
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
  </Scroll>
</template>

<script setup lang="ts">
import Scroll from "../scroll/index.vue";
import Checkbox from "../check-box/index.vue";
import { useSettingsStore } from "../../../../stores/useSettingsStore";

const settingsStore = useSettingsStore();
</script>
