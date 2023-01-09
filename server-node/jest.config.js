const path = require('path');

// Jest Configuration Reference:
// https://jestjs.io/docs/en/configuration

module.exports = {
  verbose: true,
  rootDir: path.resolve(__dirname),
  testEnvironment: "node",
  // coverage config
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!**/node_modules/**',
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  coverageThreshold: {
    global: {
      lines: 90
    }
  },
  // // map @ alias to src folder
  // moduleNameMapper: {
  //   '^@/(.*)$': '<rootDir>/src/$1'
  // },
};
