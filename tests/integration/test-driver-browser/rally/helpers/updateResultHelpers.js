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
    headers: { zsessionid: rallyConfig.rallyApiKey, },
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
  if (passedTestCases.length === 0 && failedTestCases.length === 0 && lowPassTestCases.length === 0) {
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
      const batchParameters = await getManualBatchParameters(testCaseArray[i])
      const batchItem = createBatchItem({date: today, ...batchParameters});
      batch.push(batchItem);
      }
    return { Batch: batch };
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

/**
 * Gets data from rallyConfig and Rally API for a given Test Case executed manually that will be added to a batch array 
 * that will be uploaded to Rally as a Test Case result
 *
 * @param {object} testCaseResult Object containing testCaseId and verdict
 * @returns {object} containing data that will be added to batch array that will be uploaded to Rally
 */
async function getManualBatchParameters(testCaseResult) {
  const { verdict } = testCaseResult;

  let testerUrl = '';
  if (rallyConfig.email !== '') {
    testerUrl = await getDataHelper.getTesterUrl(rallyConfig.email);
  } else {
    throw Error('Add your email to rallyconfig.js');
  }

  const tcUrl = await getDataHelper.getRallyTCUrl(testCaseResult.testCaseId);
  const testCase = tcUrl.split('v2.0')[1];

  let testSet = '';
  if (rallyConfig.manual.testSet !== '') {
    testSet = await getDataHelper.getTestSet(rallyConfig.manual.testSet);
  }

  const { build, duration, notes, browser, release, env, exportApp, OS, language } = rallyConfig.manual;
  return { testerUrl, testCase, verdict, testSet, build, duration, notes, browser, release, env, exportApp, OS, language }
}

/**
 * Update Rally Test Cases results from automation using the retrieved Test Case URL and the corresponding test results
 *
 * @param {Array} testCaseArray Array of objects (test results) to be uploaded to Rally
 * @returns {Array} Array of JS objects containing test results parsed to the format that can be uploaded to Rally
 */
async function createAutomatedBatchArray(testCaseArray) {
  const batch= [];
  let testSet = '';
  let testCasesUrlList = [];
  // If there is a TS added in rallyConfig, retrieve URLs to the TCs under this TS
  if (rallyConfig.automation.testSet !== '') {
    testSet = await getDataHelper.getTestSet(rallyConfig.automation.testSet);
    const testCasesList = await getDataHelper.getTCListFromTestSet(testSet);

    for (let i = 0; i < testCasesList.length; i++) {
      testCasesUrlList.push(testCasesList[i]._ref);
    }
  }

  try {
    for (let i = 0; i < testCaseArray.length; i++) {
      // Get parameters with which the results will be uploaded to Rally
      const batchParameters = await getAutomatedBatchParameters(testCaseArray[i]);
      const {
        duration, browser, verdict, build, release, testCaseId, OS, notes, exportApp, tcUrl, env, language, testCase, testerUrl
      } = batchParameters;
      // If there is a TS added in rallyConfig, check if the TC belongs to this TS
      if (rallyConfig.automation.testSet !== '') {
        if (testCasesUrlList.filter(testCaseUrl => testCaseUrl === tcUrl).length !== 0) {
          const batchItem = createBatchItem(
            {build, date: today, testCase, verdict, testerUrl, testSet, duration, notes, browser, env, release, exportApp, OS, language}
            );

          batch.push(batchItem);
          console.log(`${testCaseId} result will be added to Rally.`);
        }
      }
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  return { Batch: batch }
};

/**
 * Gets data from Allure report, rallyConfig and Rally API for a given Test Case executed automatically that will be added to a batch array 
 * that will be uploaded to Rally as a Test Case result
 *
 * @param {object} testCaseResult Object containing data from rallyCConfig and Allure report
 * @returns {object} containing data that will be added to batch array that will be uploaded to Rally
 */
async function getAutomatedBatchParameters(testCaseResult) {
  const { env, language } = rallyConfig.automation;

  const {
    duration, browser, verdict, build, release, testCaseId, OS, notes, exportApp
  } = testCaseResult;


  const tcUrl = await getDataHelper.getRallyTCUrl(testCaseId);
  const testCase = tcUrl.split('v2.0')[1];

  const testerUrl = await getDataHelper.getOwner(testCaseId);

  return { duration, browser, verdict, build, release, testCaseId, OS, notes, exportApp, tcUrl, env, language, testCase, testerUrl }
}

/**
 * Creates batch item
 *
 * @param {Object} Object containing data that will be added to Body of the request sent to upload results to Rally
 * @returns {Object} batch item
 */
function createBatchItem({ build, date, testCase, verdict, testerUrl, testSet, duration, notes, browser, env, release, exportApp, OS, language }) {
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
          Tester: testerUrl,
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