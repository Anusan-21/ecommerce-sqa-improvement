// jest.config.js
const path = require('path'); // ← add this line

module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      { configFile: path.resolve(__dirname, 'scripts/babel.config.js') } // adjust path as needed
    ]
  }
};