<template>
  <div class="flex flex-col overflow-hidden h-screen">
    <TitleBar/>
    <main class="overflow-hidden flex flex-col">
      <ModsList/>
      <div class="teleport-target"/>
    </main>
    <ModSettingsDialog/>
    <ProgressModal/>
    <UpdateRequiredDialog/>
    <LoadingOverlay :text="loadingText"/>
  </div>
</template>

<style scoped>

</style>

<script>
  import { ref } from "vue"
  import TitleBar from "./components/TitleBar.vue"
  import ModsList from "./components/ModsList.vue"
  import ModSettingsDialog from "./components/ModSettingsDialog.vue"
  import LoadingOverlay from "./components/LoadingOverlay.vue"
  import { ipcRenderer } from "./utils/ipcRenderer.ts"
  import { useMainStore } from "./pinia"
  import ProgressModal from "./components/ProgressModal.vue"
  import UpdateRequiredDialog from "./components/UpdateRequiredDialog.vue"

  export default {
    name: "App",
    components: { UpdateRequiredDialog, ProgressModal, LoadingOverlay, ModSettingsDialog, ModsList, TitleBar },
    setup() {
      const loadingText = ref(null)
      const store = useMainStore()

      loadingText.value = "Loading mods"
      const setMods = mods => {
        store.mods = mods
        loadingText.value = null
      }

      ipcRenderer.on("manager:mods-updated", (event, mods) => setMods(mods))

      ipcRenderer.on("manager:game-started", (event, id) => {
        store.activeModId = id
      })

      ipcRenderer.on("manager:game-stopped", () => {
        store.activeModId = null
      })

      ipcRenderer.invoke("manager:get-mods").then(mods => {
        if (mods.length > 0) setMods(mods)
      })

      return {
        loadingText
      }
    }
  }
</script>
