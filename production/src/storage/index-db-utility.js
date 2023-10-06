import db from './index-db';

export async function savePromptAnswersInIndexDB(promptAnswersKey, promptAnswersData) {
    if (promptAnswersData) {
        if (db.promptAnswers) {
            db.promptAnswers.clear();
        }
        await db.promptAnswers.add({ key: promptAnswersKey, data: promptAnswersData });
    }
}

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