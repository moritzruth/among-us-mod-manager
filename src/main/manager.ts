import pathLib from "path"
import got from "got"
import fs from "fs-extra"
import { app, dialog, ipcMain } from "electron"
import download from "download"
import decompress from "decompress"
import execa from "execa"
import { getWindow } from "./window"

const STEAM_APPS_DIRECTORY = "C:\\Program Files (x86)\\Steam\\steamapps\\common"

interface RemoteModData {
  id: string
  title: string
  author: string
  projectURL: string
  downloadURL: string
  version: string
}

interface InstalledModData {
  id: string
  version: string
  path: string
}

interface UIModData {
  id: string
  title: string
  author: string
  projectURL: string
  newestVersion: string
  installedVersion: string | null
}

let activeModId: string | null = null

export const installedMods: InstalledModData[] = []
export const remoteMods: RemoteModData[] = []

export function isModActive() {
  return activeModId !== null
}

export async function discoverInstalledMods() {
  if (installedMods.length > 0) return
  const directoryNames = await fs.readdir(STEAM_APPS_DIRECTORY)
  const mods = (await Promise.all(directoryNames.map<Promise<InstalledModData | null>>(async name => {
    const directory = pathLib.resolve(STEAM_APPS_DIRECTORY, name)
    const dataPath = pathLib.resolve(directory, "aumm.json")

    return (await fs.pathExists(dataPath)
      ? { path: directory, ...await fs.readJson(dataPath) }
      : null) as (InstalledModData | null)
  }))).filter(mod => mod !== null) as InstalledModData[]

  installedMods.push(...mods)
}

export async function fetchRemoteMods(): Promise<void> {
  try {
    remoteMods.push(...(await got("http://m0.is/amongus-mods", { responseType: "json" })).body as RemoteModData[])
  } catch {
    dialog.showErrorBox("Mods could not be loaded.", "Please check your internet connection.")
    app.exit(1)
    throw new Error("Mods could not be fetched.")
  }
}

export async function isAmongUsInstalled(): Promise<boolean> {
  return fs.pathExists(pathLib.resolve(STEAM_APPS_DIRECTORY, "Among Us"))
}

export function getUIModData(): UIModData[] {
  return remoteMods.map(remoteMod => {
    const installedMod = installedMods.find(mod => mod.id === remoteMod.id)

    return {
      id: remoteMod.id,
      title: remoteMod.title,
      author: remoteMod.author,
      installedVersion: installedMod?.version ?? null,
      newestVersion: remoteMod.version,
      projectURL: remoteMod.projectURL
    }
  })
}

async function saveInstalledModData(mod: InstalledModData) {
  const { path, ...data } = mod
  await fs.writeJson(pathLib.resolve(path, "aumm.json"), data)
}

function sendUIModData() {
  getWindow().webContents.send("manager:mods-updated", getUIModData())
}

interface ProgressState {
  title: string
  text: string
  finished: boolean
}

let currentProgressState: ProgressState = {
  title: "",
  text: "",
  finished: true
}

function updateProgress(state: Partial<ProgressState>) {
  currentProgressState = { ...currentProgressState, ...state }
  getWindow().webContents.send("manager:progress", currentProgressState)
}

async function installMod(id: string) {
  const alreadyInstalledIndex = installedMods.findIndex(mod => mod.id === id)
  if (alreadyInstalledIndex !== -1) installedMods.splice(alreadyInstalledIndex, 1)

  const remoteMod = remoteMods.find(mod => mod.id === id)!
  const directory = pathLib.resolve(STEAM_APPS_DIRECTORY, `Among Us (${remoteMod.title})`)

  updateProgress({ title: "Install: " + remoteMod.title, text: "Preparing...", finished: false })
  if (await fs.pathExists(directory)) await fs.remove(directory)

  updateProgress({ text: "Copying game files..." })
  await fs.copy(pathLib.resolve(STEAM_APPS_DIRECTORY, "Among Us"), directory)

  const request = download(remoteMod.downloadURL, directory, { filename: "__archive" })

  request.on("downloadProgress", ({ percent }) => {
    updateProgress({ text: `Downloading... (${Math.trunc(percent * 100)}%)` })
  })

  await request

  updateProgress({ text: "Extracting..." })

  const archivePath = pathLib.resolve(directory, "__archive")
  await decompress(archivePath, directory)

  updateProgress({ text: "Cleaning up..." })
  await fs.remove(archivePath)

  const installedMod: InstalledModData = {
    id: remoteMod.id,
    version: remoteMod.version,
    path: directory
  }

  updateProgress({ text: "Saving metadata..." })
  await saveInstalledModData(installedMod)
  installedMods.push(installedMod)
  sendUIModData()

  updateProgress({ finished: true })
}

async function startModdedGame(id: string) {
  const installedMod = installedMods.find(mod => mod.id === id)!

  const process = execa(
    pathLib.resolve(installedMod.path, "Among Us.exe"),
    { detached: false, stdout: "ignore", stderr: "inherit", windowsHide: false }
  )

  activeModId = installedMod.id
  getWindow().webContents.send("manager:game-started", installedMod.id)

  process.on("exit", async () => {
    activeModId = null

    const window = getWindow()
    window.webContents.send("manager:game-stopped")
    if (!window.isVisible()) app.exit()
  })
}

export function initiateManager() {
  ipcMain.handle("manager:get-mods", () => getUIModData())
  ipcMain.handle("manager:install", async (event, id) => installMod(id))
  ipcMain.handle("manager:start", async (event, id) => startModdedGame(id))

  Promise.all([discoverInstalledMods(), fetchRemoteMods()]).then(() => {
    sendUIModData()
  })
}
