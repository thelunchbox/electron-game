import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["**/eslint.config.mjs"]), {
    extends: compat.extends("eslint:recommended"),

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
            ...globals.commonjs,
        },

        ecmaVersion: "latest",
        sourceType: "commonjs",
    },

    rules: {
        indent: ["error", 2],
        "linebreak-style": ["error", "windows"],
        "no-var": "error",

        "prefer-const": ["error", {
            destructuring: "all",
            ignoreReadBeforeAssign: false,
        }],

        "no-setter-return": ["off"],

        quotes: ["error", "single"],
        semi: ["error", "always"],
    },
}]);