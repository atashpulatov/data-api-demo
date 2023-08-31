import { configProperties } from './config-properties';

const initialState = { showHidden: false };

export const configReducer = (state = initialState, action) => {
  switch (action.type) {
    case configProperties.actions.setShowHidden:
      return setShowHidden(action, state);

    default:
      break;
  }
  return state;
};

function setShowHidden(action, state) {
  return {
    ...state,
    showHidden: action.showHidden
  };
}
