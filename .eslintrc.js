module.exports = {
  env: {
    browser: false,
    node: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": "error", // Enforce Prettier rules
    "no-underscore-dangle": ["error", { allow: ["_id"] }], // Allow _id (MongoDB convention)
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // Ignore unused vars starting with _
    "consistent-return": "off", // Allow functions without explicit return
    "class-methods-use-this": "off", // Allow model methods without using 'this'
    "no-console": "warn", // Warn about console.log (useful for debugging)
    "no-param-reassign": ["error", { props: false }], // Allow parameter reassignment for req, res
    "func-names": "off", // Allow anonymous functions
    "arrow-body-style": ["error", "as-needed"], // Enforce concise arrow functions when possible
  },
  overrides: [
    {
      files: ["**/test/**"], // Custom rules for test files
      env: {
        mocha: true,
      },
    },
  ],
};
