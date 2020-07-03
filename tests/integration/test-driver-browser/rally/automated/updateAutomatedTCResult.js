const fetch = require('node-fetch');
const rallyConfig = require('../rallyconfig');
const getResultsFromAllure = require('./getResultsFromAllureFunctions');
const createBatchArray = require('./createAutomatedBatchArray');
const strings = require('../strings');

/**
 * Upload Test Case result to Rally
 *
 * @returns {Promise} Promise to be resolved when the Test Case result is uploaded
 */
async function updateRallyTCResult() {
  const allTests = getResultsFromAllure.getReportData();

  if (allTests.length === 0) {
    console.log('No test results found in Allure report.');
    process.exit(1);
  }
  const cmd = process.argv;
  let testsToUpload = '';

  if (cmd.includes('all')) {
    testsToUpload = 'all';
  } else if (cmd.includes('fail')) {
    testsToUpload = 'fail';
  } else {
    testsToUpload = 'pass';
  }

  const testsToUpdate = getResultsFromAllure.getTestsWithVerdict(allTests, testsToUpload);
  const batch = await createBatchArray(testsToUpdate);

  const options = {
    method: 'POST',
    headers: { zsessionid: rallyConfig.rallyApiKey, },
    body: JSON.stringify(batch)
  };

  return fetch(strings.batchURL, options)
    .then(res => res.json());
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
