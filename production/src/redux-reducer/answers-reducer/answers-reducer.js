import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { IMPORT_OPERATION } from '../../operation/operation-type-names';
import { RESTORE_ALL_ANSWERS, UPDATE_ANSWERS, RESET_ANSWERS } from './answers-actions';

const initialState = { answers: [] };
export const answersReducer = (state = initialState, action) => {
  switch (action.type) {
    case IMPORT_OPERATION:
      return importRequested(state, action.payload);

    case RESTORE_ALL_ANSWERS:
      return restoreAllAnswers(action.payload);

    case UPDATE_ANSWERS:
      return updateAnswers(state, action.payload);

    case RESET_ANSWERS:
      return { ...initialState, };

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
function importRequested(state, payload) {
  const newAnswers = [...state.answers];
  const isDossier = payload.object.mstrObjectType.name === mstrObjectEnum.mstrObjectType.visualization.name;
  if (payload.object.isPrompted) {
    const { answers } = isDossier ? payload.object.promptsAnswers : payload.object.promptsAnswers[0];

    answers.forEach((answer) => {
      const answerIdx = getAnswerIndex(state.answers, answer.key);

      if (answerIdx === -1) {
        // add unique answer to existing list
        newAnswers.push(answer);
      } else {
        // update entry for pre-existing answer in list
        newAnswers.splice(answerIdx, 1, answer);
      }
    });
  }

  return { answers: [...newAnswers] };
}

/**
 * Function called when the answers are restored from the Office settings backup.
 * It will replace the existing answers in App state with the ones from the Office settings backup.
 * @param {*} state
 * @param {*} payload
 * @returns
 */
function restoreAllAnswers(payload) {
  return { answers: [...payload] };
}

/**
 * Function to be called when an answer or more is updated. It will update the answers in the App state.
 * @param {*} state
 * @param {*} updatedAnswerProps
 * @returns
 */
function updateAnswers(state, updatedAnswerProps) {
  const answerToUpdateIndex = getAnswerIndex(
    state.answers,
    updatedAnswerProps.key
  );
  if (answerToUpdateIndex === -1) {
    // TODO error handling
    throw new Error();
  }
  const newAnswers = [...state.answers];
  const updatedAnswer = {
    ...state.answers[answerToUpdateIndex],
    ...updatedAnswerProps,
  };
  newAnswers.splice(answerToUpdateIndex, 1, updatedAnswer);
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
