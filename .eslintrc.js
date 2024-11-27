module.exports = {
  env: {
    browser: false,
    node: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier"], // Prettier is included in extends
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "no-underscore-dangle": ["error", { allow: ["_id"] }], // Allow _id (MongoDB convention)
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
