const getDataFromRally = require('./getDataFromRally');
const rallyConfig = require('./rallyconfig');

/**
 * Returns Test Set endpoint using Formatted Test Set ID (e.g. 'TS23156')
 *
 * @param {String} testSetId Formatted Test Set ID (e.g. 'TS23156')
 * @returns {String} URL to the Test Set endpoint
 */
async function getTestSet(testSetId) {
  if (testSetId !== '') {
    const formattedIDUrl = `${rallyConfig.apiUrl}/testset/?query=(FormattedID%20%3D%20"${testSetId}")`;
    try {
      const testSetUrl = await getDataFromRally(formattedIDUrl);
      return testSetUrl.QueryResult.Results[0]._ref;
    } catch (error) {
      console.log(`Couldn't upload ${testSetId} as TestSet`);
    }
  }
}

/**
 * Returns Test Case owner endpoint using Formatted Test Case ID (e.g. 'TC12567')
 *
 * @param {String} testCaseId Formatted Test Case ID (e.g. 'TC12567')
 * @returns {String} URL to the Test Case endpoint
 */
async function getOwner(testCaseId) {
  const tcUrl = await getRallyTCUrl(testCaseId);
  try {
    const tcDetails = await getDataFromRally(tcUrl);
    return tcDetails.TestCase.Owner._ref;
  } catch (error) {
    console.log(`Couldn't get ${testCaseId} owner`);
  }
}

/**
 * Returns Tester endpoint using tester email (e.g. 'stasiu@microstrategy.com')
 *
 * @param {String} testerEmail Tester email (e.g. 'stasiu@microstrategy.com')
 * @returns {String} URL to tester endpoint
 */
async function getTesterUrl(testerEmail) {
  if (testerEmail !== '') {
    const emailUrl = `${rallyConfig.apiUrl}/user/?query=(EmailAddress%20%3D%20"${testerEmail}")`;
    try {
      const testerUrl = await getDataFromRally(emailUrl);
      return testerUrl.QueryResult.Results[0]._ref;
    } catch (error) {
      console.log(`Couldn't upload ${testerEmail} as tester`);
    }
  } else {
    console.log('Add your email to rallyconfig.js');
  }
}

/**
 * Returns Test Case endpoint using Formatted Test Case ID (e.g. 'TC12567')
 *
 * @param {String} formattedID Formatted Test Case ID (e.g. 'TC12567')
 * @returns {String} URL to Test Case endpoint
 */
async function getRallyTCUrl(formattedID) {
  const formattedIDUrl = `${rallyConfig.apiUrl}/testcase/?query=(FormattedID%20%3D%20%22${formattedID}%22)`;
  try {
    const tcUrl = await getDataFromRally(formattedIDUrl);
    return tcUrl.QueryResult.Results[0]._ref;
  } catch (error) {
    console.log(`Couldn't get ${formattedID} URL`);
  }
}

/**
 * Returns Test Case details from Rally using Formatted Test Case ID (e.g. 'TC12567')
 *
 * @param {String} formattedID Formatted Test Case ID (e.g. 'TC12567')
 * @returns {Object} Object contatining Test Case details
 */
async function getTCDetailsFromRally(formattedID) {
  const tcUrl = await getRallyTCUrl(formattedID);
  try {
    const tcDetails = await getDataFromRally(tcUrl);
    return tcDetails;
  } catch (error) {
    console.log(`Couldn't get ${formattedID} details`);
  }
}


exports.getTestSet = getTestSet;
exports.getTesterUrl = getTesterUrl;
exports.getRallyTCUrl = getRallyTCUrl;
exports.getOwner = getOwner;
