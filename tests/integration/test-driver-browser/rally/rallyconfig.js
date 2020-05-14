module.exports = {
  apiUrl: 'https://rally1.rallydev.com/slm/webservice/v2.0',
  rallyApiKey: process.env.RALLY_API_KEY,
  manual: {
    manualTestCases: {
      passedTestCases: [''],
      failedTestCases: []
    },
    email: '',
    testSet: '',
  },
  automation: {
    release: '11.2.x',
    build: '1'
  }
};
