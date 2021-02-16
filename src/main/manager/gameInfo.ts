/* eslint-disable no-await-in-loop */
import pathLib from "path"
import fs from "fs-extra"
import Store from "electron-store"
import { app, dialog, MessageBoxOptions } from "electron"
import { detectGameVersion } from "./detectGameVersion"

const store = new Store<{
  originalGameDirectory: string
}>()

export const getOriginalGameDirectory = () => store.get("originalGameDirectory")
const setOriginalGameDirectory = (path: string) => store.set("originalGameDirectory", path)

export const getDirectoryForInstallations = () => pathLib.resolve(store.get("originalGameDirectory"), "..")

let originalGameVersion: string
export const getOriginalGameVersion = () => originalGameVersion

export const isValidGameDirectory = async (path: string) => fs.pathExists(pathLib.resolve(path, "Among Us.exe"))

export async function detectOriginalGameVersion(): Promise<boolean> {
  if (!await fs.pathExists(getOriginalGameDirectory())) return false
  originalGameVersion = await detectGameVersion(getOriginalGameDirectory())
  return true
}

export async function showOriginalGameDirectorySelectDialog(reason: "user" | "not-automatically" | "invalid") {
  if (reason !== "user") {
    const options: MessageBoxOptions = {
      title: reason === "not-automatically"
        ? "Among Us could not be automatically detected."
        : "Among Us could not be found.",
      message: (reason === "not-automatically" ? "Among Us could not be automatically detected. " : "") +
        "Please select the directory which contains the game (Among Us.exe).\n\n",
      buttons: ["Cancel", "Select"],
      type: "error"
    }

    const { response } = await dialog.showMessageBox(options)
    if (response === 0) app.exit(0)
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition,no-constant-condition
  while (true) {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ["openDirectory", "dontAddToRecent"],
      buttonLabel: "Select",
      title: "Game directory selection"
    })

    if (filePaths.length === 0) {
      if (reason === "user") return
      app.exit(0)
    } else {
      const [path] = filePaths

      if (await isValidGameDirectory(path)) {
        store.set("originalGameDirectory", path)
        app.relaunch()
        app.exit()
        return
      }

      const options: MessageBoxOptions = {
        type: "error",
        title: "Among Us could not be found.",
        message: "Please try again.",
        buttons: ["Cancel", "Retry"]
      }

      const { response } = await dialog.showMessageBox(options)
      if (response === 0) {
        if (reason === "user") return
        app.exit()
      }
    }
  }
}

export async function doStartupCheck() {
  if (store.has("originalGameDirectory")) {
    if (!await isValidGameDirectory(getOriginalGameDirectory())) await showOriginalGameDirectorySelectDialog("invalid")
  } else {
    const defaultPath = pathLib.resolve("C:\\Program Files (x86)\\Steam\\steamapps\\common", "./Among Us")
    if (await isValidGameDirectory(defaultPath)) setOriginalGameDirectory(defaultPath)
    else await showOriginalGameDirectorySelectDialog("not-automatically")
  }
}
