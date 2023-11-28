class OfficeInsertSplitHelper {
  /**
   * Return Excel Rows that will be added to table if needed rows will be splitted into chunks that meets limit of 5MB
   *
   * @param {Array} excelRows Array of table data
   * @param {Boolean} isOverLimit Specify if the passed Excel rows are over 5MB limit
   * @returns {Array} Array with sub-arrays with size not more than 5MB
   */
  getExcelRows(excelRows, isOverLimit) {
    let splitExcelRows = [excelRows];
    if (isOverLimit) { splitExcelRows = this.splitExcelRows(excelRows); }
    return splitExcelRows;
  }

  /**
   * Split Excel Rows into chunks that meets limit of 5MB
   *
   * @param {Array} excelRows Array of table data
   * @returns {Array} Array with sub-arrays with size not more than 5MB
   */
  splitExcelRows = (excelRows) => {
    let splitRows = [excelRows];
    let isFitSize = false;
    console.time('Split Rows');
    do {
      const tempSplit = [];
      let changed = false;
      for (const row of splitRows) {
        // 5 MB is a limit for excel
        if (this.checkIfSizeOverLimit(row)) {
          const { length } = row;
          tempSplit.push(row.slice(0, length / 2));
          tempSplit.push(row.slice(length / 2, length));
          changed = true;
        } else {
          tempSplit.push(row);
        }
      }
      splitRows = [...tempSplit];
      if (!changed) { isFitSize = true; }
    } while (!isFitSize);
    console.timeEnd('Split Rows');
    return splitRows;
  };

  /**
   * Check size of passed object in MB
   *
   * @param {Object} object Item to check size of
   * @returns {Boolean} information whether the size of passed object is bigger than 5MB
   */
  checkIfSizeOverLimit = (chunk) => {
    let bytes = 0;
    for (let i = 0; i < chunk.length; i++) {
      for (let j = 0; j < chunk[0].length; j++) {
        if (typeof chunk[i][j] === 'string') {
          bytes += chunk[i][j].length * 2;
        } else if (typeof chunk[i][j] === 'number') {
          bytes += 8;
        } else {
          bytes += 2;
        }
        if (bytes / 1000000 > 5) { return true; } // we return true when the size is bigger than 5MB
      }
    }
    return false;
  };
}

const officeInsertSplitHelper = new OfficeInsertSplitHelper();
export default officeInsertSplitHelper;
