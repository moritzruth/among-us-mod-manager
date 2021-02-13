import { ipcMain, BrowserWindow, app, shell } from "electron"

export function registerWindowIPC() {
  ipcMain.on("window:minimize", event => {
    BrowserWindow.fromWebContents(event.sender)?.minimize()
  })

  ipcMain.on("window:menu", event => {
    app.applicationMenu?.popup({ window: BrowserWindow.fromWebContents(event.sender)! })
  })

  ipcMain.on("window:show-releases", async () => {
    await shell.openExternal("https://github.com/moritzruth/among-us-mod-manager/releases")
  })
}
