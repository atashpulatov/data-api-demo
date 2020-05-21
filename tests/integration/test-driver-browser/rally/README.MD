# Rally script

This script serves for uploading Test Case results to Rally.

##### Adding your Rally API key

Start with creating your API key.
  a) Go to this website, log in with your corporate credentials and go to API KEYS: https://rally1.rallydev.com/login/accounts/index.html#/apps
  b) Create your key.
  c) create file ".env" in test-driver-browser folder
  d) add this line there: 
  RALLY_API_KEY ='YOUR_KEY'

##### Automated testing

The main logic for uploading Test Case results to Rally from automation can be found in ./automated/updateAutomatedTCResult.js

If you trigerred the [AUTOMATION] suites manually and you want to upload the results to Rally, follow these points:

1) After the automation suite execution finished, the results from this run were created under allure-report and allure-results folders.

2) Specify the fields values which you want to upload the results in [./rallyconfig.js] file in 
automation {} object, e.g.:
automation: {
    testSet: '', // only for Release Validation
    notes: 'Automation results', // for Release Validation change to 'Release Validation'
    env: 'AQDT Mirror',
    exportApp: 'Microsoft Office 365',
    OS: 'Mac OS 10.14 Mojave',
    language: 'English',
    build: '11.2.02343.2348',
    release: '11.2.x'
  }


Build, release, and OS can also be specified from cmd as mentioned later.

You can specify the Test Set only for RELEASE VALIDATION.

3) To upload the parsed results use: 'npm run rally' command from test-driver-browser folder with the following options:
  a) verdict: 'npm run rally' command by default uploads passed results. Add 'fail' parameter to upload failed results or 'all' to upload all the results. 
    e.g. npm run rally fail 
    e.g. npm run rally all 
    e.g. npm run rally pass = npm run rally
  b) build, OS and release: you can specify the build, OS and release IN THIS PARTICULAR ORDER after all/fail/pass parameter: 
    e.g. npm run rally pass 11.2.0100.22939 mac14 11.2.x
    For OS you have following options:
    mac13 for 'Mac OS 10.13 High Sierra',
    mac14 for 'Mac OS 10.14 Mojave',
    mac15 for  'Mac OS 10.15 Catalina',
    win10 for  'Microsoft Windows 10',
    win19 for 'Microsoft Windows Server 2019'


##### Manual testing
The main logic for uploading Test Case results to Rally from manual testing can be found in ./manual/updateManualResults.js
You run the script with command: npm run rally-man. The command has no other options.

To upload the results from manual execution, follow these points:

1) Go to ./rallyconfig.js file and
  a) add IDs of the Test Cases that should be uploaded with Pass verdict to passedTestCases array and those with Fail verdict to failedTestCases array in 'manual' object, e.g.
    manual: {
    passedTestCases: ['TS1234'],
    failedTestCases: ['TS1234', 'TS1214'],
   .......
  },
  b) add the rest of the fields to 'manual' object,
  manual: {
    passedTestCases: ['TS1234'],
    failedTestCases: ['TS1234', 'TS1214'],
    testSet: '',
    release: '11.2.x',
    build: '11.23.5253.523',
    duration: '',
    OS: 'Mac OS 10.15 Catalina',
    language: 'English',
    exportApp: 'Microsoft Office 365',
    env: 'AQDT Mirror',
    notes: '',
    browser: 'Chrome'
  c) testSet field can be left empty('') or pass there Test Set ID('TS212')

  d) add your email to email, e.g:
    email: 'stasiek@microstrategy.com'

## Built With

node.js
Rally Web Services Api

## Authors

* Joanna Kowalczyk

