const allureReport = './allure-report/data/behaviors.json';
const path = require('path');
const fs = require('fs');
const rallyconfig = require('../rallyconfig');

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
  const re = /\[(TC\d+)\]/;
  const testName = testCase.name;
  const testId = testName.split(re)[1];
  return testId;
}

/**
 * Gets Test Case status from Allure report and parses it into Rally verdict
 *
 * @param {Object} testCase Object representing one test case from Allure report
 * @returns {String} Test Case verdict
 */
function getStatus(testCase) {
  let verdict = '';
  const { status } = testCase;
  switch (status) {
    case 'failed': verdict = 'Fail';
      break;
    case 'passed': verdict = 'Pass';
      break;
  }
  return verdict;
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
  let browser = '';
  if (parameters.includes('chrome')) {
    browser = 'Chrome';
  }
  return browser;
}

/**
 * Returns build in which the Test Case was executed
 *
 * @returns {String} Build number
 */
function getBuild() {
  let build;
  if (!cmd[2] || cmd[2] === 'pass' || cmd[2] === 'fail' || cmd[2] === 'all') {
    build = rallyconfig.automation.build;
  } else {
    build = cmd[3];
  }
  return build;
}

/**
 * Returns release in which the Test Case was executed
 *
 * @returns {String} Release
 */
function getRelease() {
  let release;
  if (!cmd[3] || cmd[3] === 'pass' || cmd[3] === 'fail' || cmd[3] === 'all') {
    release = rallyconfig.automation.release;
  } else {
    release = cmd[4];
  }
  return release;
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
function getTestsWithVerdict(tests, testVerdict) {
  if (testVerdict === 'all') {
    return tests;
  }
  if (testVerdict === 'fail') {
    return tests.filter(test => test.verdict === 'Fail');
  }
  return tests.filter(test => test.verdict === 'Pass');
}

exports.getReportData = getReportData;
exports.getTestsWithVerdict = getTestsWithVerdict;
