import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';

import operationStepDispatcher from '../operation/operation-step-dispatcher';

class StepModifyObject {
  /**
   * Overrides the old data stored in object reducer with the data received from the popup after edit action.
   *
   * This function is subscribed as one of the operation steps with the key MODIFY_OBJECT,
   * therefore should be called only via operation bus.
   *
   * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param objectData.subtotalsInfo Determines if subtotals will be displayed and stores subtotal addresses
   * @param objectData.body Contains information about location of visualization in dossier
   * @param objectData.bindId Unique id of the Office table used for referencing the table in Excel
   * @param operationData.objectEditedData Contains new data for edit workflow
   */
  modifyObject = (objectData: ObjectData, { objectEditedData }: OperationData): void => {
    const { objectWorkingId, subtotalsInfo } = objectData;

    if (objectEditedData) {
      const updatedObject: Partial<ObjectData> = {
        objectWorkingId,
        body: objectEditedData.body,
      };

      if (
        !objectEditedData.visualizationInfo &&
        subtotalsInfo &&
        subtotalsInfo.importSubtotal !== objectEditedData.subtotalsInfo.importSubtotal
      ) {
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
        if (
          objectData.visualizationInfo &&
          objectEditedData.visualizationInfo &&
          objectData.visualizationInfo.visualizationKey !==
            objectEditedData.visualizationInfo.visualizationKey
        ) {
          objectEditedData.visualizationInfo.nameAndFormatShouldUpdate = true;
          updatedObject.visualizationInfo = objectEditedData.visualizationInfo;
          updatedObject.displayAttrFormNames = objectEditedData.displayAttrFormNames;
        }

        updatedObject.preparedInstanceId = objectEditedData.preparedInstanceId;
        // @ts-expect-error
        updatedObject.isEdit = false;
      }

      if (objectEditedData.filterDetails) {
        updatedObject.definition = { filters: objectEditedData.filterDetails };
      }

      operationStepDispatcher.updateObject(updatedObject);
    }
    operationStepDispatcher.completeModifyObject(objectWorkingId);
  };
}

const stepModifyObject = new StepModifyObject();
export default stepModifyObject;
