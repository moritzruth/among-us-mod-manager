<template>
  <div
    class="relative group focus-within:opacity-100 transition duration-200"
    :class="disabled ? 'opacity-50' : 'opacity-80'"
  >
    <div class="flex items-center">
      <label
        :for="realID"
        class="block text-md mb-1 text-gray-100"
      >
        {{ label }}
        <span v-if="required" class="text-xs">(Required)</span>
      </label>
    </div>
    <input
      v-bind="$attrs"
      :id="realID"
      ref="inputElement"
      class="border border-gray-500 rounded-md w-full h-10 px-3 transition duration-200 placeholder-gray-600
             bg-transparent focus:ring-0 focus:border-white focus:outline-none"
      :class="inputClasses"
      :type="realType"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :value="modelValue"
      :required="required"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="onBlur()"
    >
    <button
      v-if="type === 'password'"
      ref="passwordButtonElement"
      class="text-blue-600 text-sm text-opacity-70 transition-colors block absolute top-10 right-3 transform
             hover:text-opacity-100 focus:text-opacity-100 focus:outline-none focus-visible:underline"
      type="button"
      :disabled="disabled"
      :aria-label="showPassword
        ? 'Hide password' : 'Show password as plain text. This will display your password on the screen.'"
      @click="toggleShowPassword()"
    >
      {{ showPassword ? "Hide" : "Show" }}
    </button>
    <div
      class="text-red-600 text-sm error-message overflow-hidden pt-1 pl-0.5"
      :style="{ height: showErrorMessage ? errorMessageHeight : 0 }"
    >
      {{ errorMessage }}
    </div>
    <div ref="errorMessageFakeElement" aria-hidden="true" class="absolute text-sm invisible overflow-hidden pl-0.5">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style>
  .error-message {
    transition: height 200ms linear;
  }
</style>

<script>
  import { useID } from "vue-prim"
  import { ref, computed, nextTick, toRefs } from "vue"

  export default {
    name: "KInput",
    inheritAttrs: false,
    props: {
      modelValue: {
        type: String,
        default: ""
      },
      label: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: "text"
      },
      errorMessage: {
        type: null,
        default: null,
        validate: value => value === null || typeof value === "string"
      },
      autocomplete: {
        type: String,
        default: "off"
      },
      showErrorMessage: Boolean,
      disabled: Boolean,
      required: Boolean
    },
    emits: ["update:modelValue"],
    setup(props) {
      const { type } = toRefs(props)
      const showPassword = ref(false)
      const inputElement = ref(null)
      const passwordButtonElement = ref(null)
      const errorMessageFakeElement = ref(null)
      const errorMessageHeight =
        computed(() => (errorMessageFakeElement.value.getBoundingClientRect().height + 5) + "px")

      let refocus = false

      return {
        inputElement,
        passwordButtonElement,
        errorMessageFakeElement,
        showPassword,
        errorMessageHeight,
        onBlur() {
          setTimeout(() => {
            refocus = document.activeElement === passwordButtonElement.value
            if (!refocus) showPassword.value = false
          }, 0)
        },
        toggleShowPassword() {
          showPassword.value = !showPassword.value

          if (refocus) {
            refocus = false
            nextTick(() => {
              const end = inputElement.value.value.length
              inputElement.value.setSelectionRange(end, end)
              inputElement.value.focus()
            })
          }
        },
        realID: useID(),
        realType: computed(() => {
          if (type.value === "password") {
            return showPassword.value ? "text" : "password"
          }
          return type.value
        }),
        inputClasses: computed(() => {
          const classes = []
          if (type.value === "password") classes.push("pr-14")
          if (props.disabled) classes.push("cursor-not-allowed")
          return classes
        }),
        focus() {
          inputElement.value.focus()
        }
      }
    }
  }
</script>
