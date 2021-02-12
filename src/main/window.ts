import pathLib from "path"
import { BrowserWindow, nativeImage as NativeImage, shell } from "electron"
import windowStateKeeper from "electron-window-state"
import { isDevelopment } from "./isDevelopment"

let window: BrowserWindow | null = null

export function getWindow() {
  return window
}

export async function createWindow() {
  if (window !== null) throw new Error("Window already exists")

  const state = windowStateKeeper({
    maximize: false,
    fullScreen: false
  })

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
    icon: NativeImage.createFromPath(pathLib.resolve(__dirname, isDevelopment
      ? "../src/static"
      : "./renderer", "icon.png"))
  })

  state.manage(window)

  window.webContents.on("will-navigate", (event, rawUrl) => {
    console.log(rawUrl)
    event.preventDefault()
    shell.openExternal(rawUrl)
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
