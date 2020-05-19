/* eslint-disable no-underscore-dangle */
const helpers = require('../helpers');
const getDataFromRally = require('../getDataFromRally');
const rallyConfig = require('../rallyconfig');

/**
 * Get Test Set duration of the Test Set which ID is passed as a parameter
 *
 * @param {String} testSetId Formatted Test Set ID (e.g. 'TS32506')
 * @returns {Integer} Sum of duration of all Test Cases under the Test Set
 */
module.exports = async function getDuration(testSetId) {
  try {
    // URL to the Test Set
    const testSetUrl = await helpers.getTestSet(testSetId);
    const testSetID = testSetUrl.split('/')[7];

    // URL to list of Test Cases under the Test Set
    const testCasesUrl = await getDataFromRally(testSetUrl).then(({ TestSet }) => TestSet.TestCases._ref)
      .catch(() => { throw Error(`Couldn't find ${testSetUrl}`); });

    // URL with result page size extended to 1000
    const tCUrlWithPageSize = testCasesUrl.concat('?pagesize=1000');

    // List of Test Cases under the Test Set
    const testCasesList = await getDataFromRally(tCUrlWithPageSize).then(({ QueryResult }) => QueryResult.Results)
      .catch(() => { throw Error(`Couldn't find ${testSetUrl}`); });

    // List of URLs to results of Test Cases from testCasesList
    const listOfUrlsToTCResults = [];

    // List of IDs to Test Cases under the Test Set
    const testCasesIdList = [];

    for (let i = 0; i < testCasesList.length; i++) {
      listOfUrlsToTCResults.push(testCasesList[i].Results._ref);
    }
    for (let i = 0; i < testCasesList.length; i++) {
      testCasesIdList.push(testCasesList[i].ObjectID);
    }

    // Array of objects containing results to all Test Cases under the Test Set
    const resultsArray = [];
    let duration = 0;

    for (let i = 0; i < listOfUrlsToTCResults.length; i++) {
      const results = await getDataFromRally(listOfUrlsToTCResults[i]).then(({ QueryResult }) => QueryResult.Results)
        .catch(() => { throw Error(`Couldn't find ${testSetUrl}`); });
      resultsArray.push(results);
      for (let j = 0; j < results.length; j++) {
        if (resultsArray[i][j].TestSet !== null) {
          if ((resultsArray[i][j].TestSet._ref).split('/')[7] === testSetID && resultsArray[i][j].Duration !== null) {
            duration += resultsArray[i][j].Duration;
          }
        }
      }
    }
    // return duration in hours
    return duration / 3600;
  } catch (e) {
    console.log(e);
  }
};
