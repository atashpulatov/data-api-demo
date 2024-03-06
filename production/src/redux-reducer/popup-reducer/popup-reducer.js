import {
  CLEAR_EDITED_OBJECT,
  RESET_STATE,
  SET_PREPARED_REPORT,
  SET_REPORT_N_FILTERS,
  SWITCH_IMPORT_SUBTOTALS_ON_EDIT,
  UPDATE_DISPLAY_ATTR_FORM_ON_EDIT,
} from './popup-actions';

export const initialState = {};

export const popupReducer = (state = initialState, action = {}) => {
  const { type, data } = action;
  switch (type) {
    case SET_REPORT_N_FILTERS: {
      return {
        ...state,
        editedObject: action.editedObject,
      };
    }
    case SET_PREPARED_REPORT: {
      const oldEditedObject = { ...state.editedObject };
      return {
        ...state,
        preparedInstance: action.instanceId,
        editedObject: {
          ...oldEditedObject,
          ...action.chosenObjectData,
        },
      };
    }
    case CLEAR_EDITED_OBJECT: {
      return {
        ...state,
        preparedInstance: null,
        editedObject: null,
      };
    }
    case SWITCH_IMPORT_SUBTOTALS_ON_EDIT: {
      const editedObject = { ...state.editedObject };
      if (editedObject && editedObject.subtotalsInfo) {
        editedObject.subtotalsInfo.importSubtotal = data;
      }
      return {
        ...state,
        editedObject: !state.editedObject ? state.editedObject : editedObject,
      };
    }
    case UPDATE_DISPLAY_ATTR_FORM_ON_EDIT: {
      if (state.editedObject) {
        const editedObject = { ...state.editedObject };
        if (editedObject.displayAttrFormNames) {
          editedObject.displayAttrFormNames = data;
        }
        return {
          ...state,
          editedObject,
        };
      }
      return state;
    }
    case RESET_STATE: {
      return { ...initialState };
    }
    default:
      return state;
  }
};
