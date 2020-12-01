/* eslint-disable camelcase */
const fetch = require('node-fetch');
const rallyConfig = require('../rallyconfig');
const getTestSetDuration = require('./getTestSetDuration');
const helpers = require('../helpers/getDataHelpers');

/**
* Upload Test Set duration to existing Test Set Rally
*
* @returns {Promise} Promise to be resolved when the Test Case result is uploaded
*/
async function updateMachineTime() {
  const cmd = process.argv;

  if (!cmd[2]) {
    throw new Error('Specify Test Set ID from command line, e.g. npm run add-duration TS3241');
  }
  // Test Set ID passed to cmd
  const testSetId = cmd[2];
  const testSetDuration = await getTestSetDuration(testSetId);
  const testSetUrl = await helpers.getTestSet(testSetId);

  const options = {
    method: 'PUT',
    headers: { zsessionid: rallyConfig.rallyApiKey, },
    body: JSON.stringify({ TestSet: { c_MachineTimeHrs: testSetDuration } })
  };

  return fetch(testSetUrl, options)
    .then(res => res.json());
}

updateMachineTime()
  .then((result) => {
    const { Errors: errors } = result.OperationResult;
    if (errors.length > 0) { throw new Error(errors); }
    console.log('Rally request completed');
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
