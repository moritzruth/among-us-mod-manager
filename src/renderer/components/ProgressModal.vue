<template>
  <ModalDialog v-model="active" :title="title">
    <template #default>
      <div class="text-center font-bold">
        {{ text }}
      </div>
    </template>
  </ModalDialog>
</template>

<style scoped>

</style>

<script>
  import { reactive } from "vue"
  import { ipcRenderer } from "../utils/ipcRenderer.ts"
  import ModalDialog from "./ModalDialog.vue"

  export default {
    name: "ProgressModal",
    components: { ModalDialog },
    setup() {
      const data = reactive({
        text: "",
        title: "",
        active: false
      })

      ipcRenderer.on("manager:progress", (event, { text, title, finished }) => {
        data.active = !finished
        data.text = text
        data.title = title
      })

      return data
    }
  }
</script>
