import {
  AnswerActionTypes,
  ClearAnswersAction,
  PromptsAnswer,
  RestoreAllAnswersAction,
} from './answers-reducer-types';

/**
 * Function to restore all answers.
 * It is dispatched when the answers are restored from the Office settings backup.
 * @param answers
 * @returns
 */
export const restoreAllAnswers = (answers: PromptsAnswer[]): RestoreAllAnswersAction => ({
  type: AnswerActionTypes.RESTORE_ALL_ANSWERS,
  payload: answers,
});

/**
 * Function to reset all answers.
 * It is dispatched when user either toggles off the
 * "Re-use Prompt answers" setting or logs off.
 * @returns
 */
export const clearAnswers = (): ClearAnswersAction => ({ type: AnswerActionTypes.CLEAR_ANSWERS });
