# Rally script

This script serves for uploading Test Case results to Rally.

##### Automated testing

The main logic for uploading Test Case results to Rally from automation can be found in ./automated/updateAutomatedTCResult.js

If you trigerred the automation suites manually and you want to upload the results to Rally, follow these points:

1) After the automation suite execution finished, the results from this run were created under allure-report and allure-results folders.

2) Specify the build and release with which you want to upload the results in ./rallyconfig.js file in {release:'', build: ''} object [PREFERED_OPTION]. You can specify them also from CMD as shown below but this option is more convenient.

You can specify the Test Set - only for RELEASE VALIDATION.

3) The rest of the fields for uploading results to Rally can be found in ./automated/createAutomatedBatchArray.js
  a) You can add environment, exportApp, notes or add your fields

4) To upload the parsed results with passed verdict use: 'npm run rally' script from test-driver-browser. The command has following options:
  a) verdict: 'npm run rally' command by default uploads passed results. Add 'fail' parameter to upload failed results or 'all' to upload all the results. Use these parameters after build and release if you also pass those 
    e.g. npm run rally fail (release and build in rallyconfig.js file)
    e.g. npm run rally all (release and build in rallyconfig.js file))
    e.g. npm run rally pass 
  b) build and release: you can specify the build and release [IN_THIS_ORDER] after all/fail/pass parameter: 
    e.g. npm run rally pass 11.2.0100.22939 11.2.x
  c) npm run rally by default uploads passed result but you can't pass build and release without all/pass/fail parameter


##### Manual testing
The main logic for uploading Test Case results to Rally from manual testing can be found in ./manual/updateManualResults.js

To upload the results from manual execution, follow these points:

1) Go to ./rallyconfig.js file and
  a) add IDs of the Test Cases that should be uploaded with Pass verdict to passedTestCases array
     and those with Fail verdict to failedTestCases array
     e.g. manualTestCases: {
      passedTestCases: ['TC7321', 'TC62729']
      failedTestCases: ['TC7393']
    }
  b) add release and build 

  b) If you want to add those results under some specific Test Set, add Test Set ID in testSet,
    e.g. testSet: 'TS2234'

  c) add your email to email, e.g:
    email: 'stasiek@microstrategy.com'
  
  d) The rest of the fields for uploading results to Rally can be found in ./manual/createManualBatchArray.js
    a) You can add there browser, duration, notes, etc.


## Built With

node.js
Rally Web Services Api

## Authors

* Joanna Kowalczyk

