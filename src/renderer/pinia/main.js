import { defineStore } from "pinia"

export const useMainStore = defineStore({
  id: "main",
  state: () => ({
    settingsDialogModId: null,
    mods: Object.fromEntries([
      {
        id: "extra-roles",
        title: "Extra Roles",
        author: "NotHunter101",
        url: "https://github.com/NotHunter101/ExtraRolesAmongUs",
        newestVersion: "1.2.4",
        installedVersion: null
      },
      {
        id: "extra-roles2",
        title: "Extra Roles",
        author: "NotHunter101",
        url: "https://github.com/NotHunter101/ExtraRolesAmongUs",
        newestVersion: "1.2.4",
        installedVersion: "1.2.4"
      },
      {
        id: "extra-roles3",
        title: "Extra Roles",
        author: "NotHunter101",
        url: "https://github.com/NotHunter101/ExtraRolesAmongUs",
        newestVersion: "1.2.4",
        installedVersion: "1.2.3"
      },
      {
        id: "extra-roles4",
        title: "Extra Roles",
        author: "NotHunter101",
        url: "https://github.com/NotHunter101/ExtraRolesAmongUs",
        newestVersion: "1.2.4",
        installedVersion: null
      },
      {
        id: "extra-roles5",
        title: "Extra Roles",
        author: "NotHunter101",
        url: "https://github.com/NotHunter101/ExtraRolesAmongUs",
        newestVersion: "1.2.4",
        installedVersion: null
      }
    ].map(mod => [mod.id, mod]))
  }),
  actions: {}
})
