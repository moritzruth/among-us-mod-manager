/* eslint-disable unicorn/no-keyword-prefix */
// const defaultTheme = require("tailwindcss/defaultTheme")
const colors = require("tailwindcss/colors")
const plugin = require("tailwindcss/plugin")
const selectorParser = require("postcss-selector-parser")

module.exports = {
  purge: ["./index.html", "./**/*.vue"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
        blue: colors.lightBlue,
        green: colors.green
      },
      fontFamily: {
        display: ["Amatic SC"]
      }
    }
  },
  variants: {
    extend: {
      ringWidth: ["hocus", "focus-visible"],
      backgroundOpacity: ["hocus"],
      backgroundColor: ["hocus"],
      scale: ["hocus"],
      textDecoration: ["focus-visible"]
    }
  },
  plugins: [
    plugin(({ addVariant, config }) => {
      const prefixClass = name => {
        const prefix = config("prefix")
        const getPrefix = typeof prefix === "function" ? prefix : () => prefix
        return `${getPrefix(`.${name}`)}${name}`
      }

      addVariant("group-focus-within", ({ modifySelectors, separator }) => modifySelectors(({ selector }) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        selectorParser(selectors => {
          selectors.walkClasses(classNode => {
            classNode.value = `group-focus-within${separator}${classNode.value}`
            classNode.parent
              .insertBefore(classNode, selectorParser()
                .astSync(`.${prefixClass("group")}:focus-within `))
          })
        }).processSync(selector)))

      addVariant("hocus", ({ modifySelectors, separator }) => {
        modifySelectors(({ selector }) => selectorParser(selectors => {
          const clonedSelectors = selectors.clone();
          [selectors, clonedSelectors].forEach((sel, index) => {
            sel.walkClasses(classNode => {
              classNode.value = `hocus${separator}${classNode.value}`
              classNode.parent.insertAfter(
                classNode,
                selectorParser.pseudo({ value: `:${index === 0 ? "hover" : "focus-visible"}` })
              )
            })
          })
          selectors.append(clonedSelectors)
        }).processSync(selector))
      })
    })
  ]
}
