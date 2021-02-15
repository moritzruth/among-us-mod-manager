import pathLib from "path"
import { app, BrowserWindow, nativeImage as NativeImage, shell } from "electron"
import windowStateKeeper from "electron-window-state"
import { createTray, destroyTray } from "./tray"
import { isGameRunning } from "./manager"
import { isDevelopment } from "./constants"

let window: BrowserWindow

export function getWindow() {
  return window
}

export async function createWindow() {
  const state = windowStateKeeper({
    maximize: false,
    fullScreen: false
  })

  const icon = NativeImage.createFromPath(pathLib.resolve(__dirname, isDevelopment
    ? "../src/static"
    : "./renderer", "icon.png"))

  window = new BrowserWindow({
    x: state.x,
    y: state.y,
    show: false,
    frame: false,
    backgroundColor: "#171717",
    height: 700,
    width: 450,
    resizable: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    },
    icon
  })

  state.manage(window)

  window.webContents.on("will-navigate", (event, rawUrl) => {
    event.preventDefault()
    shell.openExternal(rawUrl)
  })

  window.on("hide", () => createTray(icon))
  window.on("show", () => destroyTray())

  window.on("close", event => {
    if (isGameRunning()) {
      event.preventDefault()
      window.hide()
    } else app.exit()
  })

  if (isDevelopment) {
    await window.loadURL("http://localhost:3000")
    window.setSize(1000, 700)
    window.webContents.openDevTools({ mode: "right" })
  } else {
    await window.loadFile(pathLib.resolve(__dirname, "./renderer/index.html"))
  }

  window.show()
}
