module.exports = {
  roots: ['<rootDir>'],
  coverageReporters: ['html', 'cobertura', 'text', 'json-summary', 'lcov'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(t|j)sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  transformIgnorePatterns: ['/node_modules/(?!(lodash-es)/)'],
  testEnvironment: 'jsdom',
  resetMocks: true,
  timers: 'legacy',
  setupFiles: [
    './setupFakedIndexedDB.js',
  ],
  coverageThreshold: {
    global: {
      lines: 90,
      branches: 80,
      functions: 80,
      statements: -10
    }
  },
};
