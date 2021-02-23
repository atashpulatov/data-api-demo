# Rally script

This script serves for uploading Test Case results to Rally.

##### Adding your Rally API key

Start with creating your API key.

  a) Go to the following website, log in with your corporate credentials and go to API KEYS: https://rally1.rallydev.com/login/accounts/index.html#/apps

  b) Create your key.

  c) Create file *.env* in *test-driver-browser* folder

  d) Add this line there: 
```
  RALLY_API_KEY ='YOUR_KEY'
  ```
##### Automated testing

The main logic for uploading Test Case results to Rally from automation can be found in *./updateAutomatedTCResult.js*

For results from CI pipeline Production Release should be changed in *./rallyconfig.js* file in *automated* object every release and pushed to the branch from where automation is run. The results will be uploaded automatically.

If suites are going to be trigerred manually,

1)
```
--format allure_behave.formatter:AllureFormatter -o allureFolder
```
should be added to *behave* command, as specified in *../python/docs/running_tests.md*.

2) allureFolder should be deleted before starting test execution; it can be dome manually or by adding the command *rm -r -f allureFolder &&* to the beginning of behave command, e.g.
```
rm -r -f allureFolder && behave --no-color --logging-level=WARNING --format allure_behave.formatter:AllureFormatter -o allureFolder --no-capture-stderr --no-logcapture tests/features/F22954_editing
```

The next steps for the automation tests from manual and pipeline execution are:

1) After the automation suite execution finished, the raw data for the results report can be found under *../python/allureFolder*.

2) In order to update results to Rally, you have to generate the report from the raw data by running the following command:
  *'allure generate allureFolder --clean'*
  from 
  *../python* folder.

3) Specify the fields values which you want to upload the results in *./rallyconfig.js* file in 
*automation* object, e.g.:
```
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
  ```

Build, release, and OS can also be specified from CMD as mentioned later.

4) To upload the parsed results run: `npm run rally` command from test-driver-browser folder with the following options:

  a) verdict: `npm run rally` command by default uploads passed results. Add `verdict=fail` parameter to upload failed results or `verdict=all` to upload all the results. 

    e.g. `npm run rally verdict=fail`

    e.g. `npm run rally verdict=all`

    e.g. `npm run rally` = (`npm run rally verdict=pass`)

  b) you can specify the build, OS and release from CMD with the following parameters: 
  ```
  build=buildNumber

  release=releaseValue

  os=OS, where OS can be

    mac13 for 'Mac OS 10.13 High Sierra'
    mac14 for 'Mac OS 10.14 Mojave',
    mac15 for 'Mac OS 10.15 Catalina',
    win10 for 'Microsoft Windows 10',
    win19 for 'Microsoft Windows Server 2019'
  ```
  For instance:

  `npm run rally verdict=pass build=11.2.0100.22939 os=mac14 release=11.2.x`

  Parameters passed from CMD will overwrite the corresponding values from *./rallyconfig.js* file.
   
##### Manual testing
The main logic for uploading Test Case results to Rally from manual testing can be found in *./updateManualResults.js*.

You run the script with command: `npm run rally-man`. The command has no other options.

To upload the results from manual execution, follow these points:

1) Go to *./rallyconfig.js* file and

  a) add IDs of the Test Cases that should be uploaded with Pass verdict to *passedTestCases* array and those with Fail verdict to *failedTestCases* array in *manual* object, e.g.
  ```
    manual: {
    passedTestCases: ['TC1234'],
    failedTestCases: ['TC1234', 'TC1214'],
   .......
  },
  ```

  b) add the rest of the fields to 'manual' object,
  ```
  manual: {
    passedTestCases: ['TC1234'],  
    failedTestCases: ['TC1234', 'TC1214'],
    testSet: 'TS212', // not obligatory
    release: '11.2.x',
    build: '11.23.5253.523',
    duration: '',
    OS: 'Mac OS 10.15 Catalina',
    language: 'English',
    exportApp: 'Microsoft Office 365',
    env: 'AQDT Mirror',
    notes: '',
    browser: 'Chrome'
  }
```
  c) add your email to email, e.g:

    email: 'stasiek@microstrategy.com'

2) Run the script `rally-man` with the following command from *test-driver-browser* folder:

  `npm run rally-man`

## Test Set duration

You can upload machine time to the given Test Set by running the script "add-duration" from test-driver-browser folder.
You run it with the command `npm run add-duration testSetId`, e.g.

  `npm run add-duration TS1324`

## Built With

node.js

Rally Web Services Api


## Authors

* Joanna Kowalczyk

