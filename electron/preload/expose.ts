import {
  DesktopCapturerSource,
  SourcesOptions,
  contextBridge,
  ipcRenderer,
} from "electron";
import { CurrentWindow } from "../../src/renderer";
import { ScreenSource } from "../../src/entity/types";

contextBridge.exposeInMainWorld("electronAPI", {
  openMainWindow: () => ipcRenderer.invoke("open-main-win"),
  createWindow: (
    path: string,
    options: Electron.BrowserWindowConstructorOptions = {}
  ) => ipcRenderer.invoke("open-win", path, options),
  getCurrentWindow: (): CurrentWindow => ({
    close: () => ipcRenderer.invoke("close-window"),
    destroy: () => ipcRenderer.invoke("destroy-window"),
    setFullScreen: (flag: boolean) => ipcRenderer.invoke("setFullScreen", flag),
    setSize: (width: number, height, animate?: boolean) =>
      ipcRenderer.invoke("setSize", width, height, animate),
  }),
  enterFullscreen: (callback: () => void) =>
    ipcRenderer.on("enter-full-screen", callback),
  leaveFullscreen: (callback: () => void) =>
    ipcRenderer.on("leave-full-screen", callback),
  onClose: (options: Electron.MessageBoxSyncOptions, callback: () => void) => {
    ipcRenderer.invoke("close-win-with-dialog", options);
    ipcRenderer.on("onCloseWindow", callback);
  },
  closeToHide: () => {
    ipcRenderer.invoke("close-win-with-hide");
  },
});

contextBridge.exposeInMainWorld("desktopCapturer", {
  getSources: async (options: SourcesOptions): Promise<ScreenSource[]> => {
    const sources: DesktopCapturerSource[] = await ipcRenderer.invoke(
      "getSources",
      options
    );
    return sources.map((source) => ({
      appIcon: source.appIcon?.toDataURL() ?? "",
      display_id: source.display_id,
      id: source.id,
      name: source.name,
      thumbnail: source.thumbnail.toDataURL(),
    })) as ScreenSource[];
  },
});
