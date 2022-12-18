const path = require('path');

module.exports = ({ rootDir }) => ({
  rootDir,
  preset: 'ts-jest',
  setupFilesAfterEnv: [path.resolve(__dirname, './jest.setup.js')],
  testPathIgnorePatterns: ['node_modules'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testRegex: '.test\\.(ts|tsx|js|jsx)$',
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest'],
  },
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts, tsx}'],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
  },
});
