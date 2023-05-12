import { BrowserWindowConstructorOptions } from "../renderer";
import { handlerPathParams } from "../utils/utils";

type RoutePath = "/home" | "/settings" | "/join-room" | "/room";

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
          width: 960,
          height: 640,
          useContentSize: true,
          resizable: false,
          maximizable: false,
          titleBarStyle: "hidden",
          trafficLightPosition: {
            x: 12,
            y: 16,
          },
          ...options,
        });
        break;
      case "/settings":
        createWindow(path, {
          width: 720,
          height: 640,
          useContentSize: true,
          resizable: false,
          maximizable: false,
          minimizable: false,
          titleBarStyle: "hidden",
          alwaysOnTop: true,
          trafficLightPosition: {
            x: 12,
            y: 16,
          },
          ...options,
        });
        break;
      case "/join-room":
        window.electronAPI.createWindow(path, {
          width: 375,
          height: 667,
          titleBarStyle: "hidden",
          resizable: false,
          maximizable: false,
          useContentSize: true,
          ...options,
        });
        break;
      case "/room":
        window.electronAPI.createWindow(path, {
          width: 960,
          height: 640,
          minWidth: 960,
          minHeight: 640,
          useContentSize: true,
          titleBarStyle: "hidden",
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
}

const navigation = new Navigation();

export const useNavigation = () => {
  return navigation;
};
