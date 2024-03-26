/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  ConfigActions,
  ConfigActionTypes,
  ConfigState,
  SetShowHiddenAction,
} from './config-reducer-types';

const initialState: ConfigState = { showHidden: false };

// eslint-disable-next-line default-param-last
export const configReducer = (state = initialState, action: ConfigActions): ConfigState => {
  switch (action.type) {
    case ConfigActionTypes.SET_SHOW_HIDDEN:
      return setShowHidden(action, state);

    default:
      break;
  }
  return state;
};

function setShowHidden(action: SetShowHiddenAction, state: ConfigState): ConfigState {
  return {
    ...state,
    showHidden: action.showHidden,
  };
}
