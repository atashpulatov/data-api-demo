const fs = require('fs');
const rallyconfig = require('../rallyconfig');
const strings = require('../constants/strings');

const cmd = process.argv;

/**
* Parses the Allure report files from the specified folder
*
* @param {String} report Path to the folder containing files with Allure reports
* @returns {Array} Array of JS objects containing data found in Allure reports in the specified folder
*/
function parseReportData(folder) {
  return fs.readdirSync(folder).map(file => {
    const relativePath = folder + '/' + file;
    return JSON.parse(fs.readFileSync(relativePath));
  })
}

/**
* Gets Test Case ID from Allure report
*
* @param {Object} testCase Object containing data from one test case from Allure report
* @returns {String} Test Case ID
*/
function getTestCaseId(testCase) {
  try {
    const re = /\[(TC\d+)\]/;
    const testName = testCase.name;
    const testId = testName.split(re)[1];
    return testId;
  } catch (error) {
    throw Error(`No Test Case ID found for ${testCase}`);
  }
}

/**
* Gets Test Case status from Allure report and parses it into Rally verdict
*
* @param {Object} testCase Object representing one test case from Allure report
* @returns {String} Test Case verdict to be uploaded to Rally
*/
function getStatus(testCase) {
  const { status } = testCase;
  const { fail, pass, passed } = strings.status;
  return status === passed ? pass : fail;
}

/**
* Gets duration of execution of a Test Case
*
* @param {Object} testCase Object representing one test case from Allure report
* @returns {String} Duration of execution of the test case in seconds
*/
function getDuration(testCase) {
  const { duration } = testCase.time;
  return (duration / 1000).toFixed(2);
}

/**
* Parses arguments from command line
*
* @returns {Object} containing key-value pairs representing command line argument and its value
*/

function parseArgs() {
  const parameters = {};
  cmd.forEach(arg => {
    if (arg.includes('=')) {
      const args = arg.split('=');
      parameters[args[0]] = args[1];
    }
  });
  console.log(parameters)
  return parameters;
}
/**
* Returns build in which the Test Case was executed
*
* @param {Object} cmdArguments Containing key-value pairs representing arguments passed to the script from command line
* @returns {String} Build number
*/
function getBuild(cmdArguments) {
  const {build} = strings.cmdArguments;
  if (build in cmdArguments) {
    return cmdArguments[build];
  }
  return rallyconfig.automation.build;
}

/**
* Returns release in which the Test Case was executed
*
* @param {Object} cmdArguments Containing key-value pairs representing arguments passed to the script from command line
* @returns {String} Release
*/
function getRelease(cmdArguments) {
  const {release} = strings.cmdArguments;
  if (release in cmdArguments) {
    return cmdArguments[release];
  }
  return rallyconfig.automation.release;
}

/**
* Gets data from the Allure report with the specified verdict from cmd (all, pass or fail)
*
* @param {Array} tests Array of objects (test results) to be uploaded to Rally
* @returns {Array} Array of objects (test results) with specified verdict containing data that will be uploaded to Rally
*/
function getTestsWithVerdict(tests) {
  const parameters = parseArgs();
  let verdict = '';
  if (strings.cmdArguments.verdict in parameters) {
    verdict = parameters[strings.cmdArguments.verdict];
  } else {
    verdict = 'pass';
  }

  if (verdict === 'all') {
    return tests;
  }
  return tests.filter(test => test.verdict === (verdict.charAt(0).toUpperCase() + verdict.slice(1)));
}

/**
* Returns OS on which the Test Case was executed
*
* @param {Object} cmdArguments Containing key-value pairs representing arguments passed to the script from command line
* @returns {String} OS on which the Test Case was executed
*/
function getOS(cmdArguments) {
  const { os } = strings.cmdArguments;
  const { mac13, mac14, mac15, win10, win19 } = strings.osCMD;
  const { macOS13, macOS14, macOS15, msWin10, msWin19} = strings.OS;

  if (!(os in cmdArguments)) {
    return rallyconfig.automation.OS;
  }

  switch (cmdArguments[strings.cmdArguments.os]) {
    case mac13: return macOS13;
    case mac14: return macOS14;
    case mac15: return macOS15;
    case win10: return msWin10;
    case win19: return msWin19;
  }
}

/**
* Gets first failed step in a failed Test Case
*
* @param {Object} testCase Object representing one test case from Allure report
* @returns {String} added to Notes for failed Test Case; contains first failed step
*/
function getFirstFailedStep(testCase, verdict) {
  const { pass, passed } = strings.status;
  if (verdict !== pass) {
    const { steps } = testCase.testStage;
    const firstFailedStep = steps.find(step => step.status !== passed).name;
    return `Failed step: ${firstFailedStep}`;
  }
}

/**
* Gets browser in which the Test Case was executed from Allure report
*
* @param {Object} cmdArguments Containing key-value pairs representing arguments passed to the script from command line
* @returns {String} Browser name in which the test case was executed
*/
function getBrowser(cmdArguments) {
  const { browser } = rallyconfig.automation;
  const { target } = strings.cmdArguments;
  const { macChrome, winChrome } = strings.target;
  const { chrome } = strings.browser;

  if (!(target in cmdArguments)) {
    return browser;
  }

  switch (cmdArguments[target]) {
    case macChrome:
    case winChrome:
      return chrome;
  }
}

/**
* Gets browser in which the Test Case was executed from Allure report
*
* @param {Object} cmdArguments Containing key-value pairs representing arguments passed to the script from command line
* @returns {String} Export application in which the test case was executed
*/

function getExportApp(cmdArguments) {
  const { exportApp } = rallyconfig.automation;
  const { macChrome, winChrome, macDesktop, winDesktop } = strings.target;
  const { office2019, office365 } = strings.officeVersion;
  const { target } = strings.cmdArguments;

  if (!(target in cmdArguments)) {
    return exportApp;
  }

  switch (cmdArguments[target]) {
    case macChrome:
    case winChrome:
      return office365;
    case macDesktop:
    case winDesktop:
      return office2019;
  }
}

/**
* Gets data from each file in Allure folder and adds it to the object that will be added to batch later uploaded to Rally
*
* @returns {Array} Array of objects that will be added to batch later uploaded to Rally
*/
function getReportData() {
  const cmdArguments = parseArgs();
  const allureReportsArray = parseReportData(strings.allureFolderPath);
  let rallyDataArray = [];

  // iterate over the data contained in each file in allure-report
  for (let i = 0; i < allureReportsArray.length; i++) {
    const verdict = getStatus(allureReportsArray[i]);
    if (allureReportsArray[i].name.includes('[TC')) {
      // for failed TC add failed step to notes
      const notesForFailedStep = getFirstFailedStep(allureReportsArray[i], verdict);
      const { notes: rallyConfigNotes } = rallyconfig.automation;
      const notes = notesForFailedStep !== undefined ? `${rallyConfigNotes}<br><hr><br>${notesForFailedStep}` : rallyConfigNotes;
      // create object for data from one TC
      const rallyDataObject = {
        duration: getDuration(allureReportsArray[i]),
        browser: getBrowser(cmdArguments),
        verdict: verdict,
        testCaseId: getTestCaseId(allureReportsArray[i]),
        build: getBuild(cmdArguments),
        release: getRelease(cmdArguments),
        OS: getOS(cmdArguments),
        notes: notes,
        exportApp: getExportApp(cmdArguments)
      };
      rallyDataArray.push(rallyDataObject);
    }
  }
  return rallyDataArray;
}

module.exports = {
  getReportData: getReportData,
  getTestsWithVerdict: getTestsWithVerdict
}