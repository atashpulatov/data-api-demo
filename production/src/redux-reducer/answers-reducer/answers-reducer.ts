/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  AnswerActions,
  AnswerActionTypes,
  AnswersState,
  PromptsAnswer,
} from './answers-reducer-types';

const initialState: AnswersState = { answers: [] };
// eslint-disable-next-line default-param-last
export const answersReducer = (state = initialState, action: AnswerActions): AnswersState => {
  switch (action.type) {
    case AnswerActionTypes.IMPORT_OPERATION:
      return importRequested(state, action.payload);

    case AnswerActionTypes.RESTORE_ALL_ANSWERS:
      return restoreAllAnswers(action.payload);

    case AnswerActionTypes.EDIT_OPERATION:
      return updateAnswers(state, action.payload);

    case AnswerActionTypes.CLEAR_ANSWERS:
      return { ...initialState };

    default:
      return state;
  }
};

/**
 * Function called when dossier/report is imported.
 * It will add the answers to the state by merging them with the existing ones
 * if existing or adding them if not.
 * @param state
 * @param payload
 * @returns
 */
function importRequested(state: AnswersState, payload: any): AnswersState {
  const { object: payloadObject = {} } = payload;
  let newAnswers = [...state.answers];
  if (payloadObject.isPrompted && Array.isArray(payloadObject.promptsAnswers)) {
    payloadObject.promptsAnswers.forEach((promptsAnswer: any) => {
      const { answers } = promptsAnswer;
      if (answers) {
        newAnswers = getMergedAnswers(newAnswers, answers);
      }
    });
  }
  return { answers: newAnswers };
}

/**
 * Function called when the answers are restored from the Office settings backup.
 * It will replace the existing answers in App state with the ones from the Office settings backup.
 * @param state
 * @param payload
 * @returns
 */
function restoreAllAnswers(payload: PromptsAnswer[] = []): AnswersState {
  return { answers: [...payload] };
}

/**
 * Function to be called when an answer or more is updated. It will update the answers in the App state.
 * @param state
 * @param payload
 * @returns
 */
function updateAnswers(state: AnswersState, payload: any): AnswersState {
  const { objectEditedData: payloadEditedObject = {} } = (payload && payload.operation) || {};
  let newAnswers = [...state.answers];
  if (payloadEditedObject.isPrompted && Array.isArray(payloadEditedObject.promptsAnswers)) {
    payloadEditedObject.promptsAnswers.forEach((promptsAnswer: any) => {
      const { answers } = promptsAnswer;
      if (answers) {
        newAnswers = getMergedAnswers(newAnswers, answers);
      }
    });
  }
  return { answers: newAnswers };
}

/**
 * Function to get the index of an answer in the answers array if it exists.
 * It will return -1 if the answer is not found.
 * @param answers
 * @param keyId
 * @returns
 */
function getAnswerIndex(answers: PromptsAnswer[], keyId: string): number {
  const answerToUpdateIndex = answers.findIndex(answer => answer && answer.key === keyId);
  return answerToUpdateIndex;
}

/**
 * Helper function used to merge originally saved answers with new answers retrieved
 * by either importing, editing, or re-prompting a Dossier/Report.
 * @param originalAnswers Originally saved answers (from Redux store)
 * @param newAnswers Newly retrieved answers (from import, edit, re-prompt, etc.)
 * @returns Array containing merged objects from originalAnswers and newAnswers using
 * 'key' prop as key, with duplicates from newAnswers replacing its originalAnswers copy.
 */
function getMergedAnswers(
  originalAnswers: PromptsAnswer[],
  newAnswers: PromptsAnswer[]
): PromptsAnswer[] {
  const updatedAnswers = [...originalAnswers];
  newAnswers &&
    newAnswers.forEach(answer => {
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
