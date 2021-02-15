import { getWindow } from "../window"

export const STEAM_APPS_DIRECTORY = "C:\\Program Files (x86)\\Steam\\steamapps\\common"

export function send(channel: string, ...arguments_: unknown[]) {
  getWindow().webContents.send(channel, ...arguments_)
}
