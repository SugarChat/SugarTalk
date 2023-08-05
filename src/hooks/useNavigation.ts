import { RoutePath } from "../entity/types";
import { BrowserWindowConstructorOptions } from "../renderer";
import { useSettingsStore } from "../stores/useSettingsStore";
import { handlerPathParams } from "../utils/utils";

class Navigation {
  navigate(
    name: RoutePath,
    params?: Record<string, any>,
    options?: BrowserWindowConstructorOptions
  ) {
    const { createWindow } = window.electronAPI;

    const path = params ? `${name}?${handlerPathParams(params)}` : name;

    switch (name) {
      case "/home":
        createWindow(path, {
          width: 375,
          height: 667,
          frame: false,
          useContentSize: true,
          resizable: false,
          maximizable: false,
          titleBarStyle: "hidden",
          trafficLightPosition: {
            x: 12,
            y: 16,
          },
          openDevTools: useSettingsStore().openDevTools,
          ...options,
        });
        break;
      case "/settings":
        createWindow(path, {
          width: 720,
          height: 640,
          frame: false,
          useContentSize: true,
          resizable: false,
          maximizable: false,
          minimizable: false,
          titleBarStyle: "hidden",
          trafficLightPosition: {
            x: 12,
            y: 16,
          },
          openDevTools: useSettingsStore().openDevTools,
          ...options,
        });
        break;
      case "/join-meeting":
        window.electronAPI.createWindow(path, {
          width: 375,
          height: 667,
          titleBarStyle: "hidden",
          resizable: false,
          maximizable: false,
          frame: false,
          useContentSize: true,
          openDevTools: useSettingsStore().openDevTools,
          ...options,
        });
        break;
      case "/meeting":
        window.electronAPI.createWindow(path, {
          width: 960,
          height: 640,
          minWidth: 960,
          minHeight: 640,
          frame: false,
          useContentSize: true,
          titleBarStyle: "hidden",
          openDevTools: useSettingsStore().openDevTools,
          ...options,
        });
        break;
    }
    return this;
  }

  destroy() {
    window.electronAPI.getCurrentWindow().destroy();
    return this;
  }

  openMainWindow() {
    window.electronAPI.openMainWindow();
    return this;
  }

  close() {
    window.electronAPI.getCurrentWindow().close();
    return this;
  }

  closeToHide() {
    window.electronAPI.closeToHide();
    return this;
  }

  blockClose(callback: () => void) {
    window.electronAPI.blockClose(callback);
    return this;
  }
}

const navigation = new Navigation();

export const useNavigation = () => {
  return navigation;
};
