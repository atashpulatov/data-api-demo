import { ObjectData } from '../../types/object-types';
import { PopupActionTypes } from './popup-reducer-types';

import { DisplayAttrFormNames } from '../../mstr-object/constants';

const setReportAndFilters = (objectData: ObjectData): any => ({
  type: PopupActionTypes.SET_REPORT_N_FILTERS,
  editedObject: objectData,
});

const preparePromptedReport = (instanceId: string, chosenObjectData: any): any => ({
  type: PopupActionTypes.SET_PREPARED_REPORT,
  instanceId,
  chosenObjectData,
});

const resetState = (): any => ({ type: PopupActionTypes.RESET_STATE });

const switchImportSubtotalsOnEdit = (data: any): any => ({
  type: PopupActionTypes.SWITCH_IMPORT_SUBTOTALS_ON_EDIT,
  data,
});

const clearEditedObject = (): any => ({ type: PopupActionTypes.CLEAR_EDITED_OBJECT });

const updateDisplayAttrFormOnEdit = (data: DisplayAttrFormNames): any => ({
  type: PopupActionTypes.UPDATE_DISPLAY_ATTR_FORM_ON_EDIT,
  data,
});

export const popupActions = {
  setReportAndFilters,
  preparePromptedReport,
  resetState,
  switchImportSubtotalsOnEdit,
  clearEditedObject,
  updateDisplayAttrFormOnEdit,
};
