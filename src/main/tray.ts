import { Tray, NativeImage } from "electron"
import { getWindow } from "./window"

let tray: Tray | null = null

export function createTray(icon: NativeImage) {
  if (tray !== null) return
  tray = new Tray(icon)

  tray.setToolTip("Among Us Mod Manager is running in the background.\n" +
    "It is automatically closed when the game exits.")

  tray.on("click", () => {
    const window = getWindow()

    window.show()
    if (window.isMinimized()) window.restore()
    window.focus()
  })
}

export function destroyTray() {
  tray?.destroy()
  tray = null
}
