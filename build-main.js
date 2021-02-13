const path = require("path")
const { default: NodeResolve } = require("@esbuild-plugins/node-resolve")
const { build } = require("esbuild")
const { version } = require("./package.json")

const isDev = process.argv.includes("--dev")
if (isDev) console.log("Watching...")
else console.log("Building...")

build({
  watch: isDev,
  bundle: true,
  entryPoints: [path.resolve(__dirname, "./src/main/main.ts")],
  platform: "node",
  outfile: path.resolve(__dirname, "./dist/main.js"),
  define: {
    "process.env.IS_DEV": `"${isDev}"`,
    "__MANAGER_VERSION": `"${version}"`
  },
  plugins: [
    NodeResolve({
      extensions: [".ts", ".js"],
      onResolved: resolved => {
        if (resolved.includes("node_modules")) {
          return {
            external: true
          }
        }
        return resolved
      }
    })
  ]
})
