module.exports = {
  apiUrl: 'https://rally1.rallydev.com/slm/webservice/v2.0',
  rallyApiKey: process.env.RALLY_API_KEY,
  email: '',
  manual: {
    passedTestCases: [],
    failedTestCases: [],
    testSet: '',
    release: '',
    build: '',
    duration: '',
    OS: '',
    language: '',
    exportApp: '',
    env: '',
    notes: '',
    browser: ''
  },
  automation: {
    testSet: '', // only for Release Validation
    notes: 'Automation results', // for Release Validation change to 'Release Validation'
    env: '',
    exportApp: '',
    OS: '',
    language: 'English',
    build: '',
    release: '11.2.2 [2020-Jun-05]'
  }
};
