import operationStepDispatcher from '../operation/operation-step-dispatcher';

class StepModifyObject {
  /**
   * Overrides the old data stored in object reducer with the data received from the popup after edit action.
   *
   * This function is subscribed as one of the operation steps with the key MODIFY_OBJECT,
   * therefore should be called only via operation bus.
   *
   * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param {Object} objectData.subtotalsInfo Determines if subtotals will be displayed and stores subtotal addresses
   * @param {Object} objectData.body Contains information about location of visualization in dossier
   * @param {String} objectData.bindId Unique id of the Office table used for referencing the table in Excel
   * @param {Office} operationData.objectEditedData Contains new data for edit workflow
   */
  modifyObject = (objectData, { objectEditedData }) => {
    const { objectWorkingId, subtotalsInfo } = objectData;

    const updatedObject = {
      objectWorkingId,
      body: objectEditedData.body,
    };

    if (!objectEditedData.visualizationInfo
      && subtotalsInfo.importSubtotal !== objectEditedData.subtotalsInfo.importSubtotal) {
      const subtotalsInformation = { ...subtotalsInfo };
      subtotalsInformation.importSubtotal = objectEditedData.subtotalsInfo.importSubtotal;
      updatedObject.subtotalsInfo = subtotalsInformation;
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
  }
}

const stepModifyObject = new StepModifyObject();
export default stepModifyObject;
