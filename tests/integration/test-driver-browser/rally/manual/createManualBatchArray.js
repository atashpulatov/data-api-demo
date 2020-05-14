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

  for (let i = 0; i < testCaseArray.length; i++) {
    const testerUrl = await helpers.getTesterUrl(rallyConfig.manual.email);
    const tcUrl = await helpers.getRallyTCUrl(testCaseArray[i].testCaseId);
    const { verdict } = testCaseArray[i];
    const testSet = await helpers.getTestSet(rallyConfig.manual.testSet);

    const batchItem = {
      Entry: {
        Path: '/testcaseresult/create',
        Method: 'POST',
        Body: {
          testcaseresult: {
            Date: today,
            Tester: testerUrl,
            Build: rallyConfig.build,
            TestSet: testSet,
            Testcase: tcUrl.split('v2.0')[1],
            Verdict: verdict,
            Duration: '',
            // 'Notes': notes,
            c_Browsertype: '',
            c_ProductionRelease: rallyConfig.release,
            c_Environment: '',
            // 'c_ExportApplication': exportApp,
            // 'c_ClientOS': clientOS,
            // 'c_Language': language
          }
        }
      }
    };
    batch.push(batchItem);
  }
  return { Batch: batch };
};
