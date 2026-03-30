import { STORAGE_KEYS } from "./storageKeys";

class StorageService {
  constructor(storage = localStorage) {
    this.storage = storage;
    this.keys = Object.values(STORAGE_KEYS);
  }

  getStorage() {
    return this.storage;
  }

  setItem(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  clearStorage() {
    this.keys.forEach((key) => {
      this.storage.removeItem(key);
    });
  }
}

export const storageService = new StorageService();
