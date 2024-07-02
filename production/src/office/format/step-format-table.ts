import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import officeApiDataLoader from '../api/office-api-data-loader';
import { ObjectImportType } from '../../mstr-object/constants';

const AUTOFIT_COLUMN_LIMIT = 50;

class StepFormatTable {
  /**
   * Auto resizes the columns of the Office table passed in parameters.
   *
   * Columns are resized and synchronized with Excel for each column separately.
   * In case of error this step is skipped and import/refresh workflow continues.
   *
   * This function is subscribed as one of the operation steps with key the FORMAT_OFFICE_TABLE,
   * therefore should be called only via operation bus.
   *
   * @param operationData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param operationData.officeTable Reference to Table created by Excel
   * @param operationData.instanceDefinition Object containing information about MSTR object
   * @param operationData.excelContext Reference to Excel Context used by Excel API functions
   * @param operationData.shouldFormat Determines if the table should be format
   */
  formatTable = async (_objectData: ObjectData, operationData: OperationData): Promise<void> => {
    console.time('Column auto size');
    const { objectWorkingId, excelContext, instanceDefinition, officeTable, shouldFormat } =
      operationData;
    const { crosstabHeaderDimensions, isCrosstab } = instanceDefinition.mstrTable;
    const { columns } = instanceDefinition;

    if (shouldFormat) {
      if (columns < AUTOFIT_COLUMN_LIMIT) {
        try {
          if (_objectData.importType !== ObjectImportType.FORMATTED_DATA) {
            this.formatCrosstabHeaders(officeTable, isCrosstab, crosstabHeaderDimensions.rowsX);
          }

          await this.formatColumns(excelContext, officeTable.columns);

          await excelContext.sync();
        } catch (error) {
          console.error(error);
          console.error('Error when formatting - no columns autofit applied', error);
        }
      } else {
        console.warn(
          'The column count is more than columns autofit limit or should not format - no columns autofit applied.'
        );
      }
    }

    operationStepDispatcher.completeFormatOfficeTable(objectWorkingId);

    console.timeEnd('Column auto size');
  };

  /**
   * Calls autofit function from Excel API for range containing all column that are part of row crosstab headers
   * and hides Excel table headers.
   *
   * @param officeTable Reference to Table created by Excel
   * @param isCrosstab Indicates if it's a crosstab
   * @param rowsX Number of columns in crosstab row headers
   */
  formatCrosstabHeaders = (officeTable: Excel.Table, isCrosstab: boolean, rowsX: number): void => {
    if (isCrosstab) {
      officeTable.getDataBodyRange().getColumnsBefore(rowsX).format.autofitColumns();

      officeTable.showHeaders = false;
    }
  };

  /**
   * Calls formatSingleColumn function for each column in passed column collection.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param columns Reference to Excel columns collection
   */
  formatColumns = async (
    excelContext: Excel.RequestContext,
    columns: Excel.TableColumnCollection
  ): Promise<void> => {
    const columnsCount = await officeApiDataLoader.loadSingleExcelData(
      excelContext,
      columns,
      'count'
    );

    for (let i = 0; i < columnsCount; i++) {
      await this.formatSingleColumn(excelContext, columns.getItemAt(i));
    }
  };

  /**
   * Calls autofit function from Excel API for passed column.
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   * @param column Reference to Excel column
   */
  async formatSingleColumn(
    excelContext: Excel.RequestContext,
    column: Excel.TableColumn
  ): Promise<void> {
    column.getRange().format.autofitColumns();

    await excelContext.sync();
  }
}

const stepFormatTable = new StepFormatTable();
export default stepFormatTable;
