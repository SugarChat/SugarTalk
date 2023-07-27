import { defineStore } from "pinia";
import { LoginResponse, UserInfo } from "../entity/response";
import { AppInfo } from "../entity/types";

export const useAppStore = defineStore("appStore", {
  state: () => ({
    isFullscreen: false,
    userName: "",
    access_token: "",
    expires: "",
    appInfo: {} as AppInfo,
    userInfo: {} as UserInfo,
  }),
  actions: {
    async init() {
      this.isFullscreen = false;
      const appInfo = await window.electronAPI.appInfo();
      const platform =
        appInfo.platform === "darwin"
          ? "mac"
          : appInfo.platform.startsWith("win")
          ? "win"
          : "other";
      this.appInfo = { name: appInfo.name, version: appInfo.version, platform };
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
    updateUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
    },
  },
  persist: true,
});
