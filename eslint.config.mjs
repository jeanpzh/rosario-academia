import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      "airbnb-typescript/base",
      "next/core-web-vitals",
      "plugin:prettier/recommended",
      "plugin:tailwindcss/recommended",
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["react", "@typescript-eslint", "prettier", "tailwindcss"],
    parserOptions: {
      ecmaVersion: "latest",

      sourceType: "module",
      project: "./tsconfig.json",
      tsconfigRootDir: __dirname,
    },
    rules: {
      "@typescript-eslint/lines-between-class-members": "off",
      "@typescript-eslint/no-throw-literal": "off",
      quotes: [2, "double", { avoidEscape: true }],
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          tabWidth: 2,
          trailingComma: "all",
          printWidth: 100,
          arrowParens: "always",
          bracketSpacing: true,
          jsxBracketSameLine: false,
          jsxSingleQuote: false,
          quoteProps: "as-needed",
          useTabs: false,
          semi: true,
          endOfLine: "auto",
        },
      ],
      "import/no-extraneous-dependencies": "off",
      "@typescript-eslint/naming-convention": "off",
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": "warn",
      "tailwindcss/no-contradicting-classname": "error",
      "no-trailing-spaces": "off",
      "react/no-unescaped-entities": "off",
      "tailwindcss/no-custom-classname": "off",
      "@next/next/no-img-element": "off",
    },
  }),
];

export default eslintConfig;
