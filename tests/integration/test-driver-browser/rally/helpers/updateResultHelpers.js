const rallyConfig = require('../rallyconfig');
const getResultsFromAllure = require('./getResultsFromAllureFunctions');
const fetch = require('node-fetch');
const strings = require('../constants/strings');
const getDataHelper = require('./getDataHelpers');

const today = new Date();

/**
 * Upload Test Case results to Rally
 *
 * @returns {Promise} Promise to be resolved when the Test Case result is uploaded
 */
async function updateRallyTCResult(batch) {
  const options = {
    method: 'POST',
    headers: { sessionid: rallyConfig.rallyApiKey, },
    body: JSON.stringify(batch)
  };

  return fetch(strings.batchURL, options)
    .then(result => result.json());
}
/**
 * Upload Test Case results from manual execution to Rally
 *
 * @returns {Promise} Promise to be resolved when the Test Case result is uploaded
 */
async function getManualBatchArray() {
  const { passedTestCases, failedTestCases, lowPassTestCases } = rallyConfig.manual;
  if (passedTestCases.length === 0 && failedTestCases.length === 0) {
    console.log('Add the Test Cases for which you want to upload the results in rallyconfig.js');
    process.exit(1);
  }
  const passedTestCasesId = mapTCtoBatchObject(passedTestCases, 'Pass');
  const failedTestCasesId = mapTCtoBatchObject(failedTestCases, 'Fail');
  const lowPassTestCasesId = mapTCtoBatchObject(lowPassTestCases, 'Low pass');
  const batch = await createManualBatchArray([...failedTestCasesId, ...passedTestCasesId, ...lowPassTestCasesId]);
  return batch;
}

/**
 * Upload Test Case results from automated execution to Rally
 *
 * @returns {Promise} Promise to be resolved when the Test Case result is uploaded
 */
async function getAutomatedBatchArray() {
  const allTests = getResultsFromAllure.getReportData();
  if (allTests.length === 0) {
    console.log('No test results found in Allure report.');
    process.exit(1);
  }

  const testsToUpdate = getResultsFromAllure.getTestsWithVerdict(allTests);
  const batch = await createAutomatedBatchArray(testsToUpdate);
  return batch;
}

/** Map array containing test case IDs to Batch object that can be uploaded to Rally with specified verdict
 *
 * @param {Array} testArray Array of test case IDs of the Test Cases results to be uploaded to Rally
 * @param {String} verdict Verdict of the test cases
 * @returns {Array} Array of JS objects containing Test Case IDs and verdict
 */
function mapTCtoBatchObject(testArray, verdict) {
  return testArray.map(testCaseId => ({ testCaseId, verdict }));
}

/** Update Rally Test Cases results from manual testing using the retrieved Test Case URL and the corresponding test results
 *
 * @param {Array} testCaseArray Array of objects (test results) to be uploaded to Rally
 * @returns {Array} Array of JS objects containing test results parsed to the format that can be uploaded to Rally
 */
async function createManualBatchArray(testCaseArray) {
  const batch = [];
  try {
    for (let i = 0; i < testCaseArray.length; i++) {
      let testerUrl = '';
      if (rallyConfig.email !== '') {
        testerUrl = await getDataHelper.getTesterUrl(rallyConfig.email);
      } else {
        throw Error('Add your email to rallyconfig.js');
      }
      const tcUrl = await getDataHelper.getRallyTCUrl(testCaseArray[i].testCaseId);
      const testCase = tcUrl.split('v2.0')[1];
      const { verdict } = testCaseArray[i];
      let testSet = '';
      if (rallyConfig.manual.testSet !== '') {
        testSet = await getDataHelper.getTestSet(rallyConfig.manual.testSet);
      }
      const { build, duration, notes, browser, release, env, exportApp, OS, language } = rallyConfig.manual;

      const batchItem = createBatchItem({build, date: today, testCase, verdict, tester: testerUrl, testSet, duration, notes, browser, env, release, exportApp, OS, language});
      batch.push(batchItem);
    }
    return { Batch: batch };
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

/**
 * Update Rally Test Cases results from automation using the retrieved Test Case URL and the corresponding test results
 *
 * @param {Array} testCaseArray Array of objects (test results) to be uploaded to Rally
 * @returns {Array} Array of JS objects containing test results parsed to the format that can be uploaded to Rally
 */

async function createAutomatedBatchArray(testCaseArray) {
  const batch = [];
  try {
    for (let i = 0; i < testCaseArray.length; i++) {
      const {
        duration, browser, verdict, build, release, testCaseId, OS, notes, exportApp
      } = testCaseArray[i];
      const { env, language } = rallyConfig.automation;
      const tcUrl = await getDataHelper.getRallyTCUrl(testCaseId);
      const testCase = tcUrl.split('v2.0')[1];

      const owner = await getDataHelper.getOwner(testCaseId);
      let testSet = '';
      if (rallyConfig.automation.testSet !== '') {
        testSet = await getDataHelper.getTestSet(rallyConfig.automation.testSet);
      }
      const batchItem = createBatchItem({build, date: today, testCase, verdict, tester: owner, testSet, duration, notes, browser, env, release, exportApp, OS, language})
      batch.push(batchItem);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  return { Batch: batch };
};

/**
 * Creates batch item
 *
 * @param {Array} testCaseArray Array of objects (test results) to be uploaded to Rally
 * @returns {Object} batch item
 */

function createBatchItem({build, date, testCase, verdict, tester, testSet, duration, notes, browser, env, release, exportApp, OS, language}) {
  return {
    Entry: {
      Path: '/testcaseresult/create',
      Method: 'POST',
      Body: {
        testcaseresult: {
          Build: build,
          Date: date,
          Testcase: testCase,
          Verdict: verdict,
          Tester: tester,
          TestSet: testSet,
          Duration: duration,
          Notes: notes,
          c_Browsertype: browser,
          c_Environment: env,
          c_ProductionRelease: release,
          c_ExportApplication: exportApp,
          c_ClientOS: OS,
          c_Language: language
        }
      }
    }
  };
}

module.exports = {
  getManualBatchArray: getManualBatchArray,
  getAutomatedBatchArray: getAutomatedBatchArray,
  updateRallyTCResult: updateRallyTCResult

}