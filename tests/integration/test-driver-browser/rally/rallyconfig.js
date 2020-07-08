module.exports = {
  apiUrl: 'https://rally1.rallydev.com/slm/webservice/v2.0',
  rallyApiKey: process.env.RALLY_API_KEY,
  email: '',
  manual: {
    passedTestCases: [], // e.g. ['TC234', 'TC21324']
    failedTestCases: [], // e.g. ['TC234', 'TC21324']
    lowPassTestCases: [], // e.g. ['TC234']
    testSet: '', // e.g. 'TS1342'
    release: '', // e.g. '11.2.2 [2020-Jun-05]' - exact name from Rally
    build: '', // e.g. '11.1.1.3423'
    duration: '', // in seconds
    OS: '', // e.g. 'Mac OS 10.15 Catalina' - exact name from Rally
    language: '', // e.g. 'English'
    exportApp: '', // e.g. 'Microsoft Office 365 - exact name from Rally
    env: '', // e.g 'AQDT Mirror'  - exact name from Rally
    notes: '', // whatever you wish
    browser: '' // e.g 'Chrome' - exact name from Rally
  },
  automation: {
    testSet: '', // only for Release or GA Validation
    notes: '', // for Release Validation change to 'Release Validation', for GA - 'GA Validation'
    env: '', // e.g 'AQDT Mirror'  - exact name from Rally
    exportApp: '', // e.g. 'Microsoft Office 365 - exact name from Rally
    OS: '', // e.g. 'Mac OS 10.15 Catalina' - exact name from Rally
    language: '', // e.g. 'English'
    build: '', // e.g. '11.1.1.3423'
    release: '' // e.g. '11.2.2 [2020-Jun-05]' - exact name from Rally
  }
};
