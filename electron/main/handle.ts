import { BrowserWindow, ipcMain, desktopCapturer, dialog } from "electron";

ipcMain.handle("close-window", () => BrowserWindow.getFocusedWindow().close());

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
