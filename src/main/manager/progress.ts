import { send } from "./util"

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

export function updateProgress(state: Partial<ProgressState>) {
  currentProgressState = { ...currentProgressState, ...state }
  send("manager:progress", currentProgressState)
}
