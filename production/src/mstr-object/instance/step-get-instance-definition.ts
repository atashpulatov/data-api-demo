import { authenticationHelper } from '../../authentication/authentication-helper';
import { officeApiCrosstabHelper } from '../../office/api/office-api-crosstab-helper';
import { officeApiHelper } from '../../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../../office/api/office-api-worksheet-helper';
import { pageByHelper } from '../../page-by/page-by-helper';
import { mstrObjectRestService } from '../mstr-object-rest-service';
import instanceDefinitionHelper from './instance-definition-helper';

import {
  InstanceDefinition,
  OperationData,
} from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData, SubtotalsInfo } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { OperationSteps } from '../../operation/operation-steps';
import { OperationTypes } from '../../operation/operation-type-names';
import mstrObjectEnum from '../mstr-object-type-enum';
import dossierInstanceDefinition from './dossier-instance-definition';
import { ErrorMessages } from '../../error/constants';
import { ImportOperationStepDict, ObjectImportType, objectTableImportType } from '../constants';

class StepGetInstanceDefinition {
  /**
   * Creates Instance definition object which contains data about MSTR object needed in next steps.
   *
   * If instance of an object does not exist, new one will be created.
   * All additional manipulations like prompts answers or body will be applied.
   *
   * This function is subscribed as one of the operation steps with the key GET_INSTANCE_DEFINITION,
   * therefore should be called only via operation bus.
   *
   * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param objectData.displayAttrFormNames The style in which attribute form will be displayed
   * @param objectData.insertNewWorksheet Determines if the object will be displayed in a new spreadsheet
   * @param objectData.subtotalsInfo Determines if subtotals will be displayed and stores subtotal addresses
   * @param objectData.bindId Unique Id of the Office table used for referencing the table in Excel
   * @param objectData.visualizationInfo Contains information about location of visualization in dossier
   * @param operationData.stepsQueue Queue of steps in current operation
   */
  getInstanceDefinition = async (
    objectData: ObjectData,
    operationData: OperationData
  ): Promise<void> => {
    console.group('Getting Instance definition');
    console.time('Total');

    try {
      const futureStep = operationData.stepsQueue[2];

      const {
        objectWorkingId,
        insertNewWorksheet,
        crosstabHeaderDimensions,
        subtotalsInfo = false,
        bindId,
        mstrObjectType,
        isPrompted,
        definition,
        importType,
        details,
      } = objectData;
      let { visualizationInfo, body, name, pageByData } = objectData;
      const { preparedInstanceDefinition, operationType } = operationData;

      const excelContext = await officeApiHelper.getExcelContext();

      let instanceDefinition = preparedInstanceDefinition;
      let shouldRenameExcelWorksheet = false;
      let viewFilterText = '';

      if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
        ({ body, visualizationInfo, instanceDefinition, viewFilterText } =
          await dossierInstanceDefinition.getDossierInstanceDefinition({
            ...objectData,
            visualizationInfo,
          }));

        name = dossierInstanceDefinition.getVisualizationName(
          operationData,
          name,
          instanceDefinition
        );
      } else if (!instanceDefinition) {
        body = instanceDefinitionHelper.setupBodyTemplate(body);
        viewFilterText = '-';
        instanceDefinition = await mstrObjectRestService.createInstance(objectData);
      }

      if (!preparedInstanceDefinition) {
        // @ts-expect-error
        instanceDefinition = await instanceDefinitionHelper.modifyInstanceWithPrompt({
          ...objectData,
          body,
          instanceDefinition,
        });
      }

      if (mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name) {
        instanceDefinition = await instanceDefinitionHelper.modifyInstanceForPageBy(
          objectData,
          pageByData,
          instanceDefinition,
          body
        );
      }

      if (pageByData) {
        pageByData = pageByHelper.getPageByDataForDisplayType(pageByData, instanceDefinition);
      }

      this.savePreviousObjectData(
        instanceDefinition,
        crosstabHeaderDimensions,
        (subtotalsInfo as SubtotalsInfo).subtotalsAddresses,
        futureStep,
        importType
      );

      // DE296533: If the object is an image and we must import/duplicate to new sheet,
      // we will create a new worksheet before the image is imported.
      // TODO: Implement more proper fix for this issue
      if (
        importType === ObjectImportType.IMAGE &&
        futureStep in ImportOperationStepDict &&
        insertNewWorksheet
      ) {
        const worksheet = await officeApiWorksheetHelper.createNewWorksheet({
          excelContext,
          worksheetName: name,
          pageByData,
        });
        worksheet.activate();
        await excelContext.sync();
      }

      if (insertNewWorksheet) {
        delete objectData.insertNewWorksheet;
      } else {
        shouldRenameExcelWorksheet =
          await officeApiWorksheetHelper.isActiveWorksheetEmpty(excelContext);
      }

      const { mstrTable } = instanceDefinition;

      const updatedObject: Partial<ObjectData> = {
        objectWorkingId,
        envUrl: authenticationHelper.getCurrentMstrContext(),
        body,
        visualizationInfo: visualizationInfo || false,
        name: name || mstrTable.name,
        manipulationsXML: instanceDefinition.manipulationsXML || false,
        definition: {
          ...definition,
          attributes: mstrTable.attributes,
          metrics: mstrTable.metrics,
        },
        pageByData,
        details: {
          ...details,
          filters: {
            viewFilterText,
          },
        },
      };

      const updatedOperation: Partial<OperationData> = {
        objectWorkingId,
        instanceDefinition,
        excelContext,
        shouldRenameExcelWorksheet,
        insertNewWorksheet: importType === ObjectImportType.PIVOT_TABLE || insertNewWorksheet,
      };


      const isEditOrRefreshOperationType = operationType === OperationTypes.REFRESH_OPERATION
        || operationType === OperationTypes.EDIT_OPERATION;
      if (importType === ObjectImportType.FORMATTED_DATA && isEditOrRefreshOperationType) {
        // Used to check the condition, before performing special logic on edit and refresh formatted data operations,
        // in order to remove the crosstab tables. Reference {@link OfficeTableHelperRange.deletePrevOfficeTable()}
        updatedObject.prevIsCrosstab = updatedObject.isCrosstab;
      }

      if (objectTableImportType.has(importType)) {
        // update table specific props
        updatedObject.crosstabHeaderDimensions = mstrTable.crosstabHeaderDimensions;
        updatedObject.isCrosstab = mstrTable.isCrosstab;
        updatedObject.subtotalsInfo = subtotalsInfo;
        updatedOperation.oldBindId = bindId;
        updatedOperation.totalRows = instanceDefinition.rows;
      }

      if (mstrTable.rows.length === 0) {
        throw new Error(
          isPrompted ? ErrorMessages.ALL_DATA_FILTERED_OUT : ErrorMessages.NO_DATA_RETURNED
        );
      }

      operationStepDispatcher.updateOperation(updatedOperation);
      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeGetInstanceDefinition(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Total');
      console.groupEnd();
    }
  };

