class GetOfficeTableHelper {
  /**
   * Checks if the report changes to or from crosstab
   *
   * @param {Object} mstrTable
   *
   */
  checkReportTypeChange = (mstrTable) => {
    const { prevCrosstabDimensions, isCrosstab } = mstrTable;
    mstrTable.toCrosstabChange = !prevCrosstabDimensions && isCrosstab;
    mstrTable.fromCrosstabChange = prevCrosstabDimensions && !isCrosstab;
  };

  /**
   * TODO Do JSDOC in all refatored files
   *
   * @param {Object} instanceDefinition
   *
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

const getOfficeTableHelper = new GetOfficeTableHelper;
export default getOfficeTableHelper;
