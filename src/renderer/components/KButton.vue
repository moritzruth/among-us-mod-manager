<template>
  <button
    class="k-button rounded-md text-md border-gray-400 border px-4 py-2 transition duration-200 ring-black ring-offset-2
           relative overflow-hidden focus:outline-none flex items-center focus-visible:ring-2 text-white w-24"
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="event => onClick(event)"
  >
    <component
      :is="icon"
      v-if="icon"
      class="mr-2"
      size="20"
    />
    <span class="flex items-center justify-center flex-grow whitespace-nowrap">
      <slot/>
    </span>
    <span class="flex justify-center items-center absolute top-0 left-0 bottom-0 right-0 pointer-events-none">
      <span class="loader bg-gray-500 transition-opacity duration-100" :class="loaderClasses">
        <span class="bg-white block"/>
      </span>
    </span>
    <KRipple ref="ripple" :on="variant === 'primary' ? 'white' : 'black'"/>
  </button>
</template>

<style scoped>
  .k-button {
    -webkit-tap-highlight-color: transparent;
  }

  .loader {
    height: 2px;
    width: 60%;
    max-width: 60px;

    position: relative;
  }

  .loader > span {
    position: absolute;
    top: 0;
    bottom: 0;

    animation: 0.8s infinite loader linear;
  }

  @keyframes loader {
    0% {
      width: 0;
      left: 0;
      right: unset;
    }
    50% {
      width: 100%;
      left: 0;
      right: unset;
    }
    51% {
      left: unset;
      right: 0;
    }
    100% {
      width: 0;
      left: unset;
      right: 0;
    }
  }
</style>

<script>
  import KRipple from "./KRipple.vue"

  export default {
    name: "KButton",
    components: { KRipple },
    props: {
      variant: {
        type: String,
        default: "default",
        validate: value => ["default", "primary"].includes(value)
      },
      type: {
        type: String,
        default: "button"
      },
      icon: {
        type: null,
        default: null
      },
      disabled: {
        type: Boolean
      },
      loading: {
        type: Boolean
      }
    },
    emits: ["ripple", "click"],
    computed: {
      buttonClasses() {
        const classes = []

        if (this.loading) classes.push("text-opacity-0", "cursor-wait")
        else if (this.disabled) {
          classes.push("cursor-not-allowed", "bg-gray-900", "text-gray-500")
          return classes
        }

        switch (this.variant) {
          case "default":
            classes.push("text-gray-300")

            if (!this.loading) {
              if (this.disabled) classes.push("text-opacity-50")
              else classes.push("hover:border-white")
            }

            break

          case "primary":
            classes.push("text-white", "bg-black", "shadow-lg")

            if (!this.loading) {
              if (this.disabled) classes.push("bg-opacity-80", "text-opacity-80")
              else classes.push("hover:bg-opacity-90")
            }
        }

        return classes
      },
      loaderClasses: vm => vm.loading ? ["opacity-100", "duration-500"] : ["opacity-0"]
    },
    methods: {
      onClick(event) {
        if (this.disabled || this.loading) return

        this.$refs.ripple.trigger(event)
        this.$emit("click", event)
      }
    }
  }
</script>
