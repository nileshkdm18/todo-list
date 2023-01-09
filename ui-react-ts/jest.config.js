module.exports = {
  // to show describe and it description
  verbose: true,
  // Jest transformations -- this adds support for TypeScript
  // using ts-jest
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  // transformIgnorePatterns: ['node_modules/(?!axios)'],
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/jest/jest.setup.ts'],
  setupFiles: ['<rootDir>/tests/jest/setEnvVars.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/tests/jest/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/tests/jest/__mocks__/styleMock.js'
  },
  // coverage setting
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/reportWebVitals.ts',
    '<rootDir>/src/react-app-env.d.ts',
    '<rootDir>/src/index.tsx'
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      lines: 90
    }
  }
};
