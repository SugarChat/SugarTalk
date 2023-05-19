<template>
  <Scroll>
    <div class="audio-manage-container">
      <p class="title">扬声器</p>
      <div class="device-item">
        <el-select v-model="settingsStore.audioOutputDeviceId" placeholder=" ">
          <el-option
            v-for="item in audioOutputDevices"
            :key="item.deviceId"
            :label="item.label"
            :value="item.deviceId"
          />
        </el-select>
        <el-button @click="onPlay">检测扬声器</el-button>
      </div>

      <!-- <div>
        <p>输出等级</p>
      </div> -->
      <div class="volume-manage">
        <p>输出音量</p>
        <div class="volume-muted" @click="setMuted">
          <i
            :class="[
              'iconfont',
              settingsStore.muted ? 'icon-audio-off' : 'icon-audio-on',
            ]"
          />
        </div>
        <div class="volume-manage-content">
          <el-slider
            v-model="settingsStore.volume"
            style="
              --el-slider-button-size: 12px;
              --el-slider-button-wrapper-size: 24px;
              --el-slider-button-wrapper-offset: -9px;
            "
            @change="setVolume"
          />
        </div>
      </div>
    </div>
  </Scroll>
</template>

<script setup lang="ts">
import Scroll from "../scroll/index.vue";
import { ref } from "vue";
import { useAction } from "./hooks";

const { settingsStore, audioOutputDevices, setVolume, setMuted, onPlay } =
  useAction();

const value = ref("");

const options = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
  {
    value: "Option3",
    label: "Option3",
  },
  {
    value: "Option4",
    label: "Option4",
  },
  {
    value: "Option5",
    label: "Option5",
  },
];
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
