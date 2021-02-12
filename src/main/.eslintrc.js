const path = require("path")

module.exports = {
  "extends": "awzzm-ts",
  "env": {
    "node": true,
    "browser": false
  },
  ignorePatterns: [".eslintrc.js"],
  "parserOptions": {
    "project": path.resolve(__dirname, "../../tsconfig.json")
  },
  rules: {
    "@typescript-eslint/no-misused-promises": "off"
  }
}
