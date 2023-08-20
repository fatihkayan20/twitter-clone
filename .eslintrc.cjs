/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaVersion: "latest",
    sourceType: "module",
    project: [
      "./tsconfig.json",
      "./apps/*/tsconfig.json",
      "./packages/*/tsconfig.json",
    ],
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    "no-extra-boolean-cast": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "newline-before-return": "error",
    "lines-around-comment": [
      "error",
      {
        beforeBlockComment: true,
        beforeLineComment: true,
        allowBlockStart: true,
      },
    ],
    "no-console": "error",
  },

  overrides: [
    {
      files: ["*.ts", "*.mts", "*.cts", "*.tsx"],

      rules: {
        "@typescript-eslint/explicit-function-return-type": [
          "error",
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
          },
        ],
      },
    },
    {
      files: [
        "packages/api/**/*.ts",
        "packages/api/**/*.mts",
        "packages/api/**/*.cts",
        "packages/api/**/*.tsx",
      ],

      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
      },
    },
  ],
};
