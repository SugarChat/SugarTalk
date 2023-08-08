import {
  BrowserWindow,
  ipcMain,
  desktopCapturer,
  dialog,
  systemPreferences,
  clipboard,
  Menu,
  MenuItem,
  app,
  nativeImage,
} from "electron";
import { exec } from "child_process";
import ping from "ping";
import { PingConfig } from "../../src/renderer";
import loudness from "loudness";
import fs from "node:fs";
import { join } from "node:path";
import { v1 as uuidv1 } from "uuid";
import sharp from "sharp";
import { windowManage } from "./utils";
import { createWindow } from "./index";

ipcMain.handle("getPlatform", () => process.platform);

ipcMain.handle("close-window", () => BrowserWindow.getAllWindows()[0]?.close());

ipcMain.handle("destroy-window", () =>
  BrowserWindow.getFocusedWindow().destroy()
);

ipcMain.handle("minimize-window", () =>
  BrowserWindow.getFocusedWindow().minimize()
);

ipcMain.handle("maximize-window", () =>
  BrowserWindow.getFocusedWindow().maximize()
);

ipcMain.handle("unmaximize-window", () =>
  BrowserWindow.getFocusedWindow().unmaximize()
);

ipcMain.handle("focus-window", (_, path: string) => {
  const winItem = windowManage.get(path);
  if (winItem) {
    BrowserWindow.fromId(winItem.id).focus();
  }
});

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

ipcMain.handle("window-manage", () => windowManage);

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

ipcMain.handle("block-win-close", () => {
  const win = BrowserWindow.getAllWindows()?.[0];
  win.on("close", (event) => {
    event.preventDefault();
    // 关闭窗口
    win.webContents.send("onBlockWindowClose");
  });
});

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

ipcMain.handle("clipboard.readImage", () => {
  const image = clipboard.readImage("clipboard");
  return image.toDataURL();
});

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

ipcMain.handle("get-base64-by-filePath", async (_, filePath: string) => {
  const data = fs.readFileSync(filePath);
  let compressedImageBuffer = await sharp(data).png({ quality: 60 }).toBuffer();
  if (compressedImageBuffer.length > 1024 * 1024 * 3) {
    compressedImageBuffer = await sharp(data).png({ quality: 60 }).toBuffer();
  }
  return compressedImageBuffer.toString("base64");
});

ipcMain.handle("show-context-menu", (_, imageURL: string) => {
  const contextMenu = new Menu();
  contextMenu.append(
    new MenuItem({
      label: "复制",
      click: () => {
        const imageBuffer = Buffer.from(imageURL, "base64");
        const imageNative = nativeImage.createFromBuffer(imageBuffer);
        clipboard.writeImage(imageNative);
      },
    })
  );
  contextMenu.append(
    new MenuItem({
      label: "另存为",
      click: () => {
        const appName = app.getName();
        const foramt = (num: number) => (num > 9 ? `${num}` : `0${num}`);
        const now = new Date();
        const year = now.getFullYear();
        const month = foramt(now.getMonth() + 1);
        const day = foramt(now.getDate());
        dialog
          .showSaveDialog({
            defaultPath: `${appName}_${year}${month}${day}_${uuidv1().substring(
              0,
              8
            )}.png`,
          })
          .then((result) => {
            if (!result.canceled && result.filePath) {
              const savePath = result.filePath;

              const imageBuffer = Buffer.from(imageURL, "base64");

              fs.writeFile(savePath, imageBuffer, "base64", () => {});
            }
          });
      },
    })
  );
  contextMenu.popup({ window: BrowserWindow.getFocusedWindow() });
});

ipcMain.handle("logout", () => {
  let mainWinId: number;
  windowManage.forEach((item, key) => {
    if (key === "/") {
      mainWinId = item.id;
    } else {
      if (key.includes("/meeting")) {
        BrowserWindow.fromId(item.id).destroy();
      } else {
        BrowserWindow.fromId(item.id).close();
      }
    }
  });
  if (mainWinId) {
    BrowserWindow.fromId(mainWinId).focus();
  } else {
    createWindow();
  }
});
