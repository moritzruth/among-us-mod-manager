import childProcess from "child_process"
import pathLib from "path"
import { app, dialog } from "electron"
import { isDevelopment } from "./isDevelopment"

const spawn = (command: string, arguments_: string[]) => {
  let spawnedProcess

  try {
    spawnedProcess = childProcess.spawn(command, arguments_, { detached: true })
  } catch {
    // ignored
  }

  return spawnedProcess
}

export function handleSquirrelEvents(): boolean {
  if (isDevelopment || process.argv.length === 1) return false

  const appFolder = pathLib.resolve(process.execPath, "..")
  const rootAtomFolder = pathLib.resolve(appFolder, "..")
  const updateDotExe = pathLib.resolve(pathLib.join(rootAtomFolder, "Update.exe"))
  const exeName = pathLib.basename(process.execPath)

  const spawnUpdate = (...arguments_: string[]) => spawn(updateDotExe, arguments_)

  const [,squirrelEvent] = process.argv

  switch (squirrelEvent) {
    case "--squirrel-install":
    case "--squirrel-updated":
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate("--createShortcut", exeName)

      setTimeout(() => app.quit(), 1000)
      return true

    case "--squirrel-uninstall":
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate("--removeShortcut", exeName)

      setTimeout(() => app.quit(), 1000)
      return true

    case "--squirrel-obsolete":
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit()
      return true
  }

  return false
}
