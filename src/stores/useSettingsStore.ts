import { defineStore } from "pinia";
import loudness from "../utils/loudness";

export const useSettingsStore = defineStore("settingsStore", {
  state: () => ({
    // 入会开启摄像头
    enableCamera: false,
    // 入会开启麦克风
    enableMicrophone: false,
    // 显示参会时长
    showMeetingDuration: true,
    // 系统输出音量
    volume: 0,
    // 系统是否静音
    muted: false,
    // 音频输出设备ID
    audioOutputDeviceId: "default",
    // 是否开启 DevTools
    openDevTools: false,
    // 是否开启水印
    enableWatermark: false,
    // 是否开启MCU模式
    enableMCU: false,
  }),
  actions: {
    init() {
      loudness.getStatus().then(([volume, muted]) => {
        this.volume = volume;
        this.muted = muted;
      });
    },
  },
  persist: true,
});
