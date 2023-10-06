import db from './index-db';

/**
 * Saves the list of stored prompt answers in indexDB.
 *
 * @param {String} promptAnswersKey - Prompt answers key.
 * @param {String} promptAnswersData - The list of prompt answers.
 */
export async function savePromptAnswersInIndexDB(promptAnswersKey: string, promptAnswersData: Array<Object>) {
  if (promptAnswersData) {
    if (db?.table('promptAnswers')) {
      db?.table('promptAnswers')?.clear();
    }
    await db?.table('promptAnswers')?.add({ key: promptAnswersKey, data: promptAnswersData });
  }
}

/**
 * Retrieves the list of stored prompt answers from indexDB by prompt answers key.
 *
 * @param {String} promptAnswersKey - Prompt answers key.
 * @returns {Array} The list of prompt answers.
 */
export async function getPromptAnswersFromIndexDB(promptAnswersKey: string) {
  const storedPromptAnswers = await db?.table('promptAnswers')?.where('key')
    .equals(promptAnswersKey)
    .toArray();

  if (storedPromptAnswers && storedPromptAnswers?.length > 0) {
    return storedPromptAnswers[0]?.data;
  }
  return null;
}
