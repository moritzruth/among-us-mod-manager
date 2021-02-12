<template>
  <div class="bg-gray-800 ring-offset-gray-700 p-4 flex">
    <div class="flex-grow flex flex-col">
      <div>
        <span class="text-3xl">{{ mod.title }}</span>&nbsp;
        <span v-if="status === 'up-to-date'" class="text-xl text-green-400 font-mono">v{{ mod.installedVersion }}</span>
        <span v-else-if="status === 'outdated'" class="text-xl text-red-400 font-mono">update required</span>
        <span v-else-if="status === 'not-installed'" class="text-xl text-gray-400 font-mono">not installed</span>
      </div>
      <span class="block text-1xl">by {{ mod.author }}</span>
      <div class="uppercase font-bold text-blue-400 text-base mt-auto">
        <a class="focus:outline-none focus-visible:underline" :href="mod.projectURL">Website</a>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center space-y-3">
      <div class="flex justify-center items-center">
        <button
          class="text-2xl rounded-full p-5 transform-gpu bg-opacity-40 ring-offset-gray-700
                 transition duration-200 ring-white ring-offset-4"
          :class="actionButtonClasses"
          :disabled="status === 'up-to-date' && activeModId !== null"
          @click="onActionClick()"
        >
          <transition name="slide" mode="out-in">
            <PlayIcon v-if="status === 'up-to-date'" class="relative left-0.5" size="1x"/>
            <RefreshCwIcon v-else-if="status === 'outdated'" size="1x"/>
            <DownloadIcon v-else-if="status === 'not-installed'" size="1x"/>
          </transition>
        </button>
      </div>
      <button
        v-if="showSettingsButton"
        class="flex justify-center items-center space-x-1 text-sm py-1 px-2
               transition duration-200"
        :disabled="settingsDisabled"
        :class="settingsDisabled ? 'opacity-50 cursor-not-allowed' : 'hocus:bg-gray-600'"
        @click="showSettings()"
      >
        <SettingsIcon size="1x"/>
        <span>Settings</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
  .slide-enter-active,
  .slide-leave-active {
    transition: 200ms ease;
    transition-property: opacity, transform;
    display: block;
  }

  .slide-enter-from,
  .slide-leave-to {
    opacity: 0;
  }

  .slide-enter-from {
    transform: translateX(-10px);
  }

  .slide-leave-to {
    transform: translateX(10px);
  }
</style>

<script>
  import { PlayIcon, DownloadIcon, RefreshCwIcon, SettingsIcon } from "@zhuowenli/vue-feather-icons"
  import semver from "semver"
  import { computed, toRef, ref } from "vue"
  import { useMainStore } from "../pinia"
  import { ipcRenderer } from "../utils/ipcRenderer.ts"

  export default {
    name: "ModCard",
    components: { PlayIcon, DownloadIcon, RefreshCwIcon, SettingsIcon },
    props: {
      mod: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const store = useMainStore()
      const status = computed(() => {
        if (props.mod.installedVersion === null) return "not-installed"
        if (semver.lt(props.mod.installedVersion, props.mod.newestVersion)) return "outdated"
        return "up-to-date"
      })

      return {
        status,
        showSettingsButton: false, // Not needed yet
        activeModId: toRef(store, "activeModId"),
        showSettings() {
          store.settingsDialogModId = props.mod.id
        },
        async onActionClick() {
          switch (status.value) {
            case "up-to-date":
              await ipcRenderer.invoke("manager:start", props.mod.id)
              break

            case "outdated":
            case "not-installed":
              await ipcRenderer.invoke("manager:install", props.mod.id)
          }
        },
        settingsDisabled: computed(() => status.value !== "up-to-date" || store.activeModId === props.mod.id),
        actionButtonClasses: computed(() => {
          const classes = []
          if (status.value !== "up-to-date" || store.activeModId === null)
            classes.push("hocus:scale-110", "hocus:bg-opacity-100", "hocus:ring-1")

          switch (status.value) {
            case "up-to-date":
              classes.push("bg-green-400")

              if (store.activeModId !== null) {
                classes.push("cursor-default")

                // it does something weird which is definitely not spinning but looks pretty cool
                if (store.activeModId === props.mod.id)
                  classes.push("cursor-default", "scale-110", "bg-opacity-100", "animate-spin")
              }

              break

            case "not-installed":
              classes.push("bg-yellow-400")
              break

            case "outdated":
              classes.push("bg-blue-400")
          }

          return classes
        })
      }
    }
  }
</script>
