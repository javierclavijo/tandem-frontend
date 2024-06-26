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
      "arrow-body-style": ["error", "as-needed"],
      "react/no-unknown-property": ["error", { ignore: ["css"] }], // Avoid issues with emotion
      "react/jsx-fragments": ["error", "syntax"],
      "react/destructuring-assignment": ["error", "always"],
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "react/hook-use-state": "error",
      "react/jsx-curly-brace-presence": [
        "error",
        {
          props: "never",
          children: "never",
          propElementValues: "always",
        },
      ],
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-no-constructed-context-values": "error",
      "react/jsx-no-leaked-render": [
        "error",
        { validStrategies: ["coerce", "ternary"] },
      ],
      "react/jsx-no-useless-fragment": "error",
      "react/no-access-state-in-setstate": "error",
      "react/no-array-index-key": "error",
      "react/no-multi-comp": ["error", { ignoreStateless: true }],
      "react/no-object-type-as-default-prop": "error",
      "react/no-unstable-nested-components": "error",
      "react/self-closing-comp": "error",
    },
    settings: { react: { version: "detect" } },
  },
);
