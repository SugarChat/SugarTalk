import { ScreenSource } from "./entity/types";

export interface CurrentWindow {
  close: () => Promise<void>;
  destroy: () => Promise<void>;
  setFullScreen: (flag: boolean) => Promise<void>;
  setSize: (width: number, height: any, animate?: boolean) => Promise<void>;
}

interface BrowserWindowConstructorOptions
  extends Omit<Electron.BrowserWindowConstructorOptions, "parent"> {
  parent?: boolean;
}

export interface IElectronAPI {
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
}

export interface IDesktopCapturer {
  getSources: (options: Electron.SourcesOptions) => Promise<ScreenSource[]>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
    desktopCapturer: IDesktopCapturer;
  }
}
