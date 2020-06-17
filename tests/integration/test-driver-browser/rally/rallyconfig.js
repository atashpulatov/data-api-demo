module.exports = {
  apiUrl: 'https://rally1.rallydev.com/slm/webservice/v2.0',
  rallyApiKey: process.env.RALLY_API_KEY,
  email: 'slukaszewicz@microstrategy.com',
  manual: {
    passedTestCases: [],
    failedTestCases: [],
    testSet: '',
    release: '',
    build: '',
    duration: '',
    OS: '',
    language: 'English',
    exportApp: '',
    env: '',
    notes: '',
    browser: ''
  },
  automation: {
    testSet: 'TS46967', // only for Release Validation
    notes: 'Automation results', // for Release Validation change to 'Release Validation'
    env: 'AWS Tutorial',
    exportApp: 'Microsoft Office 365',
    OS: 'Mac OS 10.15 Catalina',
    language: 'English',
    build: '11.2.0200.14065',
    release: '11.2.2 [2020-Jun-05]'
  }
};
