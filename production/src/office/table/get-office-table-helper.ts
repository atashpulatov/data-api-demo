import { MstrTable } from '../../redux-reducer/operation-reducer/operation-reducer-types';

class GetOfficeTableHelper {
  /**
   * Checks if the report changes to or from crosstab.
   *
   * @param mstrTable contains information about mstr object
   *
   */
  checkReportTypeChange(mstrTable: MstrTable): void {
    const { prevCrosstabDimensions, isCrosstab } = mstrTable;

    mstrTable.toCrosstabChange = !prevCrosstabDimensions && isCrosstab;
    mstrTable.fromCrosstabChange = prevCrosstabDimensions && !isCrosstab;
  }

  /**
   * Creates name for Excel table based on name of MSTR object and time of import.
   *
   * Replaces all not allowed characters in object name with "_".
   *
   * For refresh/edit returns name created during import.
   *
   * @param mstrTable contains information about mstr object
   * @param tableName Table name created for it during import
   *
   * @returns Name for the Excel table
   */
  createTableName(mstrTable: any, tableName: string): string {
    if (tableName) {
      return tableName;
    }
    const excelCompatibleTableName = mstrTable.name.replace(
      /(\.|•|‼| |!|#|\$|%|&|'|\(|\)|\*|\+|,|-|\/|:|;|<|=|>|@|\^|`|\{|\||\}|~|¢|£|¥|¬|«|»)/g,
      '_'
    );
    return `_${excelCompatibleTableName.slice(0, 239)}_${Date.now().toString()}`;
  }
}

const getOfficeTableHelper = new GetOfficeTableHelper();
export default getOfficeTableHelper;
