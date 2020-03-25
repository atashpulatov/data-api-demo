import { officeProperties } from './office-properties';
import { errorService } from '../../error/error-handler';
import { IMPORT_OPERATION } from '../../operation/operation-steps';
import { officeStoreService } from './office-store-service';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';

class StepSaveObjectInExcel {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  // TODO add jsdoc after integration
  saveObject = async (objectData, operationData) => {
    const { instanceDefinition, operationType } = operationData;
    const { mstrTable } = instanceDefinition;
    objectData.previousTableDimensions = { columns: instanceDefinition.columns };
    const refreshDate = new Date();

    const report = {
      id: objectData.objectId,
      name: mstrTable.name,
      bindId: objectData.bindId,
      projectId: objectData.projectId,
      envUrl: objectData.envUrl,
      body: objectData.body,
      isLoading: false,
      objectType: objectData.mstrObjectType,
      isCrosstab: mstrTable.isCrosstab,
      isPrompted: objectData.isPrompted,
      subtotalsInfo: mstrTable.subtotalsInfo,
      promptsAnswers: objectData.promptsAnswers,
      crosstabHeaderDimensions: mstrTable.crosstabHeaderDimensions,
      visualizationInfo: objectData.visualizationInfo,
      manipulationsXML: instanceDefinition.manipulationsXML,
      tableName: objectData.tableName,
      previousTableDimensions: objectData.previousTableDimensions,
      displayAttrFormNames: objectData.displayAttrFormNames,
      oldBindId: objectData.oldBindId,
      objectWorkingId: objectData.objectWorkingId,
      refreshDate
    };

    if (operationType !== IMPORT_OPERATION) {
      // TODO remove after connecting right panel to object reducer
      try {
        const settings = officeStoreService.getOfficeSettings();
        const reportsArray = [...officeStoreService.getObjectProperties()];
        const reportObj = reportsArray.find((element) => element.bindId === report.oldBindId);
        const ObjectIndex = reportsArray.indexOf(reportObj);
        const refreshedObject = reportsArray[ObjectIndex];
        refreshedObject.crosstabHeaderDimensions = report.crosstabHeaderDimensions;
        refreshedObject.isCrosstab = report.isCrosstab;
        refreshedObject.bindId = report.bindId;
        refreshedObject.previousTableDimensions = report.previousTableDimensions;
        refreshedObject.subtotalsInfo = report.subtotalsInfo;
        refreshedObject.displayAttrFormNames = report.displayAttrFormNames;
        refreshedObject.refreshDate = report.refreshDate;
        refreshedObject.preparedInstanceId = null;
        refreshedObject.body = report.body;
        refreshedObject.objectWorkingId = report.objectWorkingId; // Revert when we connect reducer to excel settings
        if (refreshedObject.visualizationInfo) {
          refreshedObject.manipulationsXML = report.manipulationsXML;
          refreshedObject.visualizationInfo.dossierStructure = report.visualizationInfo.dossierStructure;
          if (refreshedObject.visualizationInfo.nameShouldUpdate) {
            // If visualization was changed, preserve new visualization name and new dossierStructure.
            refreshedObject.name = report.name;
            refreshedObject.visualizationInfo.nameShouldUpdate = false;
          }
        }

        settings.set(officeProperties.loadedReportProperties, reportsArray);
        settings.saveAsync((saveAsync) => console.log(`Refresh ${saveAsync.status}`));
        await officeStoreService.loadExistingReportBindingsExcel();
      } catch (error) {
        errorService.handleError(error);
      }
    } else {
      this.reduxStore.dispatch({
        type: officeProperties.actions.loadReport,
        report
      });
      await officeStoreService.preserveObject(report);
    }
    console.timeEnd('Total');
    console.groupEnd();

    this.reduxStore.dispatch({
      type: officeProperties.actions.finishLoadingReport,
      reportBindId: objectData.bindId,
    });
    await officeStoreService.saveObjectsInExcelStore();

    operationStepDispatcher.completeSaveObjectInExcel(objectData.objectWorkingId);
  };
}

const stepSaveObjectInExcel = new StepSaveObjectInExcel();
export default stepSaveObjectInExcel;
