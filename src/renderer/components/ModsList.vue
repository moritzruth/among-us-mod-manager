<template>
  <div class="overflow-hidden relative">
    <div class="bg-black shadow-2xl absolute -top-24 -left-4 -right-4 h-20 mods-list__shadow"/>
    <div class="space-y-2 overflow-y-auto pt-2 h-full">
      <ModCard
        v-for="mod in mods"
        :key="mod.id"
        :mod="mod"
      />
    </div>
  </div>
</template>

<style scoped>
  .mods-list__shadow {
    filter: blur(15px);
  }
</style>

<script>
  import { toRef } from "vue"
  import { useMainStore } from "../pinia"
  import ModCard from "./ModCard.vue"

  export default {
    name: "ModsList",
    components: { ModCard },
    setup() {
      const store = useMainStore()

      return {
        mods: toRef(store, "mods")
      }
    }
  }
</script>
