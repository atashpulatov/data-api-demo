const fetch = require('node-fetch');
const rallyConfig = require('../rallyconfig');
const createManualBatchArray = require('./createManualBatchArray');
const strings = require('../strings');

/** Map array containing test case IDs to Batch object that can be uploaded to Rally with specified verdict
 *
 * @param {Array} testArray Array of test case IDs of the Test Cases results to be uploaded to Rally
 * @param {String} verdict Verdict of the test cases
 * @returns {Array} Array of JS objects containing Test Case IDs and verdict
 */
function mapTCtoBatchObject(testArray, verdict) {
  return testArray.map(testCaseId => ({ testCaseId, verdict }));
}

/** Update Rally Test Case result from manual execution using the retrieved Test Case URL
 *
 * @returns {Promise} Promise that will be resolved when the results are uploaded to Rally
 */
async function updateRallyTCResult() {
  const { passedTestCases, failedTestCases } = rallyConfig.manual;
  if (passedTestCases.length === 0 && failedTestCases.length === 0) {
    console.log('Add the Test Cases for which you want to upload the results in rallyconfig.js');
    process.exit(1);
  }
  const passedTestCasesId = mapTCtoBatchObject(passedTestCases, 'Pass');
  const failedTestCasesId = mapTCtoBatchObject(failedTestCases, 'Fail');
  const batch = await createManualBatchArray([...failedTestCasesId, ...passedTestCasesId]);

  const options = {
    method: 'POST',
    headers: { zsessionid: rallyConfig.rallyApiKey, },
    body: JSON.stringify(batch)
  };

  return fetch(strings.batchURL, options)
    .then(result => result.json());
}

updateRallyTCResult()
  .then((result) => {
    const { Errors: errors } = result.BatchResult;
    if (errors.length > 0) { throw new Error(errors); }
    console.log('Rally request completed');
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