  /**
   * Answers prompts and modify instance of the object.
   *
   * @param instanceDefinition Object containing information about MSTR object
   * @param crosstabHeaderDimensions Contains information about crosstab headers dimensions
   * @param subtotalsAddresses Contains adresses of subtotals from first import
   * @param futureStep Specifies which step wuill be used to create Excel table
   */
  savePreviousObjectData = (
    instanceDefinition: InstanceDefinition,
    crosstabHeaderDimensions: any,
    subtotalsAddresses: any[],
    futureStep?: OperationSteps,
    importType = ObjectImportType.TABLE
  ): void => {
    // We do not need to set prevCrosstabDimensions, crosstabHeaderDimensions and subtotalsInfo for images
    if (importType === ObjectImportType.IMAGE) {
      return;
    }
    const { mstrTable } = instanceDefinition;

    if (crosstabHeaderDimensions && futureStep !== OperationSteps.GET_OFFICE_TABLE_IMPORT) {
      mstrTable.prevCrosstabDimensions = crosstabHeaderDimensions;
    } else {
      mstrTable.prevCrosstabDimensions = false;
    }
    mstrTable.crosstabHeaderDimensions = mstrTable.isCrosstab
      ? officeApiCrosstabHelper.getCrosstabHeaderDimensions(instanceDefinition)
      : false;
    mstrTable.subtotalsInfo.subtotalsAddresses = subtotalsAddresses;
  };
}

const stepGetInstanceDefinition = new StepGetInstanceDefinition();
export default stepGetInstanceDefinition;
