<template>
  <div
    class="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center space-y-10 bg-gray-900
           transition duration-400"
    :class="text === null ? 'opacity-0 pointer-events-none' : 'opacity-100'"
  >
    <img
      class="h-32"
      :class="text === null ? '' : 'animate-spin'"
      src="/icon.png"
      alt="Application icon"
      draggable="false"
    >
    <span class="font-display text-3xl">{{ text }}...</span>
  </div>
</template>

<style scoped>

</style>

<script>
  export default {
    name: "LoadingOverlay",
    props: {
      text: {
        type: String,
        default: null,
        validate: value => typeof value === "string" || value === null
      }
    }
  }
</script>
