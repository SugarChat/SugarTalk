import { ScreenSource } from "./entity/types";

export interface CurrentWindow {
  close: () => Promise<void>;
  destroy: () => Promise<void>;
  setFullScreen: (flag: boolean) => Promise<void>;
  setSize: (width: number, height: any, animate?: boolean) => Promise<void>;
}

interface AppInfo {
  name: string;
}

interface BrowserWindowConstructorOptions
  extends Omit<Electron.BrowserWindowConstructorOptions, "parent"> {
  parent?: boolean;
}

export interface IElectronAPI {
  platform: () => Promise<NodeJS.Platform>;
  appInfo: () => Promise<AppInfo>;
  openMainWindow: () => Promise<void>;
  createWindow: (
    path: string,
    options?: BrowserWindowConstructorOptions
  ) => Promise<void>;
  getCurrentWindow: () => CurrentWindow;
  enterFullscreen: (callback: () => void) => void;
  leaveFullscreen: (callback: () => void) => void;
  onClose: (
    options: Electron.MessageBoxSyncOptions,
    callback: () => void
  ) => Promise<void>;
  closeToHide: () => void;
  execCommand: (command: string) => Promise<void>;
}

export interface IDesktopCapturer {
  getSources: (options: Electron.SourcesOptions) => Promise<ScreenSource[]>;
}

export interface ISystemPreferences {
  askForMediaAccess: (mediaType: "microphone" | "camera") => Promise<boolean>;
  getMediaAccessStatus: (
    mediaType: "microphone" | "camera" | "screen"
  ) => Promise<
    "not-determined" | "granted" | "denied" | "restricted" | "unknown"
  >;
}

export interface IDialog {
  showOpenDialogSync: (
    options: Electron.MessageBoxSyncOptions
  ) => Promise<number>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
    desktopCapturer: IDesktopCapturer;
    systemPreferences: ISystemPreferences;
    dialog: IDialog;
  }
}
