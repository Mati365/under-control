module.exports = ({ rootDir }) => ({
  verbose: true,
  rootDir,
  setupFilesAfterEnv: ['@testing-library/jest-dom', 'jest-extended/all'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/packages/*/dist/*',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testRegex: '.test\\.(ts|tsx|js|jsx)$',
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
});
