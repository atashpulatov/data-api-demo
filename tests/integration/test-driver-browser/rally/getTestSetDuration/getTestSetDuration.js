const getDataHelper = require('../helpers/getDataHelpers');

/**
* Get Test Set duration of the Test Set which ID is passed as a parameter
*
* @param {String} testSetId Formatted Test Set ID (e.g. 'TS32506')
* @returns {Integer} Sum of duration of all Test Cases under the Test Set
*/
module.exports = async function getDuration(testSetId) {
  try {
    // URL to the Test Set
    const testSetUrl = await getDataHelper.getTestSet(testSetId);
    const testSetID = testSetUrl.split('/')[7];
    // List of Test Cases under the Test Set
    const testCasesList = await getDataHelper.getTCListFromTestSet(testSetUrl)
    // List of URLs to results of Test Cases from testCasesList
    const listOfUrlsToTCResults = [];
    // List of IDs to Test Cases under the Test Set
    const testCasesIdList = [];

    for (let i = 0; i < testCasesList.length; i++) {
      listOfUrlsToTCResults.push(testCasesList[i].Results._ref);
      testCasesIdList.push(testCasesList[i].ObjectID);
    }

    // Array of objects containing results to all Test Cases under the Test Set
    const resultsArray = [];
    let duration = 0;

    for (let i = 0; i < listOfUrlsToTCResults.length; i++) {
      const { QueryResult } = await getDataHelper.getDataFromRally(listOfUrlsToTCResults[i]);
      const results = QueryResult.Results;
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
    process.exit(1);
  }
};
