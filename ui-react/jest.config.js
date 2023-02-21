module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coverageDirectory: 'coverage',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest/jest.setup.js'],
  setupFiles: ['<rootDir>/src/tests/jest/setEnvVars.js'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/tests/jest/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/src/tests/jest/__mocks__/styleMock.js'
  },
  transformIgnorePatterns: ['node_modules/(?!axios)']
};
