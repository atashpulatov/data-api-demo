const updateResultHelpers = require('./helpers/updateResultHelpers');
const { getManualBatchArray, updateRallyTCResult } = updateResultHelpers;

getManualBatchArray().then(batch => {
    updateRallyTCResult(batch)
      .then((result) => {
        const { Errors: errors } = result.BatchResult;
        if (errors.length > 0) { throw new Error(errors); }
        console.log('Rally request completed');
        process.exit(0);
      })
      .catch(error => {
        console.error(error);
        process.exit(1);
      })
  });
