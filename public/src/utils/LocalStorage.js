export class LocalStorage {
  static cache = {};

  static set(key, value) {
    localStorage.setItem(key, value);
    LocalStorage.cache[key] = value;
  }

  static get(key) {
    if (!LocalStorage.cache[key]) {
      const value = localStorage.getItem(key);
      LocalStorage.cache[key] = value;
      return value;
    }

    return LocalStorage.cache[key];
  }

  static delete(key) {
    localStorage.removeItem(key);
    delete LocalStorage.cache;
  }
}
