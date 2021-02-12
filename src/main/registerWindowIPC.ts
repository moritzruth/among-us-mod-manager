import { ipcMain, BrowserWindow, app } from "electron"

export function registerWindowIPC() {
  ipcMain.on("window:minimize", event => {
    BrowserWindow.fromWebContents(event.sender)?.minimize()
  })

  ipcMain.on("window:menu", event => {
    app.applicationMenu?.popup({ window: BrowserWindow.fromWebContents(event.sender)! })
  })
}
