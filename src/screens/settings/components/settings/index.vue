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

      <el-divider />

      <el-form-item label="SOCKET连接" :required="true">
        <el-select placeholder="SOCKET连接" v-model="websocketURL">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="baseURL" :required="true">
        <el-input v-model="baseURL" placeholder="BASE URL" />
      </el-form-item>
      <el-form-item label="foundationURL" :required="true">
        <el-input v-model="foundationURL" placeholder="FOUNDATION URL" />
      </el-form-item>
    </el-form>
  </Scroll>
</template>

<script setup lang="ts">
import Scroll from "../scroll/index.vue";
import Checkbox from "../check-box/index.vue";
import { useSettingsStore } from "../../../../stores/useSettingsStore";
import { computed } from "vue";

const settingsStore = useSettingsStore();

const options = [
  {
    value: "wss://talk.sjdistributors.com:5443/WebRTCAppEE/websocket",
    label: "WebRTCAppEE",
  },
  {
    value: "wss://talk.sjdistributors.com:5443/LiveApp/websocket",
    label: "LiveApp",
  },
];

const websocketURL = computed({
  get: () => settingsStore.websocketURL,
  set: (val) => (settingsStore.websocketURL = val),
});

const baseURL = computed({
  get: () => settingsStore.baseURL,
  set: (val) => (settingsStore.baseURL = val),
});

const foundationURL = computed({
  get: () => settingsStore.foundationURL,
  set: (val) => (settingsStore.foundationURL = val),
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
