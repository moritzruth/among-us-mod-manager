import pathLib from "path"
import fs from "fs-extra"
import { detectGameVersion } from "./detectGameVersion"
import { STEAM_APPS_DIRECTORY } from "./util"

export const ORIGINAL_GAME_DIRECTORY = pathLib.resolve(STEAM_APPS_DIRECTORY, "Among Us")

let originalGameVersion: string
export const getOriginalGameVersion = () => originalGameVersion

export async function detectOriginalGameVersion() {
  if (!await fs.pathExists(ORIGINAL_GAME_DIRECTORY)) throw new Error("Among Us could not be found")
  originalGameVersion = await detectGameVersion(ORIGINAL_GAME_DIRECTORY)
}
