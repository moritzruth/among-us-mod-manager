import { getWindow } from "../window"

export function send(channel: string, ...arguments_: unknown[]) {
  getWindow().webContents.send(channel, ...arguments_)
}
