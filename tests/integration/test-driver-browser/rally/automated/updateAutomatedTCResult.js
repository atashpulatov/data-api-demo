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
    .then(res => res.json())
    .catch(error => console.log(error));
}

updateRallyTCResult()
  .then((result) => {
    const { Errors } = result.BatchResult;
    if (Errors.length > 0) { throw new Error(Errors); }
    console.log('Rally request completed');
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
