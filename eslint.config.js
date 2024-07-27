import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
const reactRules = {
  "react/react-in-jsx-scope": 0,
  "react/display-name": 0,
};
Object.assign(pluginReact.configs.flat.recommended.rules, reactRules);
export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { ignores: ["cypress/", "cypress.*", "dist/", "node_modules/"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
