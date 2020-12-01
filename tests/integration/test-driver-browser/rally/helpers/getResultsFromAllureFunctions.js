/* eslint-disable default-case */
const fs = require('fs');
const rallyconfig = require('../rallyconfig');
const strings = require('../constants/strings');
const path = require('path')

const ALLURE_FOLDER = '../python/allureFolder';

const cmd = process.argv;

/**
* Parses the Allure report files from the specified folder
*
* @param {String} report Path to the folder containing files with Allure reports
* @returns {Array} Array of JS objects containing data found in Allure reports in the specified folder
*/
function parseReportData(folder) {
  return fs.readdirSync(folder).filter(file => path.extname(file) === '.json').map(file => {
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
* @returns {String} Duration of execution of the test case
*/
function getDuration(testCase) {
  const { start, stop } = testCase;
  return ((stop - start) / 1000).toFixed(2);
}

/**
* Gets browser in which the Test Case was executed from Allure report
*
* @param {Object} testCase Object representing one test case from Allure report
* @returns {String} Browser name in which the test case was executed
*/
// TODO add functionality
// function getBrowser(testCase) {

// }

function parseArgs() {
  const parameters = {};
  cmd.forEach(arg => {
    if (arg.includes('=')) {
      const args = arg.split('=');
      parameters[args[0]] = args[1];
    }
  });
  return parameters;
}
/**
* Returns build in which the Test Case was executed
*
* @returns {String} Build number
*/
function getBuild(cmdArguments) {
  if (strings.cmdArguments.build in cmdArguments) {
    return cmdArguments[strings.cmdArguments.build];
  }
  return rallyconfig.automation.build;
}

/**
* Returns release in which the Test Case was executed
*
* @returns {String} Release
*/
function getRelease(cmdArguments) {
  if (strings.cmdArguments.release in cmdArguments) {
    return cmdArguments[strings.cmdArguments.release];
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
* @returns {String} OS on which the Test Case was executed
*/
function getOS(cmdArguments) {
  if (!(strings.cmdArguments.os in cmdArguments)) {
    return rallyconfig.automation.OS;
  }
  switch (cmdArguments[strings.cmdArguments.os]) {
    case strings.osCMD.mac13: return strings.OS.macOS13;
    case strings.osCMD.mac14: return strings.OS.macOS14;
    case strings.osCMD.mac15: return strings.OS.macOS15;
    case strings.osCMD.win10: return strings.OS.msWin10;
    case strings.osCMD.win19: return strings.OS.msWin19;
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
    const { steps } = testCase;
    const firstFailedStep = steps.find(step => step.status !== passed).name;
    return `Failed step: ${firstFailedStep}`;
  }
}

/**
* Gets data from each file in Allure folder and adds it to the object that will be added to batch later uploaded to Rally
*
* @returns {Array} Array of objects that will be added to batch later uploaded to Rally
*/
function getReportData() {
  const cmdArguments = parseArgs();
  const allureReportsArray = parseReportData(ALLURE_FOLDER);
  let rallyDataArray = [];

  // iterate over the data contained in each file in allureFolder
  for (let i = 0; i < allureReportsArray.length; i++) {
    const verdict = getStatus(allureReportsArray[i]);
    if (allureReportsArray[i].name.includes('[TC')) {
      // for failed TC add failed step to notes
      const notesForFailedStep = getFirstFailedStep(allureReportsArray[i], verdict);
      const {notes : rallyConfigNotes } = rallyconfig.automation;
      const notes = notesForFailedStep !== undefined ? `${rallyConfigNotes}<br><hr><br>${notesForFailedStep}` : rallyConfigNotes;
      // create object for data from one TC
      const rallyDataObject = {
        duration: getDuration(allureReportsArray[i]),
        // browser: getBrowser(arrayData[i]),
        verdict: verdict,
        testCaseId: getTestCaseId(allureReportsArray[i]),
        build: getBuild(cmdArguments),
        release: getRelease(cmdArguments),
        OS: getOS(cmdArguments),
        notes: notes
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