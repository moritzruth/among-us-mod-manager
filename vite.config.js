import pathLib from "path"
import vue from "@vitejs/plugin-vue"

const externals = [
  "electron",
  "assert",
  "async_hooks",
  "buffer",
  "child_process",
  "cluster",
  "console",
  "constants",
  "crypto",
  "dgram",
  "dns",
  "domain",
  "events",
  "fs",
  "http",
  "http2",
  "https",
  "inspector",
  "module",
  "net",
  "os",
  "path",
  "perf_hooks",
  "process",
  "punycode",
  "querystring",
  "readline",
  "repl",
  "stream",
  "string_decoder",
  "timers",
  "tls",
  "trace_events",
  "tty",
  "url",
  "util",
  "v8",
  "vm",
  "zlib"
]

/**
 * @type {import('vite').UserConfig}
 */
export default {
  root: pathLib.resolve(__dirname, "./src/renderer"),
  publicDir: pathLib.resolve(__dirname, "./src/static"),
  plugins: [vue()],
  server: {
    open: false
  },
  build: {
    outDir: "../../dist/renderer",
    polyfillDynamicImport: false,
    rollupOptions: {
      external: externals
    },
    emptyOutDir: true
  }
}
