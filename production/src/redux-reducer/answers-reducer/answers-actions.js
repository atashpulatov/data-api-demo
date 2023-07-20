export const RESTORE_ALL_ANSWERS = 'RESTORE_ALL_ANSWERS';
export const RESET_ANSWERS = 'RESET_ANSWERS';
export const UPDATE_ANSWERS = 'UPDATE_ANSWERS';

/**
 * Function to restore all answers.
 * It is dispatched when the answers are restored from the Office settings backup.
 * @param {*} answers
 * @returns
 */
export const restoreAllAnswers = (answers) => ({
  type: RESTORE_ALL_ANSWERS,
  payload: answers,
});

/**
 * Function to restore all answers.
 * It is dispatched when the answers are received from the editing or re-prompting a Dossier/Report.
 * @param {*} updatedAnswers
 * @returns
 */
export const updateAnswers = (updatedAnswers) => ({
  type: UPDATE_ANSWERS,
  payload: updatedAnswers,
});

/**
 * Function to reset all answers.
 * It is dispatched when user either toggles off the
 * "Re-use Prompt answers" setting or logs off.
 * @returns
 */
export const resetAnswers = () => ({ type: RESET_ANSWERS, });
