/* eslint-disable camelcase */
const helpers = require('../helpers');
const rallyConfig = require('../rallyconfig');

const today = new Date();

/** Update Rally Test Cases results from manual testing using the retrieved Test Case URL and the corresponding test results
 *
 * @param {Array} testCaseArray Array of objects (test results) to be uploaded to Rally
 * @returns {Array} Array of JS objects containing test results parsed to the format that can be uploaded to Rally
 */
module.exports = async function createManualBatchArray(testCaseArray) {
  const batch = [];
  try {
    for (let i = 0; i < testCaseArray.length; i++) {
      let testerUrl = '';
      if (rallyConfig.email !== '') {
        testerUrl = await helpers.getTesterUrl(rallyConfig.email);
      } else {
        throw Error('Add your email to rallyconfig.js');
      }
      const tcUrl = await helpers.getRallyTCUrl(testCaseArray[i].testCaseId);
      const { verdict } = testCaseArray[i];
      let testSet = '';
      if (rallyConfig.manual.testSet !== '') {
        testSet = await helpers.getTestSet(rallyConfig.manual.testSet);
      }

      const batchItem = {
        Entry: {
          Path: '/testcaseresult/create',
          Method: 'POST',
          Body: {
            testcaseresult: {
              Date: today,
              Tester: testerUrl,
              Build: rallyConfig.manual.build,
              TestSet: testSet,
              Testcase: tcUrl.split('v2.0')[1],
              Verdict: verdict,
              Duration: rallyConfig.manual.duration,
              Notes: rallyConfig.manual.notes,
              c_Browsertype: rallyConfig.manual.browser,
              c_ProductionRelease: rallyConfig.manual.release,
              c_Environment: rallyConfig.manual.env,
              c_ExportApplication: rallyConfig.manual.exportApp,
              c_ClientOS: rallyConfig.manual.OS,
              c_Language: rallyConfig.manual.language
            }
          }
        }
      };
      batch.push(batchItem);
    }
    return { Batch: batch };
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
