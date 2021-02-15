import { app, dialog } from "electron"
import { detectOriginalGameVersion } from "./gameInfo"
import { registerIPC, sendUIModData } from "./ipc"
import { fetchRemoteMods } from "./remoteMods"
import { discoverInstalledMods } from "./installedMods"
import { STEAM_APPS_DIRECTORY } from "./util"

export function initiateManager() {
  registerIPC()

  Promise.all([
    discoverInstalledMods(),
    fetchRemoteMods(),
    detectOriginalGameVersion()
  ]).then(() => {
    sendUIModData()
  })
}

export async function loadGameVersionOrShowError() {
  try {
    await detectOriginalGameVersion()
  } catch {
    dialog.showErrorBox(
      "Among Us could not be found",
      `Please make sure Among Us is installed in the default location of Steam games. (${STEAM_APPS_DIRECTORY})`
    )

    app.exit(1)
  }
}

export { isGameRunning } from "./installedMods"
export { getOriginalGameVersion } from "./gameInfo"
export { STEAM_APPS_DIRECTORY } from "./util"
