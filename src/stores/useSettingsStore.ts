import { defineStore } from "pinia";
import loudness from "../utils/loudness";
import config from "../config";

export const useSettingsStore = defineStore("settingsStore", {
  state: () => ({
    websocketURL: "wss://talk.sjdistributors.com:5443/LiveApp/websocket",
    baseURL: config.baseURL,
    foundationURL: config.foundationURL,
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
  }),
  actions: {
    init() {
      loudness.getStatus().then(([volume, muted]) => {
        this.volume = volume;
        this.muted = muted;
        this.baseURL = this.baseURL || config.baseURL;
        this.foundationURL = this.foundationURL || config.foundationURL;
      });
    },
  },
  persist: true,
});
