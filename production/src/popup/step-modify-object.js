import operationStepDispatcher from '../operation/operation-step-dispatcher';

class StepModifyObject {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  /**
   * Override the old data stored in object reducer with the data receive from the popup after edit action.
   *
   * This function is subscribed as one of the operation steps with key MODIFY_OBJECT,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing as to reference specific object
   * @param {Object} objectData.subtotalsInfo Deteermine if subtotals will be displayed and store subtotal adresses
   * @param {Object} objectData.body Contains information about location od visualization in dossier
   * @param {String} objectData.bindId Unique id of the Office table used for referencing the table in Excel
   * @param {Office} operationData.objectEditedData Contains new data foe edit workflow
   */
  modifyObject = (objectData, { objectEditedData }) => {
    const { objectWorkingId, subtotalsInfo } = objectData;

    const updatedObject = {
      objectWorkingId,
      body: objectEditedData.body,
      oldBindId: objectData.bindId,
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
