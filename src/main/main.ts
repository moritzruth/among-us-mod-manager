import { app, dialog, Menu } from "electron"
import { registerWindowIPC } from "./registerWindowIPC"
import { MANAGER_VERSION } from "./version"
import { initiateManager, isAmongUsInstalled } from "./manager"
import { createWindow, getWindow } from "./window"

if (!app.requestSingleInstanceLock()) app.quit()

app.on("ready", async () => {
  if (!await isAmongUsInstalled()) {
    dialog.showErrorBox(
      "Among Us could not be found",
      "Please make sure Among Us is installed in the default location of Steam Games."
    )

    app.exit(1)
  }

  app.applicationMenu = Menu.buildFromTemplate([
    { label: `Version: ${MANAGER_VERSION}`, enabled: false },
    { type: "separator" },
    { role: "quit" }
  ])

  initiateManager()
  registerWindowIPC()

  await createWindow()
})

app.on("second-instance", () => {
  // Someone tried to run a second instance, we should focus our window.
  const window = getWindow()

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
