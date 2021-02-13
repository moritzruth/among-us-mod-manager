<template>
  <ModalDialog v-model="store.showUpdateRequired" title="Update Required" closable>
    <template #default>
      <div class="text-center font-bold w-64">
        An update is required for installing this mod.
      </div>
    </template>
    <template #buttons>
      <KButton @click="update()">
        Update
      </KButton>
    </template>
  </ModalDialog>
</template>

<style scoped>

</style>

<script>
  import { useMainStore } from "../pinia"
  import { ipcRenderer } from "../utils/ipcRenderer.ts"
  import ModalDialog from "./ModalDialog.vue"
  import KButton from "./KButton.vue"

  export default {
    name: "UpdateRequiredDialog",
    components: { KButton, ModalDialog },
    setup() {
      return {
        store: useMainStore(),
        update() {
          ipcRenderer.send("window:show-releases")
        }
      }
    }
  }
</script>
