import { ObjectData } from '../../types/object-types';
import { PopupActionTypes, SetIsDuplicateAction, SetIsEditAction } from './popup-reducer-types';

import { DisplayAttrFormNames } from '../../mstr-object/constants';

const setReportAndFilters = (objectData: ObjectData, isDuplicate = false): any => ({
  type: PopupActionTypes.SET_REPORT_N_FILTERS,
  editedObject: objectData,
  isDuplicate,
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

const setIsEdit = (isEdit: boolean): SetIsEditAction => ({
  type: PopupActionTypes.SET_IS_EDIT,
  isEdit,
});

const setIsDuplicate = (isDuplicate: boolean): SetIsDuplicateAction => ({
  type: PopupActionTypes.SET_IS_DUPLICATE,
  isDuplicate,
});

export const popupActions = {
  setReportAndFilters,
  preparePromptedReport,
  resetState,
  switchImportSubtotalsOnEdit,
  clearEditedObject,
  updateDisplayAttrFormOnEdit,
  setIsEdit,
  setIsDuplicate,
};
