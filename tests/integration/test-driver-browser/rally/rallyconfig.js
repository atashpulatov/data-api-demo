module.exports = {
  apiUrl: 'https://rally1.rallydev.com/slm/webservice/v2.0',
  rallyApiKey: process.env.RALLY_API_KEY,
  manualTestCases: {
    passedTestCases: [],
    failedTestCases: []

  },
  email: '',
  testSet: '',
  release: '',
  build: '',
  OS: '',
  manual: {},
  automation: {
    notes: 'Automation results', // for Release Validation change to 'Release Validation'
    env: '',
    exportApp: '',
  }
};
