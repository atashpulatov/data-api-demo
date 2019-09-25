import { HistoryError } from './history-error';

class HistoryHelper {
  isDirectoryStored(dirArr) {
    return ((dirArr !== undefined) && (dirArr.length > 0));
  }

  getCurrentDirectory(dirArr) {
    if (!dirArr || (dirArr.length == 0)) {
      throw new HistoryError('No directory ID was stored.');
    }
    return dirArr[dirArr.length - 1];
  }
}

export const historyHelper = new HistoryHelper();
