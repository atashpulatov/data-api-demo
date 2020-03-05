import { IMPORT_REQUESTED, MARK_STEP_COMPLETED } from './operation-actions';

const initialState = {};

export const operationReducer = (state = initialState, action) => {
  switch (action.type) {
  case IMPORT_REQUESTED:
    return importRequested(state, action.payload);
  case MARK_STEP_COMPLETED:
    return markStepCompleted(state, action.payload);
  default:
    return state;
  }
};

function importRequested(state, payload) {

}

function markStepCompleted(state, paylaod) {

}
