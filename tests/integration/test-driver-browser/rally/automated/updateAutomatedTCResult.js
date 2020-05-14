const request = require('request');
const rallyConfig = require('../rallyconfig');
const getResultsFromAllure = require('./getResultsFromAllureFunctions');
const createBatchArray = require('./createAutomatedBatchArray');

// add comment how to use it

/**
 * Upload Test Case result to Rally
 *
 * @param {}
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
    url: 'https://rally1.rallydev.com/slm/webservice/v2.0/batch',
    method: 'POST',
    headers: { zsessionid: rallyConfig.rallyApiKey, },
    body: JSON.stringify(batch)
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

updateRallyTCResult()
  .then(result => {
    const jsonResult = JSON.parse(result);
    const { Errors } = jsonResult.BatchResult;
    if (Errors.length > 0) {
      throw new Error(Errors);
    }
    console.log('Rally request completed');
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
