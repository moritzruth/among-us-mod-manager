import { defineStore } from "pinia"

export const useMainStore = defineStore({
  id: "main",
  state: () => ({
    settingsDialogModId: null,
    mods: [],
    activeModId: null,
    showUpdateRequired: false
  })
})
