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
  globals: {
    __MOCK__: true,
    __IS_WS__: false,
    __USERNAME__: 'username',
    __PASSWORD__: 'passwd',
    __DEV__: true,
    workstation: {},
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  transformIgnorePatterns: ['/node_modules/(?!(lodash-es)/)'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/features/SubscriptionDelivery/sagas/**/*.*',
    '!src/features/SubscriptionDelivery/services/api.ts',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/httpProxy/MockedHttpProxy.ts',
    '!**/__mock__/**/*.*',
    '!src/httpProxy/MockProxy.tsx',
    '!src/main.tsx',
    '!src/@types/**/*.*',
    '!src/httpProxy/mock/**/*.*',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!**/__mock_data__/**/*.*',
    '!**/mocks/**/*.*',
    '!src/store/*',
    '!**/*.eslintrc.js',
    '!src/**/*.d.ts',
  ],
  testResultsProcessor: './build/scripts/jest-results-processor.js',
  testEnvironment: 'jsdom',
  resetMocks: true,
  timers: 'legacy',
  moduleDirectories: ['node_modules', path.join(__dirname, './')],
};
