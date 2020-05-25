/* eslint-disable no-underscore-dangle */
const getDataFromRally = require('./getDataFromRally');
const rallyConfig = require('./rallyconfig');

/**
* Returns Test Set endpoint using Formatted Test Set ID (e.g. 'TS23156')
*
* @param {String} testSetId Formatted Test Set ID (e.g. 'TS23156')
* @returns {String} URL to the Test Set endpoint
*/
function getTestSet(testSetId) {
  const formattedIDUrl = `${rallyConfig.apiUrl}/testset/?query=(FormattedID%20%3D%20"${testSetId}")`;
  return getDataFromRally(formattedIDUrl)
    .then(({ QueryResult }) => QueryResult.Results[0]._ref)
    .catch(() => { throw Error(`Couldn't upload ${testSetId} as TestSet`); });
}

/**
* Returns Test Case owner endpoint using Formatted Test Case ID (e.g. 'TC12567')
*
* @param {String} testCaseId Formatted Test Case ID (e.g. 'TC12567')
* @returns {String} URL to the Test Case endpoint
*/
function getOwner(testCaseId) {
  return getRallyTCUrl(testCaseId)
    .then(tcUrl => getDataFromRally(tcUrl).then(({ TestCase }) => TestCase.Owner._ref))
    .catch(() => { throw Error(`Couldn't get ${testCaseId} owner`); });
}

/**
* Returns Tester endpoint using tester email (e.g. 'stasiu@microstrategy.com')
*
* @param {String} testerEmail Tester email (e.g. 'stasiu@microstrategy.com')
* @returns {String} URL to tester endpoint
*/
function getTesterUrl(testerEmail) {
  const emailUrl = `${rallyConfig.apiUrl}/user/?query=(EmailAddress%20%3D%20"${testerEmail}")`;
  return getDataFromRally(emailUrl)
    .then(({ QueryResult }) => QueryResult.Results[0]._ref)
    .catch(() => { throw Error(`Couldn't add ${testerEmail} as tester`); });
}

/**
* Returns Test Case endpoint using Formatted Test Case ID (e.g. 'TC12567')
*
* @param {String} formattedID Formatted Test Case ID (e.g. 'TC12567')
* @returns {String} URL to Test Case endpoint
*/
function getRallyTCUrl(formattedID) {
  const formattedIDUrl = `${rallyConfig.apiUrl}/testcase/?query=(FormattedID%20%3D%20%22${formattedID}%22)`;
  return getDataFromRally(formattedIDUrl)
    .then(({ QueryResult }) => QueryResult.Results[0]._ref)
    .catch(() => { throw Error(`Couldn't get ${formattedID} URL`); });
}

/**
* Returns Test Case details from Rally using Formatted Test Case ID (e.g. 'TC12567')
*
* @param {String} formattedID Formatted Test Case ID (e.g. 'TC12567')
* @returns {Object} Object contatining Test Case details
*/
async function getTCDetailsFromRally(formattedID) {
  return getRallyTCUrl(formattedID)
    .then(tcUrl => getDataFromRally(tcUrl))
    .catch(() => { throw Error(`Couldn't get ${formattedID} details`); });
}

exports.getTestSet = getTestSet;
exports.getTesterUrl = getTesterUrl;
exports.getRallyTCUrl = getRallyTCUrl;
exports.getOwner = getOwner;
