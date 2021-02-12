<template>
  <div class="flex flex-col overflow-hidden h-screen">
    <TitleBar/>
    <main class="overflow-hidden flex flex-col">
      <ModsList/>
      <div class="teleport-target"/>
    </main>
    <ModSettingsDialog/>
  </div>
</template>

<style scoped>

</style>

<script>
  import TitleBar from "./components/TitleBar.vue"
  import ModsList from "./components/ModsList.vue"
  import ModSettingsDialog from "./components/ModSettingsDialog.vue"

  export default {
    name: "App",
    components: { ModSettingsDialog, ModsList, TitleBar }
  }
</script>
