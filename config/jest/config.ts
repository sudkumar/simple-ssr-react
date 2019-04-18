/**
 * This is the setup file our jest
 */

// WE ARE IN THE TESTING ENVIRONMENT SO MAKE IT CLEAR
process.env.BABEL_ENV = "test"
process.env.NODE_ENV = "test"

const { appDirectory, srcPath, packagesPath } = require("./../paths")

const config = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The root directory that Jest should scan for tests and modules within
  rootDir: appDirectory,

  // A list of paths to directories that Jest should use to search for files in
  roots: ["<rootDir>/src"],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of file extensions your modules use
  moduleFileExtensions: ["ts", "tsx", "js", "json", "jsx", "node"],

  moduleDirectories: [srcPath, packagesPath, "node_modules"],

  // The path to a module that runs some code to configure or set up the testing framework before each test
  setupTestFrameworkScriptFile: "<rootDir>/config/jest/setup.tsx",

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/__tests__/**/*.{js,ts}?(x)",
    "**/?(*.)+(spec|test).{js,ts}?(x)",
  ],

  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
}
export default config
