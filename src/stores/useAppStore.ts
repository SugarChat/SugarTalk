import { defineStore } from "pinia";
import { LoginResponse } from "../entity/response";
import { AppInfo } from "../renderer";

export const useAppStore = defineStore("appStore", {
  state: () => ({
    isFullscreen: false,
    userName: "",
    access_token: "",
    expires: "",
    appInfo: {} as AppInfo,
  }),
  actions: {
    async init() {
      this.appInfo = await window.electronAPI.appInfo();
    },
    login(response: LoginResponse) {
      this.userName = response.userName;
      this.access_token = response.access_token;
      this.expires = response[".expires"];
    },
    logout() {
      this.userName = "";
      this.access_token = "";
      this.expires = "";
    },
  },
  persist: true,
});
