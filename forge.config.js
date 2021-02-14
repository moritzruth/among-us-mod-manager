const { version } = require("./package.json")

module.exports = {
  packagerConfig: {
    name: "Among Us Mod Manager",
    icon: "./resources/icon.ico",
    ignore: path => {
      if (path === "") return false
      const p = path.slice(1)

      if (
        p.startsWith("node_modules") &&
        !p.startsWith("node_modules/.bin") &&
        !p.startsWith("node_modules/electron/") &&
        !p.startsWith("node_modules/electron-prebuilt-compile/") &&
        !p.startsWith("node_modules/electron-prebuilt/")
      ) return false

      return !(p.startsWith("dist") || p.startsWith("LICENSE") || p.startsWith("package.json"))
    }
  },
  makers: [
    {
      name: "@electron-forge/maker-zip",
      platforms: ["win32"]
    },
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        setupExe: `AmongUsModManagerInstaller-${version}.exe`,
        setupIcon: "./resources/icon.ico",
        loadingGif: "./resources/installing.gif",
        iconUrl: "https://raw.githubusercontent.com/moritzruth/among-us-mod-manager/main/resources/icon.ico"
      }
    }
  ]
}
