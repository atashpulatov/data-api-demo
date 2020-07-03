module.exports = {
  apiUrl: 'https://rally1.rallydev.com/slm/webservice/v2.0',
  rallyApiKey: process.env.RALLY_API_KEY,
  email: '',
  manual: {
    passedTestCases: [],
    failedTestCases: [],
    lowPassTestCases: [],
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
    testSet: '', // only for Release or GA Validation
    notes: '', // for Release Validation change to 'Release Validation', for GA - 'GA Validation'
    env: '',
    exportApp: '',
    OS: '',
    language: '',
    build: '',
    release: ''
  }
};
