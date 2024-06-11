export class StorageHelper {
  getStorageItem(key = 'iSession'): string {
    return window.localStorage.getItem(key);
  }
}

export const storageHelper = new StorageHelper();
