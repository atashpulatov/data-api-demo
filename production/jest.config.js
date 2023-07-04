const path = require('path');

process.env.TZ = 'UTC';

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
  moduleDirectories: ['node_modules', path.join(__dirname, './')],
};
