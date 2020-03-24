class GetOfficeTableHelper {
  /**
   * Checks if the report changes to or from crosstab.
   *
   * @param {Object} mstrTable contains information about mstr object
   *
   */
  checkReportTypeChange = (mstrTable) => {
    const { prevCrosstabDimensions, isCrosstab } = mstrTable;
    mstrTable.toCrosstabChange = !prevCrosstabDimensions && isCrosstab;
    mstrTable.fromCrosstabChange = prevCrosstabDimensions && !isCrosstab;
  };

  /**
   * Creates name for Excel table based on name of MSTR object and time of import.
   * Replaces all not allowed characters in object name with "_".
   * For refresh/edit returns name created during import.
   *
   * @param {Object} mstrTable contains information about mstr object
   * @param {String} [tableName] Table name created for it during import
   *
   * @returns {String} Name for the Excel table
   */
  createTableName = (mstrTable, tableName) => {
    if (tableName) {
      return tableName;
    }
    const excelCompatibleTableName = mstrTable.name.replace(/(\.|•|‼| |!|#|\$|%|&|'|\(|\)|\*|\+|,|-|\/|:|;|<|=|>|@|\^|`|\{|\||\}|~|¢|£|¥|¬|«|»)/g, '_');
    return `_${excelCompatibleTableName.slice(0, 239)}_${Date.now()
      .toString()}`;
  };
}

const getOfficeTableHelper = new GetOfficeTableHelper();
export default getOfficeTableHelper;
