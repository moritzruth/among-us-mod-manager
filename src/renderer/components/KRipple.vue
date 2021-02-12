<template>
  <div
    ref="el"
    class="k-ripple__ripple"
    :class="on === 'white' ? 'bg-black bg-opacity-10' : 'bg-white bg-opacity-30'"
    :data-show="position !== null"
    :style="position === null ? {} : { left: position[0] + 'px', top: position[1] + 'px' }"
    @animationend="position = null"
  />
</template>

<style scoped>
  .k-ripple__ripple {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    opacity: 0;
    pointer-events: none;
  }

  .k-ripple__ripple[data-show="true"] {
    animation: 1.2s ripple linear, 400ms 100ms fade-out both linear;
  }

  @keyframes fade-out {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  @keyframes ripple {
    from {
      transform: scale(1)
    }

    to {
      transform: scale(100)
    }
  }
</style>

<script lang="ts">
  import { ref } from "vue"

  export default {
    name: "KRipple",
    props: {
      disabled: Boolean,
      on: {
        type: String,
        default: "black",
        validate: value => value === "black" || value === "white"
      }
    },
    setup() {
      const position = ref(null)

      return {
        el: ref(null),
        position,
        onRipple(clickX, clickY) {
          const { x, y } = this.el.parentElement.getBoundingClientRect()
          position.value = [clickX - x, clickY - y]
        }
      }
    },
    methods: {
      trigger(event) {
        this.onRipple(event.pageX, event.pageY)
      }
    }
  }
</script>
