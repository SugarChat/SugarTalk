import { defineStore } from "pinia";

export const useAppStore = defineStore("appStore", {
  state: () => ({
    isFullscreen: false,
    userName: "",
    access_token: "",
    expires: "",
  }),
  actions: {
    logout() {
      this.userName = "";
      this.access_token = "";
      this.expires = "";
    },
  },
  persist: true,
});
