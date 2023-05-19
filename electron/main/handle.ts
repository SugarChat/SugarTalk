import {
  BrowserWindow,
  ipcMain,
  desktopCapturer,
  dialog,
  systemPreferences,
  clipboard,
} from "electron";
import { exec } from "child_process";
import ping from "ping";
import { PingConfig } from "../../src/renderer";
import loudness from "loudness";
import fs from "node:fs";
import { join } from "node:path";

ipcMain.handle("getPlatform", () => process.platform);

ipcMain.handle("close-window", () => BrowserWindow.getAllWindows()[0]?.close());

ipcMain.handle("destroy-window", () =>
  BrowserWindow.getFocusedWindow().destroy()
);

ipcMain.handle(
  "getSources",
  (
    _,
    options: Electron.SourcesOptions
  ): Promise<Electron.DesktopCapturerSource[]> =>
    desktopCapturer.getSources(options)
);

ipcMain.handle("setFullScreen", (_, flag: boolean) =>
  BrowserWindow.getFocusedWindow().setFullScreen(flag)
);

ipcMain.handle("setSize", (_, width: number, height, animate?: boolean) =>
  BrowserWindow.getFocusedWindow().setSize(width, height, animate)
);

ipcMain.handle(
  "close-win-with-dialog",
  (_, options: Electron.MessageBoxSyncOptions) => {
    const win = BrowserWindow.getAllWindows()?.[0];
    win.on("close", (event) => {
      const index = dialog.showMessageBoxSync(win, options);
      if (index === options?.cancelId ?? 1) {
        event.preventDefault();
      } else {
        // 关闭窗口
        win.webContents.send("onCloseWindow");
      }
    });
  }
);

ipcMain.handle("close-win-with-hide", () => {
  const win = BrowserWindow.getAllWindows()?.[0];
  win.on("close", (event) => {
    if (win.isFocused()) {
      win.hide();
      event.preventDefault();
    }
  });
});

ipcMain.handle("askForMediaAccess", (_, mediaType: "microphone" | "camera") =>
  systemPreferences.askForMediaAccess(mediaType)
);

ipcMain.handle(
  "getMediaAccessStatus",
  (_, mediaType: "microphone" | "camera" | "screen") =>
    systemPreferences.getMediaAccessStatus(mediaType)
);

ipcMain.handle(
  "showOpenDialogSync",
  (_, options: Electron.MessageBoxSyncOptions) =>
    dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(), options)
);

//www.mbsplugins.de/archive/2020-04-05/MacOS_System_Preference_Links/monkeybreadsoftware_blog_archive
ipcMain.handle("execCommand", (_, command: string) => {
  exec(command);
});

ipcMain.handle(
  "ping",
  (
    _,
    addr: string = "https://talk.sjdistributors.com:5443/",
    config?: PingConfig
  ) => ping.promise.probe(addr, { timeout: 10, extra: ["-i", "2"], ...config })
);

ipcMain.handle("clipboard.writeText", (_, text: string) =>
  clipboard.writeText(text)
);

ipcMain.handle("store-dispatch", (_, id: string, hash: string) => {
  const wins = BrowserWindow.getAllWindows();
  wins.forEach((win) => {
    win.webContents.send("store-dispatch", id, hash);
  });
});

ipcMain.handle("loudness.getVolume", () => loudness.getVolume());

ipcMain.handle("loudness.setVolume", (_, volume: number) =>
  loudness.setVolume(volume)
);

ipcMain.handle("loudness.getMuted", () => loudness.getMuted());

ipcMain.handle("loudness.setMuted", (_, muted: boolean) =>
  loudness.setMuted(muted)
);

ipcMain.handle("get-local-audio-arraybuffer", () => {
  const path = join(process.env.PUBLIC, "horse.mp3");
  const buffer = fs.readFileSync(path);
  const arraybuffer = new Uint8Array(buffer);
  return arraybuffer.buffer;
});
