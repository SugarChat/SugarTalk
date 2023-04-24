import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settingsStore", {
  state: () => ({
    enableCamera: false,
    enableMicrophone: false,
    showMeetingDuration: false,
  }),
  persist: true,
});
