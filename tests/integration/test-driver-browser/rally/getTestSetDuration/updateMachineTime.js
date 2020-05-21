/* eslint-disable camelcase */
const fetch = require('node-fetch');
const rallyConfig = require('../rallyconfig');
const getTestSetDuration = require('./getTestSetDuration');
const helpers = require('../helpers');

/**
 * Upload Test Set duration to existing Test Set Rally
 *
 * @returns {Promise} Promise to be resolved when the Test Case result is uploaded
 */
async function updateMachineTime() {
  const cmd = process.argv;

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
    const { Errors } = result.OperationResult;
    if (Errors.length > 0) { throw new Error(Errors); }
    console.log('Rally request completed');
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
