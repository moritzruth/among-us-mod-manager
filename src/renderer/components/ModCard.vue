<template>
  <div class="bg-gray-700 ring-offset-gray-700 p-4 flex">
    <div class="flex-grow flex flex-col">
      <div>
        <span class="text-3xl">{{ mod.title }}</span>&nbsp;
        <span v-if="status === 'up-to-date'" class="text-xl text-green-400">v{{ mod.installedVersion }}</span>
        <span v-else-if="status === 'outdated'" class="text-xl text-red-400">update required</span>
        <span v-else-if="status === 'not-installed'" class="text-xl text-gray-400">not installed</span>
      </div>
      <span class="block text-1xl">by {{ mod.author }}</span>
      <div class="uppercase font-bold text-blue-400 text-base bg-gray-700 mt-auto">
        <a class="focus:outline-none focus-visible:underline" :href="mod.url">Website</a>
      </div>
    </div>
    <div class="flex flex-col space-y-3">
      <div class="flex justify-center items-center">
        <button
          class="text-2xl rounded-full p-5 transform-gpu bg-opacity-40 ring-offset-gray-700
               hocus:scale-110 hocus:bg-opacity-100 transition duration-200 hocus:ring-1 ring-white ring-offset-4"
          :class="status === 'up-to-date' ? 'bg-green-400' : (status === 'outdated' ? 'bg-blue-400' : 'bg-yellow-400')"
        >
          <PlayIcon v-if="status === 'up-to-date'" class="relative left-0.5" size="1x"/>
          <RefreshCwIcon v-else-if="status === 'outdated'" size="1x"/>
          <DownloadIcon v-else-if="status === 'not-installed'" size="1x"/>
        </button>
      </div>
      <button
        class="flex justify-center items-center space-x-1 text-sm py-1 px-2
               transition duration-200 hocus:bg-gray-600"
        @click="showSettings()"
      >
        <SettingsIcon size="1x"/>
        <span>Settings</span>
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>

<script>
  import { PlayIcon, DownloadIcon, RefreshCwIcon, SettingsIcon } from "@zhuowenli/vue-feather-icons"
  import semver from "semver"
  import { useMainStore } from "../pinia"

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

      return {
        showSettings() {
          store.settingsDialogModId = props.mod.id
        }
      }
    },
    computed: {
      status() {
        if (this.mod.installedVersion === null) return "not-installed"
        if (semver.lt(this.mod.installedVersion, this.mod.newestVersion)) return "outdated"
        return "up-to-date"
      }
    }
  }
</script>
