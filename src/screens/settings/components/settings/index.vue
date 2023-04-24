<template>
  <Scroll>
    <Checkbox
      :checked="state.enableCamera"
      @change="(checked) => (state.enableCamera = checked)"
      >入会开启摄像头</Checkbox
    >
    <Checkbox
      :checked="state.enableMicrophone"
      @change="(checked) => (state.enableCamera = checked)"
      >入会开启麦克风</Checkbox
    >
    <Checkbox
      :checked="state.showMeetingDuration"
      @change="(checked) => (state.showMeetingDuration = checked)"
      >显示参会时长</Checkbox
    >
  </Scroll>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import Scroll from "../scroll/index.vue";
import Checkbox from "../check-box/index.vue";

const state = reactive({
  enableCamera: false,
  enableMicrophone: false,
  showMeetingDuration: false,
});
</script>
