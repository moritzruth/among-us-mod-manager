import got from "got"
import { app, dialog } from "electron"

const MODS_URL = process.env.MODS_LIST_URL ??
  "https://raw.githubusercontent.com/moritzruth/among-us-mod-manager/main/resources/mods.json"

export interface RemoteMod {
  id: string
  title: string
  author: string
  projectURL: string
  downloadURL: string
  version: string
  minManagerVersion: string
  amongUsVersion: string
}

let remoteMods: RemoteMod[] = []
export const getRemoteMods = () => remoteMods
export const getRemoteMod: (id: string) => RemoteMod = id => remoteMods.find(mod => mod.id === id)!

export async function fetchRemoteMods(): Promise<void> {
  try {
    remoteMods = (await got(MODS_URL, { responseType: "json" })).body as RemoteMod[]
  } catch {
    dialog.showErrorBox("Mods could not be loaded.", "Please check your internet connection.")
    app.exit(1)
    throw new Error("Mods could not be fetched.")
  }
}
