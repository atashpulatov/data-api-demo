import { markStepCompleted } from '../operation/operation-actions';
import { MODIFY_OBJECT } from '../operation/operation-steps';
import { updateObject } from '../operation/object-actions';

class StepSaveReportWithParams {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  saveReportWithParams = async (objectData, response) => {
    const { objectWorkingId } = objectData;

    const updatedObject = {
      objectWorkingId,
      body: response.body
    };

    if (!response.visualizationInfo
      && objectData.subtotalsInfo.importSubtotal !== response.subtotalsInfo.importSubtotal) {
      const subtotalsInformation = { ...objectData.subtotalsInfo };
      subtotalsInformation.importSubtotal = response.subtotalsInfo.importSubtotal;
      updatedObject.subtotalsInfo = subtotalsInformation;
    }

    if (objectData.displayAttrFormNames !== response.displayAttrFormNames) {
      updatedObject.displayAttrFormNames = response.displayAttrFormNames;
    }

    if (response.promptsAnswers) {
      updatedObject.promptsAnswers = response.promptsAnswers;
    }

    if (response.isEdit) {
      if (objectData.visualizationInfo.visualizationKey !== response.visualizationInfo.visualizationKey) {
        response.visualizationInfo.nameShouldUpdate = true;
        response.visualizationInfo.formatShouldUpdate = true;
        updatedObject.displayAttrFormNames = response.displayAttrFormNames;
      }

      updatedObject.preparedInstanceId = response.preparedInstanceId;
      updatedObject.isEdit = false;
    }

    this.reduxStore.dispatch(updateObject(updatedObject));
    this.reduxStore.dispatch(markStepCompleted(objectWorkingId, MODIFY_OBJECT));

    // if (isErrorOnRefresh) {
    //   if (reportPreviousState.objectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
    //     await preserveReportValue(reportParams.bindId, 'manipulationsXML', reportPreviousState.manipulationsXML);
    //     await preserveReportValue(reportParams.bindId, 'visualizationInfo', reportPreviousState.visualizationInfo);
    //   } else {
    //     await preserveReportValue(reportParams.bindId, 'body', reportPreviousState.body);
    //   }
    // }
  };
}

export const stepSaveReportWithParams = new StepSaveReportWithParams();
export default stepSaveReportWithParams;
