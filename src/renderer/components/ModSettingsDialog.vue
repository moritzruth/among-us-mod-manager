<template>
  <ModalDialog
    closable
    :title="`Settings: ${mod?.title}`"
    :model-value="active"
    @close="close()"
  >
    <template #default>
      <KInput v-model="data.customServerAddress" label="Custom Server Address"/>
    </template>
    <template #buttons>
      <KButton :loading="loading" @click="save()">
        Save
      </KButton>
    </template>
  </ModalDialog>
</template>

<style scoped>

</style>

<script>
  import { ref, watchEffect, computed, reactive } from "vue"
  import { useMainStore } from "../pinia"
  import { ipcRenderer } from "../utils/ipcRenderer.ts"
  import ModalDialog from "./ModalDialog.vue"
  import KInput from "./KInput.vue"
  import KButton from "./KButton.vue"

  export default {
    name: "ModSettingsDialog",
    components: { KButton, KInput, ModalDialog },
    setup() {
      const store = useMainStore()
      const mod = ref(null)
      const loading = ref(false)

      const data = reactive({
        customServerAddress: ""
      })

      watchEffect(() => {
        if (store.settingsDialogModId !== null) {
          mod.value = store.mods.find(m => m.id === store.settingsDialogModId)
          data.customServerAddress = mod.value.customServerAddress ?? ""
        }
      })

      return {
        loading,
        data,
        active: computed(() => store.settingsDialogModId !== null),
        mod,
        close() {
          store.settingsDialogModId = null
        },
        async save() {
          loading.value = true
          await ipcRenderer.invoke(
            "manager:set-custom-server-address",
            mod.value.id,
            data.customServerAddress === "" ? null : data.customServerAddress
          )

          this.close()
          loading.value = false
        }
      }
    }
  }
</script>
