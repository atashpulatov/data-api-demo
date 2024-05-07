import { reduxStore } from '../../store';

import { OperationData } from '../../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData, ObjectSettings } from '../../types/object-types';

import operationErrorHandler from '../../operation/operation-error-handler';
import operationStepDispatcher from '../../operation/operation-step-dispatcher';
import { OperationTypes } from '../../operation/operation-type-names';

class StepGetObjectSettings {
  private reduxStore;

  constructor() {
    this.reduxStore = reduxStore;
  }

  getObjectSettings = async (
    objectData: ObjectData,
    operationData: OperationData
  ): Promise<void> => {
    try {
      const { objectSettings } = objectData;
      const { operationType } = operationData;
      const {
        mergeCrosstabColumns: mergeCrosstabColumnsUserSetting,
        importAttributesAsText: importAttributesAsTextUserSetting,
      } = this.reduxStore.getState().settingsReducer;

      const updatedObjectSettings = {} as ObjectSettings;

      switch (operationType) {
        case OperationTypes.EDIT_OPERATION:
        case OperationTypes.IMPORT_OPERATION:
          updatedObjectSettings.mergeCrosstabColumns = mergeCrosstabColumnsUserSetting;
          updatedObjectSettings.importAttributesAsText = importAttributesAsTextUserSetting;
          break;
        case OperationTypes.REFRESH_OPERATION:
        case OperationTypes.DUPLICATE_OPERATION:
          updatedObjectSettings.mergeCrosstabColumns =
            objectSettings.mergeCrosstabColumns !== undefined
              ? objectSettings.mergeCrosstabColumns
              : mergeCrosstabColumnsUserSetting;

          updatedObjectSettings.importAttributesAsText =
            objectSettings.importAttributesAsText !== undefined
              ? objectSettings.importAttributesAsText
              : importAttributesAsTextUserSetting;

          break;
        default:
          break;
      }

      const updatedObject = {
        ...objectData,
        objectSettings: updatedObjectSettings,
      };

      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeGetObjectSettings(objectData.objectWorkingId);
    } catch (error) {
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    }
  };
}

const stepGetObjectSettings = new StepGetObjectSettings();
export default stepGetObjectSettings;
