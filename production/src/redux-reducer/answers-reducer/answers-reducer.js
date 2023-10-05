import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { IMPORT_OPERATION, EDIT_OPERATION } from '../../operation/operation-type-names';
import { RESTORE_ALL_ANSWERS, CLEAR_ANSWERS } from './answers-actions';

const initialState = { answers: [] };
export const answersReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case IMPORT_OPERATION:
      return importRequested(state, action.payload);

    case RESTORE_ALL_ANSWERS:
      return restoreAllAnswers(action.payload);

    case EDIT_OPERATION:
      return updateAnswers(state, action.payload);

    case CLEAR_ANSWERS:
      return { ...initialState };

    default:
      return state;
  }
};

/**
 * Function called when dossier/report is imported.
 * It will add the answers to the state by merging them with the existing ones
 * if existing or adding them if not.
 * @param {*} state
 * @param {*} payload
 * @returns
 */
function importRequested(state, payload = {}) {
  const { object: payloadObject = {} } = payload;
  let newAnswers = [...state.answers];
  const isDossier = (payloadObject.mstrObjectType && payloadObject.mstrObjectType.name)
    === mstrObjectEnum.mstrObjectType.visualization.name;
  // for dossiers, check promptsAnswers directly. for reports, check isPrompted flag directly
  if ((isDossier && payloadObject.promptsAnswers) || payloadObject.isPrompted) {
    const { answers } = isDossier ? payloadObject.promptsAnswers : payloadObject.promptsAnswers[0];
    newAnswers = getMergedAnswers(state.answers, answers);
  }

  return { answers: newAnswers };
}

/**
 * Function called when the answers are restored from the Office settings backup.
 * It will replace the existing answers in App state with the ones from the Office settings backup.
 * @param {*} state
 * @param {*} payload
 * @returns
 */
function restoreAllAnswers(payload = []) {
  return { answers: [...payload] };
}

/**
 * Function to be called when an answer or more is updated. It will update the answers in the App state.
 * @param {*} state
 * @param {*} payload
 * @returns
 */
function updateAnswers(state, payload = {}) {
  const { objectEditedData: payloadEditedObject = {} } = (payload && payload.operation) || {};
  let newAnswers = [...state.answers];
  const isDossier = !!(payloadEditedObject && payloadEditedObject.visualizationInfo);
  // for dossiers, check promptsAnswers directly. for reports, check isPrompted flag directly
  if ((isDossier && payloadEditedObject.promptsAnswers) || payloadEditedObject.isPrompted) {
    const { answers } = isDossier ? payloadEditedObject.promptsAnswers : payloadEditedObject.promptsAnswers[0];
    newAnswers = getMergedAnswers(state.answers, answers);
  }

  return { answers: newAnswers };
}

/**
 * Function to get the index of an answer in the answers array if it exists.
 * It will return -1 if the answer is not found.
 * @param {*} answers
 * @param {*} keyId
 * @returns
 */
function getAnswerIndex(answers, keyId) {
  const answerToUpdateIndex = answers.findIndex(
    (answer) => answer && answer.key === keyId
  );
  return answerToUpdateIndex;
}

/**
 * Helper function used to merge originally saved answers with new answers retrieved
 * by either importing, editing, or re-prompting a Dossier/Report.
 * @param {Array} originalAnswers Originally saved answers (from Redux store)
 * @param {Array} newAnswers Newly retrieved answers (from import, edit, re-prompt, etc.)
 * @returns Array containing merged objects from originalAnswers and newAnswers using
 * 'key' prop as key, with duplicates from newAnswers replacing its originalAnswers copy.
 */
function getMergedAnswers(originalAnswers, newAnswers) {
  const updatedAnswers = [...originalAnswers];
  newAnswers && newAnswers.forEach((answer) => {
    const answerIdx = getAnswerIndex(originalAnswers, answer.key);

    if (answerIdx === -1) {
      // add unique answer to existing list
      updatedAnswers.push(answer);
    } else {
      // update entry for pre-existing answer in list
      updatedAnswers.splice(answerIdx, 1, answer);
    }
  });

  return updatedAnswers;
}
