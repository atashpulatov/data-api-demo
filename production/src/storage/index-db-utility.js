import db from './index-db';

  /**
   * Saves the list of stored prompt answers in indexDB.
   *
   * @param {String} promptAnswersKey - Prompt answers key.
   * @param {String} promptAnswersData - The list of prompt answers.
   */
export async function savePromptAnswersInIndexDB(promptAnswersKey, promptAnswersData) {
    if (promptAnswersData) {
        if (db.promptAnswers) {
            db.promptAnswers.clear();
        }
        await db.promptAnswers.add({ key: promptAnswersKey, data: promptAnswersData });
    }
}

  /**
   * Retrieves the list of stored prompt answers from indexDB by prompt answers key.
   *
   * @param {String} promptAnswersKey - Prompt answers key.
   * @returns {Array} The list of prompt answers.
   */
export async function getPromptAnswersFromIndexDB(promptAnswersKey) {
    const storedPromptAnswers = await db.promptAnswers
      .where('key')
      .equals(promptAnswersKey)
      .toArray();

    if (storedPromptAnswers && storedPromptAnswers.length > 0) {
      return storedPromptAnswers[0].data;
    }
    return null;
  }
  