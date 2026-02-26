export const createBrowserStorage = (): Storage => {
  if (typeof window === "undefined") {
    let store: Record<string, string> = {};
    return {
      get length() {
        return Object.keys(store).length;
      },
      clear(): void {
        store = {};
      },
      getItem(key: string): string | null {
        return store[key] ?? null;
      },
      key(index: number): string | null {
        return Object.keys(store)[index] ?? null;
      },
      removeItem(key: string): void {
        delete store[key];
      },
      setItem(key: string, value: string): void {
        store[key] = value;
      },
    };
  }
  return window.localStorage;
};
