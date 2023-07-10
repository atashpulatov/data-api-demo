export const RESTORE_ALL_ANSWERS = "RESTORE_ALL_ANSWERS";

export const UPDATE_ANSWER = "UPDATE_ANSWER";

export const restoreAllAnswers = (answers) => ({
  type: RESTORE_ALL_ANSWERS,
  payload: answers,
});

export const updateAnswer = (updatedAnswer) => ({
  type: UPDATE_ANSWER,
  payload: updatedAnswer,
});
