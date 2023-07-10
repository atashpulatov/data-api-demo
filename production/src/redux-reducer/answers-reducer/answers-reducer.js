import { RESTORE_ALL_ANSWERS, UPDATE_ANSWER } from "./answers-actions";

const initialState = { answers: [] };
export const answersReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESTORE_ALL_ANSWERS:
      return restoreAllAnswers(state, action.payload);

    case UPDATE_ANSWER:
      return updateAnswer(state, action.payload);

    default:
      return state;
  }
};

function restoreAllAnswers(state, payload) {
  return { answers: [...payload] };
}

function updateAnswer(state, updatedAnswerProps) {
  const answerToUpdateIndex = getAnswerIndex(
    state.answers,
    updatedAnswerProps.key
  );
  const newAnswers = [...state.answers];
  const updatedAnswer = {
    ...state.answers[answerToUpdateIndex],
    ...updatedAnswerProps,
  };
  newAnswers.splice(answerToUpdateIndex, 1, updatedAnswer);
  return { answers: newAnswers };
}

function getAnswerIndex(answers, keyId) {
  const answerToUpdateIndex = answers.findIndex(
    (answer) => answer.key === keyId
  );
  if (answerToUpdateIndex === -1) {
    // TODO error handling
    throw new Error();
  }
  return answerToUpdateIndex;
}
