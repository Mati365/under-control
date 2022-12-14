const path = require('path');

module.exports = ({ rootDir }) => ({
  rootDir,
  preset: 'ts-jest',
  resetMocks: true,
  setupFilesAfterEnv: [path.resolve(__dirname, './jest.setup.js')],
  testPathIgnorePatterns: ['node_modules'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testRegex: '.test\\.(ts|tsx|js|jsx)$',
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest'],
  },
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: ['index.ts'],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
});
