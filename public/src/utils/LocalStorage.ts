type Cache = { [key: string]: string };

export class LocalStorage {
  static cache: Cache = {};

  static set(key: string, value: string) {
    localStorage.setItem(key, value);
    LocalStorage.cache[key] = value;
  }

  static get(key: string): string {
    if (!LocalStorage.cache[key]) {
      const value = localStorage.getItem(key);
      if (value) {
        LocalStorage.cache[key] = value;
        return value;
      }
    }

    return LocalStorage.cache[key] as string;
  }

  static delete(key: string) {
    localStorage.removeItem(key);
    delete LocalStorage.cache[key];
  }
}
