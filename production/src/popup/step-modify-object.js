import operationStepDispatcher from '../operation/operation-step-dispatcher';

class StepModifyObject {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  modifyObject = (objectData, { objectEditedData }) => {
    const { objectWorkingId, subtotalsInfo } = objectData;

    const updatedObject = {
      objectWorkingId,
      body: objectEditedData.body,
      oldBindId: objectData.bindId,
      prevOfficeTable: objectData.officeTable,
    };

    if (!objectEditedData.visualizationInfo
      && subtotalsInfo.importSubtotal !== objectEditedData.subtotalsInfo.importSubtotal) {
      const subtotalsInformation = { ...subtotalsInfo };
      subtotalsInformation.importSubtotal = objectEditedData.subtotalsInfo.importSubtotal;
      updatedObject.instanceDefinition.mstrTable.subtotalsInfo = subtotalsInformation;
    }

    if (objectData.displayAttrFormNames !== objectEditedData.displayAttrFormNames) {
      updatedObject.displayAttrFormNames = objectEditedData.displayAttrFormNames;
    }

    if (objectEditedData.promptsAnswers) {
      updatedObject.promptsAnswers = objectEditedData.promptsAnswers;
    }

    if (objectEditedData.isEdit) {
      if (objectData.visualizationInfo.visualizationKey !== objectEditedData.visualizationInfo.visualizationKey) {
        objectEditedData.visualizationInfo.nameShouldUpdate = true;
        objectEditedData.visualizationInfo.formatShouldUpdate = true;
        updatedObject.displayAttrFormNames = objectEditedData.displayAttrFormNames;
      }

      updatedObject.preparedInstanceId = objectEditedData.preparedInstanceId;
      updatedObject.isEdit = false;
    }

    operationStepDispatcher.updateObject(updatedObject);
    operationStepDispatcher.completeModifyObject(objectWorkingId);

    // TODO add apllying bockup on erorr
    // if (isErrorOnRefresh) {
    //   if (reportPreviousState.objectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
    //     await preserveReportValue(reportParams.bindId, 'manipulationsXML', reportPreviousState.manipulationsXML);
    //     await preserveReportValue(reportParams.bindId, 'visualizationInfo', reportPreviousState.visualizationInfo);
    //   } else {
    //     await preserveReportValue(reportParams.bindId, 'body', reportPreviousState.body);
    //   }
    // }
  }
}

const stepModifyObject = new StepModifyObject();
export default stepModifyObject;
