import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const nextPlugin = require("@next/eslint-plugin-next");
const nextCoreConfig = nextPlugin.flatConfig.coreWebVitals;
const tsParser = require("@typescript-eslint/parser");

const config = [
  nextCoreConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx,cjs,mjs}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    }
  },
  {
    ignores: ["node_modules/**", ".next/**"]
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: "error"
    }
  }
];

export default config;
