import { ipcMain, BrowserWindow } from "electron"

export function registerWindowIPC() {
  ipcMain.on("window:minimize", event => {
    BrowserWindow.fromWebContents(event.sender)?.minimize()
  })
}
