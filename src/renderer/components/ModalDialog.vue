<template>
  <teleport to="body">
    <div
      class="bg-black fixed top-0 left-0 w-screen h-screen flex justify-center items-center p-10 transition
             duration-200"
      :class="active ? 'bg-opacity-70 pointer-events-auto' : 'bg-opacity-0 pointer-events-none'"
      @mousedown.self="close()"
    >
      <div :tabindex="active ? 0 : -1" @focus="onFocusBefore()"/>
      <div
        ref="dialogElement"
        role="dialog"
        class="transition duration-200 transform bg-gray-800 rounded-md shadow-lg p-5 relative shadow-xl"
        :class="active ? 'opacity-100 scale-100' : 'opacity-0 scale-95'"
        :aria-labelledby="titleID"
        :aria-modal="active.toString()"
      >
        <transition name="fade">
          <button
            v-if="closable"
            class="absolute -right-3 -top-3 bg-gray-800 shadow-md rounded-full p-2 transition hocus:bg-gray-600
                 focus:outline-none"
            aria-label="Close"
            @click="close()"
          >
            <XIcon size="1.5x"/>
          </button>
        </transition>
        <header class="mb-6">
          <div :id="titleID" class="text-2xl font-bold text-center px-3">
            {{ title }}
          </div>
          <div class="h-px w-1/2 mx-auto mt-4 bg-gray-300"/>
        </header>
        <div ref="dialogContentAndButtonsElement">
          <div>
            <slot/>
          </div>
          <div v-if="$slots.buttons" class="mt-5 flex justify-end">
            <slot name="buttons"/>
          </div>
        </div>
      </div>
      <div :tabindex="active ? 0 : -1" @focus="onFocusAfter()"/>
    </div>
  </teleport>
</template>

<style scoped>
  /*noinspection CssUnusedSymbol*/
  .fade-enter-active,
  .fade-leave-active {
    transition: 0.3s ease opacity;
  }

  /*noinspection CssUnusedSymbol*/
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>

<script>
  import { useID } from "vue-prim"
  import { watch, toRefs, ref } from "vue"
  import { XIcon } from "@zhuowenli/vue-feather-icons"

  const attemptFocus = node => {
    try {
      if (node.getAttribute("tabindex") !== -1) node.focus()
    } catch {
      // ignored
    }

    return document.activeElement === node
  }

  const getChildrenDeep = node => [...node.children]
    .flatMap(child => [...getChildrenDeep(child), child])

  const setFocusableDeep = (node, focusable) => {
    getChildrenDeep(node).forEach(child => {
      if (focusable) {
        const original = child.dataset.originalTabindex
        if (original === undefined) child.removeAttribute("tabindex")
        else child.setAttribute("tabindex", original)

        child.removeAttribute("data-original-tabindex")
      } else {
        if (child.dataset.originalTabindex !== undefined) return

        const original = child.getAttribute("tabindex")
        if (original !== null) child.dataset.originalTabindex = original

        child.setAttribute("tabindex", "-1")
      }
    })
  }

  const focusFirstDescendant = node => [...node.childNodes.values()]
    .some(child => attemptFocus(child) || focusFirstDescendant(child))

  const focusLastDescendant = node => [...node.childNodes.values()].reverse()
    .some(child => attemptFocus(child) || focusLastDescendant(child))

  const activeModalsStack = []

  window.addEventListener("keydown", event => {
    if (activeModalsStack.length === 0) return

    if (event.key === "Escape") {
      activeModalsStack[0].close()
      event.stopPropagation()
    }
  })

  export default {
    name: "ModalDialog",
    inheritAttrs: false,
    props: {
      title: {
        type: String,
        required: true
      },
      closable: Boolean,
      modelValue: Boolean
    },
    emits: ["update:modelValue", "close"],
    setup(properties, { emit }) {
      const { modelValue: active } = toRefs(properties)
      const dialogElement = ref(null)
      const dialogContentAndButtonsElement = ref(null)

      const forceClose = () => {
        emit("update:modelValue", false)
        emit("close")
      }

      const close = () => {
        if (properties.closable) forceClose()
      }

      const stackItem = { close }

      watch([dialogElement, active], () => {
        if (dialogElement.value !== null) setFocusableDeep(dialogElement.value, active.value)

        if (active.value) {
          activeModalsStack.unshift(stackItem)
          focusFirstDescendant(dialogContentAndButtonsElement.value)
        } else activeModalsStack.splice(activeModalsStack.indexOf(stackItem), 1)
      }, { immediate: true })

      return {
        dialogElement,
        dialogContentAndButtonsElement,
        active,
        XIcon,
        titleID: useID(),
        close,
        onFocusBefore() {
          focusLastDescendant(dialogElement.value)
        },
        onFocusAfter() {
          focusFirstDescendant(dialogElement.value)
        }
      }
    }
  }
</script>
