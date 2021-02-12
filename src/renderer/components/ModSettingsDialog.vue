<template>
  <ModalDialog
    closable
    :title="`Settings: ${mod?.title}`"
    :model-value="active"
    @close="onClose()"
  >
    <template #default>
      <KInput required label="Custom Server Address"/>
    </template>
    <template #buttons>
      <KButton loading>
        Save
      </KButton>
    </template>
  </ModalDialog>
</template>

<style scoped>

</style>

<script>
  import { ref, watchEffect, computed } from "vue"
  import { useMainStore } from "../pinia"
  import ModalDialog from "./ModalDialog.vue"
  import KInput from "./KInput.vue"
  import KButton from "./KButton.vue"

  export default {
    name: "ModSettingsDialog",
    components: { KButton, KInput, ModalDialog },
    setup() {
      const store = useMainStore()
      const mod = ref(null)

      watchEffect(() => {
        if (store.settingsDialogModId !== null) mod.value = store.mods[store.settingsDialogModId]
      })

      return {
        active: computed(() => store.settingsDialogModId !== null),
        mod,
        onClose() {
          store.settingsDialogModId = null
        }
      }
    }
  }
</script>
