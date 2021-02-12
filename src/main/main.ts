import pathLib from "path"
import { app, BrowserWindow, shell } from "electron"
import { registerWindowIPC } from "./registerWindowIPC"

const isDevelopment = process.env.IS_DEV!
if (!app.requestSingleInstanceLock()) app.quit()

let window: BrowserWindow | null = null

app.on("ready", async () => {
  window = new BrowserWindow({
    show: false,
    frame: false,
    backgroundColor: "#171717",
    height: 700,
    width: 450,
    resizable: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  })

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

  registerWindowIPC()

  window.show()
})

app.on("second-instance", () => {
  // Someone tried to run a second instance, we should focus our window.
  if (window !== null) {
    if (window.isMinimized()) window.restore()
    window.focus()
  }
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
