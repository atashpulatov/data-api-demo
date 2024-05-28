import formattingHelper from './formatting-helper';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import officeFormatHyperlinks from './office-format-hyperlinks';

class StepFormatHyperlinks {
  /**
   * Formats columns containing attributes as hyperlinks.
   *
   * This function is subscribed as one of the operation steps with the key FORMAT_HYPERLINKS,
   * therefore should be called only via operation bus.
   *
   * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param operationData.officeTable Reference to Table created by Excel
   * @param operationData.instanceDefinition Object containing information about MSTR object
   * @param operationData.excelContext Reference to Excel Context used by Excel API functions
   */
  formatHyperlinks = async (
    objectData: ObjectData,
    operationData: OperationData
  ): Promise<void> => {
    try {
      const { officeTable, instanceDefinition, excelContext } = operationData;

      const { columns, rows } = instanceDefinition;
      const { columnInformation, isCrosstab, metricsInRows } = instanceDefinition.mstrTable;

      const offset = objectData?.crosstabHeaderDimensions?.rowsX || 0;

      for (let index = 0; index < columnInformation.length; index++) {
        const object = columnInformation[index];

        if (object) {
          const columnRange = formattingHelper.getColumnRangeForFormatting(
            index,
            isCrosstab,
            offset,
            officeTable,
            rows,
            columns,
            metricsInRows
          );
          if (object.isAttribute) {
            await officeFormatHyperlinks.formatColumnAsHyperlinks(
              object,
              columnRange,
              excelContext
            );
          }

          if (index % 5000 === 0) {
            await excelContext.sync();
          }
        }
      }
      operationStepDispatcher.completeFormatHyperlinks(objectData.objectWorkingId);
    } catch (error) {
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    }
  };
}

const stepFormatHyperlinks = new StepFormatHyperlinks();
export default stepFormatHyperlinks;
