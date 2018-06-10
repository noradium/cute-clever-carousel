module.exports = {
  "moduleFileExtensions": ["js", "jsx", "json", "ts", "tsx"],
  "transform": {
    "\\.ts$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  "testRegex": '/test/*/.*\\.test\\.ts$',
  // "collectCoverage": true,
  "collectCoverageFrom": [
    "src/**/*.ts"
  ]
};
