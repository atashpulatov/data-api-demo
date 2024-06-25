/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  PopupActions,
  PopupActionTypes,
  PopupState,
  SetIsDuplicateAction,
  SetIsEditAction,
  SetPreparedReportAction,
  SetReportNFiltersAction,
  SwitchImportSubtotalsOnEditAction,
  UpdateDisplayAttrFormOnEditAction,
} from './popup-reducer-types';

export const initialState: PopupState = {};

// eslint-disable-next-line default-param-last
export const popupReducer = (state = initialState, action: PopupActions): PopupState => {
  switch (action.type) {
    case PopupActionTypes.SET_REPORT_N_FILTERS:
      return setReportNFilters(state, action);

    case PopupActionTypes.SET_PREPARED_REPORT:
      return setPreparedReport(state, action);

    case PopupActionTypes.SET_IS_EDIT:
      return setIsEdit(state, action);

    case PopupActionTypes.SET_IS_DUPLICATE:
      return setIsDuplicate(state, action);

    case PopupActionTypes.CLEAR_EDITED_OBJECT:
      return clearEditedObject(state);

    case PopupActionTypes.SWITCH_IMPORT_SUBTOTALS_ON_EDIT:
      return switchImportSubtotalsOnEdit(state, action);

    case PopupActionTypes.UPDATE_DISPLAY_ATTR_FORM_ON_EDIT:
      return updateDisplayAttrFormOnEdit(state, action);

    case PopupActionTypes.RESET_STATE:
      return resetState();

    default:
      return state;
  }
};

const setReportNFilters = (state: PopupState, action: SetReportNFiltersAction): PopupState => ({
  ...state,
  editedObject: action.editedObject,
});

const setIsEdit = (state: PopupState, action: SetIsEditAction): PopupState => ({
  ...state,
  isEdit: action.isEdit,
});

const setIsDuplicate = (state: PopupState, action: SetIsDuplicateAction): PopupState => ({
  ...state,
  isDuplicate: action.isDuplicate,
});

const setPreparedReport = (state: PopupState, action: SetPreparedReportAction): PopupState => {
  const oldEditedObject = { ...state.editedObject };
  return {
    ...state,
    preparedInstance: action.instanceId,
    editedObject: {
      ...oldEditedObject,
      ...action.chosenObjectData,
    },
  };
};

const clearEditedObject = (state: PopupState): PopupState => ({
  ...state,
  preparedInstance: null,
  editedObject: null,
});

const switchImportSubtotalsOnEdit = (
  state: PopupState,
  action: SwitchImportSubtotalsOnEditAction
): PopupState => {
  const editedObject = { ...state.editedObject };
  if (editedObject && editedObject.subtotalsInfo) {
    editedObject.subtotalsInfo.importSubtotal = action.data;
  }
  return {
    ...state,
    editedObject: !state.editedObject ? state.editedObject : editedObject,
  };
};

const updateDisplayAttrFormOnEdit = (
  state: PopupState,
  action: UpdateDisplayAttrFormOnEditAction
): PopupState => {
  if (state.editedObject) {
    const editedObject = { ...state.editedObject };
    if (editedObject.displayAttrFormNames) {
      editedObject.displayAttrFormNames = action.data;
    }
    return {
      ...state,
      editedObject,
    };
  }
  return state;
};

const resetState = (): PopupState => ({ ...initialState });
