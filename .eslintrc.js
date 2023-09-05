module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  plugins: ["import", "react", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/electron",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "airbnb",
    "airbnb/hooks",
    "airbnb-typescript",
    "prettier",
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        project: ".",
      },
      alias: {
        map: [
          ["@Assets", "./src/static"],
          ["@Renderer", "./src/renderer"],
          ["@Types", "./src/renderer/types"],
        ],
        extensions: [".ts", ".js", ".jsx", ".tsx", ".json"],
      },
    },
  },
  rules: {
    "prettier/prettier": ["error"],
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "no-underscore-dangle": "off", // we should not use _ in variables in any case
    "react/require-default-props": "off",
    "react/function-component-definition": "off",
    "import/prefer-default-export": "off",
    "react/jsx-no-useless-fragment": "off",
  },
  ignorePatterns: ["/*", "!/src"], // we only care about linting src folder
};
