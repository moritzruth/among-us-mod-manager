<template>
  <div class="app__title-bar w-full h-16 bg-gray-800 text-gray-100 flex items-center relative z-10">
    <div class="title-bar__draggable flex justify-center items-center w-16 h-16 flex-grow-0">
      <img class="h-12" src="/icon.png" alt="The app icon">
    </div>
    <div class="flex-grow title-bar__draggable px-1">
      <span class="text-3xl font-display font-bold">Among Us Mod Manager</span>
    </div>
    <div class="flex">
      <button
        class="app__title-button flex justify-center items-center text-3xl w-16 h-16
               bg-opacity-0 hover:bg-opacity-70 bg-blue-500 transition duration-200"
        tabindex="-1"
        @click="minimize()"
      >
        <MinusIcon class="relative top-2" size="1x"/>
      </button>
      <button
        class="app__title-button flex justify-center items-center text-3xl w-16 h-16
               bg-opacity-0 hover:bg-opacity-70 bg-red-500 transition duration-200"
        tabindex="-1"
        @click="close()"
      >
        <XIcon size="1x"/>
      </button>
    </div>
  </div>
</template>

<style scoped>
  .title-bar__draggable {
    /*noinspection CssUnknownProperty*/
    -webkit-app-region: drag
  }
</style>

<script>
  import { XIcon, MinusIcon } from "@zhuowenli/vue-feather-icons"
  import { ipcRenderer } from "../utils/ipcRenderer.ts"

  export default {
    name: "TitleBar",
    components: { XIcon, MinusIcon },
    methods: {
      minimize() {
        ipcRenderer.send("window:minimize")
      },
      close() {
        window.close()
      }
    }
  }
</script>
