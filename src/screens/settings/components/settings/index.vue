<template>
  <Scroll>
    <el-form label-position="top">
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

      <el-divider />

      <el-form-item label="SOCKET连接" :required="true">
        <el-select
          placeholder="SOCKET连接"
          :model-value="settingsStore.websocketURL"
          @change="onChangeWebSocketURL"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </Scroll>
</template>

<script setup lang="ts">
import Scroll from "../scroll/index.vue";
import Checkbox from "../check-box/index.vue";
import { useSettingsStore } from "../../../../stores/useSettingsStore";

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

const onChangeWebSocketURL = (url: string) => {
  settingsStore.websocketURL = url;
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
