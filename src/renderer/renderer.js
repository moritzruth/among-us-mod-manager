import { createApp } from "vue"
import App from "./App.vue"
import { pinia } from "./pinia"

createApp(App).use(pinia).mount("#app")

if (process.env.NODE_ENV === "development") import("./devtools.js")
