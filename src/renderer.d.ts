import { ScreenSource } from "./entity/types";

export interface CurrentWindow {
  close: () => Promise<void>;
  destroy: () => Promise<void>;
  setFullScreen: (flag: boolean) => Promise<void>;
  setSize: (width: number, height: any, animate?: boolean) => Promise<void>;
}

interface AppInfo {
  name: string;
  version: string;
}

interface BrowserWindowConstructorOptions
  extends Omit<Electron.BrowserWindowConstructorOptions, "parent"> {
  parent?: boolean;
}

interface PingConfig {
  numeric?: boolean;
  timeout?: number;
  deadline?: number;
  min_reply?: number;
  v6?: boolean;
  sourceAddr?: string;
  packetSize?: number;
  extra?: string[];
}

interface PingResponse {
  inputHost: string;
  host: string;
  numeric_host: string;
  alive: boolean;
  output: string;
  time: number;
  times: number[];
  min: string;
  max: string;
  avg: string;
  packetLoss: string;
  stddev: string;
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
  blockClose: (callback: () => void) => void;
  closeToHide: () => void;
  execCommand: (command: string) => Promise<void>;
  ping: (addr: string, config?: PingConfig) => Promise<PingResponse>;
  getLocalAudioArrayBuffer: () => Promise<ArrayBuffer>;
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

export interface IClipboard {
  writeText: (text: string) => Promise<void>;
}

export interface IStore {
  dispatch: (id: string, hash: string) => Promise<void>;
  subscribe: (callback: (id: string, hash: string) => void) => void;
}

interface ILoudness {
  getVolume: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  getMuted: () => Promise<boolean>;
  setMuted: (muted: boolean) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
    desktopCapturer: IDesktopCapturer;
    systemPreferences: ISystemPreferences;
    dialog: IDialog;
    clipboard: IClipboard;
    store: IStore;
    loudness: ILoudness;
  }

  interface AudioContext {
    setSinkId(sinkId: string): Promise<void>;
  }
}
