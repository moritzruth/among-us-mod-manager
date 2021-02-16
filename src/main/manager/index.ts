import { registerIPC, sendUIModData } from "./ipc"
import { fetchRemoteMods } from "./remoteMods"
import { discoverInstalledMods } from "./installedMods"

export function initiateManager() {
  registerIPC()

  Promise.all([
    discoverInstalledMods(),
    fetchRemoteMods()
  ]).then(() => {
    sendUIModData()
  })
}

export { isGameRunning } from "./installedMods"
export {
  getOriginalGameVersion,
  isValidGameDirectory,
  doStartupCheck,
  getDirectoryForInstallations,
  showOriginalGameDirectorySelectDialog,
  detectOriginalGameVersion
} from "./gameInfo"
