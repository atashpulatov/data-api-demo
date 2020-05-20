/* eslint-disable camelcase */
const helpers = require('../helpers');
const rallyConfig = require('../rallyconfig');

const today = new Date();

/** Update Rally Test Cases results from automation using the retrieved Test Case URL and the corresponding test results
 *
 * @param {Array} testCaseArray Array of objects (test results) to be uploaded to Rally
 * @returns {Array} Array of JS objects containing test results parsed to the format that can be uploaded to Rally
 */

module.exports = async function createBatchArray(testCaseArray) {
  const batch = [];
  for (let i = 0; i < testCaseArray.length; i++) {
    const {
      duration, browser, verdict, build, release, testCaseId, OS
    } = testCaseArray[i];

    try {
      const tcUrl = await helpers.getRallyTCUrl(testCaseId);
      const owner = await helpers.getOwner(testCaseId);
      let testSet = '';
      if (rallyConfig.automation.testSet !== '') {
        testSet = await helpers.getTestSet();
      }

      const batchItem = {
        Entry: {
          Path: '/testcaseresult/create',
          Method: 'POST',
          Body: {
            testcaseresult: {
              Build: build,
              Date: today,
              Testcase: tcUrl.split('v2.0')[1],
              Verdict: verdict,
              Tester: owner,
              TestSet: testSet, // for release validation add TS ID
              Duration: duration,
              Notes: rallyConfig.automation.notes, // for release validation change to 'Release validation'
              c_Browsertype: browser,
              c_Environment: rallyConfig.automation.env,
              c_ProductionRelease: release,
              c_ExportApplication: rallyConfig.automation.exportApp,
              c_ClientOS: OS,
              c_Language: rallyConfig.automation.language
            }
          }
        }
      };
      batch.push(batchItem);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
  return { Batch: batch };
};
