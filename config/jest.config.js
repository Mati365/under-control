module.exports = {
  setupFilesAfterEnv: ['@testing-library/jest-dom', 'jest-extended/all'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/packages/*/dist/*',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testRegex: 'test\\.(ts|tsx|js|jsx)$',
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
