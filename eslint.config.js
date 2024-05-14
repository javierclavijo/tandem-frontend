import { fixupPluginRules } from "@eslint/compat";
import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      react: fixupPluginRules(eslintPluginReact),
      "react-hooks": eslintPluginReactHooks, // Sadly doesn't work as of 2024/05/13 (see https://github.com/pplancq/dev-tools/issues/261).
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReact.configs["jsx-runtime"].rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      "react/no-unknown-property": ["error", { ignore: ["css"] }], // Avoid issues with emotion
      "react/jsx-fragments": ["error", "syntax"],
    },
    settings: { react: { version: "detect" } },
  },
);