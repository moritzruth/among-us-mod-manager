import { ipcMain } from "electron"
import { getOriginalGameVersion } from "./gameInfo"
import { send } from "./util"
import { getRemoteMods } from "./remoteMods"
import { getInstalledMods, installModIfMinManagerVersionSatisfied, startMod, uninstallMod } from "./installedMods"

interface UIMod {
  id: string
  title: string
  author: string
  projectURL: string
  installedVersion: string | null
  outdated: boolean
}

const getUIModData: () => UIMod[] = () => getRemoteMods().map(remoteMod => {
  const installedMod = getInstalledMods().find(mod => mod.id === remoteMod.id)

  return {
    id: remoteMod.id,
    title: remoteMod.title,
    author: remoteMod.author,
    installedVersion: installedMod?.version ?? null,
    projectURL: remoteMod.projectURL,
    outdated: installedMod === undefined
      ? false
      : installedMod.version !== remoteMod.version || installedMod.amongUsVersion !== getOriginalGameVersion()
  }
})

export function sendUIModData() {
  send("manager:mods-updated", getUIModData())
}

export function registerIPC() {
  ipcMain.handle("manager:get-mods", () => getUIModData())
  ipcMain.handle("manager:install", async (event, id) => installModIfMinManagerVersionSatisfied(id))
  ipcMain.handle("manager:uninstall", async (event, id) => uninstallMod(id))
  ipcMain.handle("manager:start", async (event, id) => startMod(id))
}
