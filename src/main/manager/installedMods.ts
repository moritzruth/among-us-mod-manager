import pathLib from "path"
import fs from "fs-extra"
import download from "download"
import decompress from "decompress"
import execa from "execa"
import { app } from "electron"
import semver from "semver"
import { getWindow } from "../window"
import { isDevelopment, MANAGER_VERSION } from "../constants"
import { detectGameVersion } from "./detectGameVersion"
import { send, STEAM_APPS_DIRECTORY } from "./util"
import { getRemoteMod, RemoteMod } from "./remoteMods"
import { updateProgress } from "./progress"
import { getOriginalGameVersion, ORIGINAL_GAME_DIRECTORY } from "./gameInfo"
import { sendUIModData } from "./ipc"

interface InstalledMod {
  id: string
  version: string
  path: string
  amongUsVersion: string
}

let installedMods: InstalledMod[] = []
export const getInstalledMods = () => installedMods
export const getInstalledMod: (id: string) => InstalledMod = id => installedMods.find(mod => mod.id === id)!

export async function discoverInstalledMods() {
  const directoryNames = await fs.readdir(STEAM_APPS_DIRECTORY)
  installedMods = (await Promise.all(directoryNames.map<Promise<InstalledMod | null>>(async name => {
    const directory = pathLib.resolve(STEAM_APPS_DIRECTORY, name)
    const dataPath = pathLib.resolve(directory, "aumm.json")

    if (await fs.pathExists(dataPath)) {
      const data = await fs.readJson(dataPath) as Omit<InstalledMod, "path" | "amongUsVersion">
      const amongUsVersion = await detectGameVersion(directory)

      return { path: directory, amongUsVersion, ...data } as InstalledMod
    }

    return null
  }))).filter(mod => mod !== null) as InstalledMod[]
}

let activeModId: string | null = null
export const isGameRunning = () => activeModId !== null

async function saveInstalledMod(mod: InstalledMod) {
  const { path, ...data } = mod
  await fs.writeJson(pathLib.resolve(path, "aumm.json"), data)
}

async function installMod(remoteMod: RemoteMod) {
  const alreadyInstalledIndex = installedMods.findIndex(mod => mod.id === remoteMod.id)
  if (alreadyInstalledIndex !== -1) installedMods.splice(alreadyInstalledIndex, 1)

  const directory = pathLib.resolve(STEAM_APPS_DIRECTORY, `Among Us (${remoteMod.title})`)

  updateProgress({ title: "Install: " + remoteMod.title, text: "Preparing", finished: false })
  if (await fs.pathExists(directory)) await fs.remove(directory)

  updateProgress({ text: "Copying game files" })
  await fs.copy(ORIGINAL_GAME_DIRECTORY, directory)

  const request = download(remoteMod.downloadURL, directory, { filename: "__archive" })

  request.on("downloadProgress", ({ percent }) => {
    updateProgress({ text: `Downloading (${Math.trunc(percent * 100)}%)` })
  })

  await request

  updateProgress({ text: "Extracting" })

  const archivePath = pathLib.resolve(directory, "__archive")
  await decompress(archivePath, directory)

  updateProgress({ text: "Cleaning up" })
  await fs.remove(archivePath)

  const installedMod: InstalledMod = {
    id: remoteMod.id,
    version: remoteMod.version,
    path: directory,
    amongUsVersion: getOriginalGameVersion()
  }

  updateProgress({ text: "Saving metadata" })
  await saveInstalledMod(installedMod)
  installedMods.push(installedMod)
  sendUIModData()

  updateProgress({ finished: true })
}

export async function startMod(id: string) {
  const installedMod = getInstalledMod(id)

  const process = execa(
    pathLib.resolve(installedMod.path, "Among Us.exe"),
    { detached: false, stdout: "ignore", stderr: isDevelopment ? "inherit" : "ignore", windowsHide: false }
  )

  activeModId = installedMod.id
  send("manager:game-started", installedMod.id)

  process.on("exit", async () => {
    activeModId = null

    const window = getWindow()
    send("manager:game-stopped")
    if (!window.isVisible()) app.exit()
  })
}

export async function installModIfMinManagerVersionSatisfied(id: string): Promise<boolean> {
  const remoteMod = getRemoteMod(id)
  if (semver.lt(MANAGER_VERSION, remoteMod.minManagerVersion)) return false
  await installMod(remoteMod)
  return true
}

export async function uninstallMod(id: string): Promise<void> {
  const remoteMod = getRemoteMod(id)
  const installedMod = getInstalledMod(id)

  updateProgress({
    title: `Uninstall: ${remoteMod.title}`,
    text: "Removing game files",
    finished: false
  })

  await fs.remove(installedMod.path)

  updateProgress({ finished: true })
  installedMods.splice(installedMods.findIndex(mod => mod.id === remoteMod.id), 1)
  sendUIModData()
}
