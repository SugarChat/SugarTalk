import { app, BrowserWindow, shell, ipcMain } from "electron";
import { release } from "node:os";
import { join } from "node:path";
import { getNewWindowPoint } from "./utils";
import "./handle";
import { BrowserWindowConstructorOptions } from "../../src/renderer";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

async function createWindow() {
  if (win === null) {
    win = new BrowserWindow({
      title: "Main window",
      width: 375,
      height: 667,
      useContentSize: true,
      resizable: false,
      maximizable: false,
      show: false,
      titleBarStyle: "hidden",
      trafficLightPosition: {
        x: 12,
        y: 7,
      },
      icon: join(process.env.PUBLIC, "favicon.ico"),
      webPreferences: {
        preload,
        // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
        // Consider using contextBridge.exposeInMainWorld
        // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
        nodeIntegration: true,
        contextIsolation: true,
      },
    });
  }

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  win.on("ready-to-show", () => {
    win.show();
    if (process.env.VITE_DEV_SERVER_URL) {
      win.webContents.openDevTools();
    }
  });

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
  // win.webContents.on('will-navigate', (event, url) => { }) #344

  win.on("closed", () => (win = null));
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  const win = BrowserWindow.getAllWindows()?.[0];
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
    allWindows[0].show();
  } else {
    createWindow();
  }
});

ipcMain.handle("open-main-win", () => {
  createWindow();
});

// New window example arg: new windows url
ipcMain.handle(
  "open-win",
  (_, arg, options: BrowserWindowConstructorOptions) => {
    const parentWin = BrowserWindow.getFocusedWindow();

    const point = getNewWindowPoint(
      options?.width ?? 800,
      options?.height ?? 600
    );

    const childWin = new BrowserWindow({
      icon: join(process.env.PUBLIC, "favicon.ico"),
      webPreferences: {
        preload,
        nodeIntegration: true,
        contextIsolation: true,
        webSecurity: true,
      },
      ...point,
      ...options,
      parent: options?.parent ? parentWin : null,
      show: options?.show ?? false,
    });

    childWin.on("ready-to-show", () => {
      childWin.show();
    });

    childWin.on("enter-full-screen", () => {
      childWin.webContents.send("enter-full-screen");
    });

    childWin.on("leave-full-screen", () => {
      childWin.webContents.send("leave-full-screen");
    });

    if (process.env.VITE_DEV_SERVER_URL) {
      childWin.loadURL(`${url}#${arg}`);
      childWin.webContents.openDevTools();
    } else {
      childWin.loadFile(indexHtml, { hash: arg });
      if (options?.openDevTools) {
        childWin.webContents.openDevTools();
      }
    }
  }
);

ipcMain.handle("getAppInfo", () => ({
  name: app.getName(),
  version: app.getVersion(),
  platform: process.platform,
}));
