import "./devtools.js"
import { createApp } from "vue"
import App from "./App.vue"
import { pinia } from "./pinia"

createApp(App).use(pinia).mount("#app")
