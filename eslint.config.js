import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
pluginReact.configs.flat.recommended.rules["react/react-in-jsx-scope"] = 0;

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { ignores: ["cypress/", "cypress.*", "dist/", "node_modules/"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
