module.exports = {
  transform: { '^.+\\.[jt]sx?$': 'ts-jest', },
  moduleNameMapper: {
    '\\.(css|less|scss|sass|gif)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMocks.js',
    '^antd/es/(.*)$': 'antd/lib/$1',
    '^lodash-es$': 'lodash',
    '^@mstr/(.*)/es/(.*)$': '@mstr/$1/lib/$2',
  },
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/es/', 'antd'],
  transformIgnorePatterns: ['/node_modules/(?!(@mstr/rc-3)/)'],
  setupFiles: [`<rootDir>/src/setupTestFiles.js`],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testMatch: ['<rootDir>src/**/*\\.test\\.(ts|tsx|js)'],
  testEnvironment: 'jsdom',
  resetMocks: false,
};
