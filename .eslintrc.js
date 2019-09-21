module.exports = {
  env: {
    jest: true,
  },
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "@react-native-community", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended",
  ],
  plugins: ["react-hooks"],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  rules: {
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      rules: {
        "no-unused-vars": ["off"],
        "no-undef": ["off"],
      },
    },
  ],
};
