import { app, Menu, shell } from "electron"
import { registerWindowIPC } from "./registerWindowIPC"
import { createWindow, getWindow } from "./window"
import { handleSquirrelEvents } from "./handleSquirrelEvents"
import {
  doStartupCheck,
  getOriginalGameVersion,
  initiateManager,
  getDirectoryForInstallations,
  showOriginalGameDirectorySelectDialog,
  detectOriginalGameVersion
} from "./manager"
import { MANAGER_VERSION } from "./constants"

if (!handleSquirrelEvents()) {
  if (!app.requestSingleInstanceLock()) {
    console.log("Another instance is already running. Quitting...")
    app.quit()
  }

  app.on("ready", async () => {
    await doStartupCheck()
    await detectOriginalGameVersion()

    app.applicationMenu = Menu.buildFromTemplate([
      { label: `Manager: ${MANAGER_VERSION}`, enabled: false },
      { label: `Among Us: ${getOriginalGameVersion()}`, enabled: false },
      { type: "separator" },
      {
        label: "Select the game directory",
        click() {
          showOriginalGameDirectorySelectDialog("user")
        }
      },
      {
        label: "Open the installations directory",
        click() {
          shell.openPath(getDirectoryForInstallations())
        }
      },
      {
        label: "Show devtools",
        click() {
          getWindow().webContents.openDevTools({ mode: "detach" })
        },
        accelerator: "Ctrl+Shift+I"
      }
    ])

    initiateManager()
    registerWindowIPC()

    await createWindow()
  })

  app.on("second-instance", () => {
    const window = getWindow()

    window.show()
    if (window.isMinimized()) window.restore()
    window.focus()
  })
}
