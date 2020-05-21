/* eslint-disable default-case */
const allureReport = './allure-report/data/behaviors.json';
const path = require('path');
const fs = require('fs');
const rallyconfig = require('../rallyconfig');
const strings = require('../strings');

const cmd = process.argv;

/**
 * Parses the Allure report from the specified path
 *
 * @param {String} report Path to Allure report
 * @returns {Array} Array of JS objects containing test data found in Allure report
 */
function parseReportData(report) {
  const filePath = path.resolve(report);
  const results = JSON.parse(fs.readFileSync(filePath));
  return results.children;
}

/**
 * Gets Test Case ID from Allure report
 *
 * @param {Object} testCase Object representing one test case from Allure report
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
 * @returns {String} Test Case verdict
 */
function getStatus(testCase) {
  const { status } = testCase;
  return status[0].toUpperCase() + status.slice(1, 4);
}

/**
 * Gets duration of execution of a Test Case
 *
 * @param {Object} testCase Object representing one test case from Allure report
 * @returns {String} Duration of execution of the test case
 */
function getDuration(testCase) {
  const { duration } = testCase.time;
  return duration;
}

/**
 * Gets browser in which the Test Case was executed from Allure report
 *
 * @param {Object} testCase Object representing one test case from Allure report
 * @returns {String} Browser name in which the test case was executed
 */
function getBrowser(testCase) {
  const parameters = testCase.parameters[0];
  if (parameters.includes('chrome')) {
    return 'Chrome';
  }
  // TODO different browsers
  return '';
}

/**
 * Returns build in which the Test Case was executed
 *
 * @returns {String} Build number
 */
function getBuild() {
  if (!cmd[2]) {
    return rallyconfig.automation.build;
  }
  return cmd[3];
}

/**
 * Returns release in which the Test Case was executed
 *
 * @returns {String} Release
 */
function getRelease() {
  if (!cmd[3]) {
    return rallyconfig.automation.release;
  }
  return cmd[5];
}

/**
* Returns OS on which the Test Case was executed
* If
*
* @returns {String} OS on which the Test Case was executed
*/
function getOS() {
  if (!cmd[2]) {
    return rallyconfig.automation.OS;
  }
  switch (cmd[4]) {
    case strings.osCMD.mac13: return strings.OS.macOS13;
    case strings.osCMD.mac14: return strings.OS.macOS14;
    case strings.osCMD.mac15: return strings.OS.macOS15;
    case strings.osCMD.win10: return strings.OS.msWin10;
    case strings.osCMD.win19: return strings.OS.msWin19;
  }
}

/**
 * Gets data from the Allure report for all the test cases found in Allure report
 *
 * @returns {Array} Array of objects containing data that will be uploaded to Rally
 */
function getReportData() {
  const arrayData = parseReportData(allureReport);
  const allureDataArray = [];
  for (let i = 0; i < arrayData.length; i++) {
    if (arrayData[i].name.includes('[TC')) {
      const allure = {
        duration: getDuration(arrayData[i]),
        browser: getBrowser(arrayData[i]),
        verdict: getStatus(arrayData[i]),
        testCaseId: getTestCaseId(arrayData[i]),
        build: getBuild(),
        release: getRelease(),
        OS: getOS()
      };
      allureDataArray.push(allure);
    }
  }
  return allureDataArray;
}

/**
 * Gets data from the Allure report for all the test cases found in Allure report
 *
 * @param {Array} tests Array of objects (test results) to be uploaded to Rally
 * @param {String} testVerdict Parameter sent to command line call while running the script to indicate the verdict
 * of the test cases to be uploaded
 * @returns {Array} Array of objects (test results) with specified verdict containing data that will be uploaded to Rally
 */
function getTestsWithVerdict(tests, testVerdict = 'pass') {
  if (testVerdict === 'all') {
    return tests;
  }
  return tests.filter(test => test.verdict === (testVerdict.charAt(0).toUpperCase() + testVerdict.slice(1)));
}

exports.getReportData = getReportData;
exports.getTestsWithVerdict = getTestsWithVerdict;
